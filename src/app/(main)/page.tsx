"use client";

import { useEffect, useState } from "react";
import { AlbumCard } from "@/components/albums/album-card";
import { AlbumStatsPanel } from "@/components/albums/album-stats-panel";
import { getAlbums } from "@/services/albums";
import type { Album, AlbumColors } from "@/types";
import { BookOpen, Loader2 } from "lucide-react";

const NAMED_PALETTES: Record<string, AlbumColors> = {
  "2026": {
    primary: "#1B3F8B",
    secondary: "#B8CCE8",
    accent: "#E8181A",
    background: "#EDF2FB",
    card: "#FFFFFF",
  },
  "2022": {
    primary: "#5C1E3A",
    secondary: "#DDB99A",
    accent: "#C9952B",
    background: "#FDF5EE",
    card: "#FFFAF5",
  },
};

const FALLBACK_PALETTES: AlbumColors[] = [
  { primary: "#7c3aed", secondary: "#ddd6fe", accent: "#10b981", background: "#faf5ff", card: "#ffffff" },
  { primary: "#0891b2", secondary: "#a5f3fc", accent: "#f43f5e", background: "#ecfeff", card: "#ffffff" },
  { primary: "#16a34a", secondary: "#bbf7d0", accent: "#f97316", background: "#f0fdf4", card: "#ffffff" },
];

function getMockColors(album: Album): AlbumColors {
  for (const [key, palette] of Object.entries(NAMED_PALETTES)) {
    if (album.name.includes(key)) return palette;
  }
  const hash = album.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_PALETTES[hash % FALLBACK_PALETTES.length];
}

export default function HomePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    getAlbums()
      .then(setAlbums)
      .catch(() => setError("Could not load albums. Please try again."))
      .finally(() => setIsLoading(false));
  }, []);

  const resolvedColors = selectedAlbum
    ? (selectedAlbum.colors ?? getMockColors(selectedAlbum))
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          My Collection
        </p>
        <div className="flex items-end justify-between">
          <h1 className="text-5xl font-bold tracking-tight">Albums</h1>
          {!isLoading && albums.length > 0 && (
            <div className="text-right">
              <span className="text-4xl font-bold text-primary">{albums.length}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {albums.length === 1 ? "album" : "albums"} available
              </p>
            </div>
          )}
        </div>
        <p className="mt-3 text-muted-foreground">
          Select an album to explore your sticker collection.
        </p>
        <div className="mt-6 h-px bg-linear-to-r from-primary/30 via-primary/10 to-transparent" />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="py-32 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="py-32 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No albums available</p>
          <p className="mt-1 text-sm text-muted-foreground/60">Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              selected={selectedAlbum?.id === album.id}
              onSelect={() =>
                setSelectedAlbum((prev) =>
                  prev?.id === album.id ? null : album
                )
              }
            />
          ))}
        </div>
      )}

      {selectedAlbum && resolvedColors && (
        <AlbumStatsPanel album={selectedAlbum} colors={resolvedColors} />
      )}
    </div>
  );
}
