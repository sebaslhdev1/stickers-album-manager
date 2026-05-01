"use client"

import { AlbumCard } from "@/components/albums/album-card"
import { AlbumStatsPanel } from "@/components/albums/album-stats-panel"
import { useT } from "@/i18n/use-t"
import { getAlbumStats, getAlbums } from "@/services/albums"
import type { Album, AlbumColors, AlbumStats } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
}

const FALLBACK_PALETTES: AlbumColors[] = [
  {
    primary: "#7c3aed",
    secondary: "#ddd6fe",
    accent: "#10b981",
    background: "#faf5ff",
    card: "#ffffff",
  },
  {
    primary: "#0891b2",
    secondary: "#a5f3fc",
    accent: "#f43f5e",
    background: "#ecfeff",
    card: "#ffffff",
  },
  {
    primary: "#16a34a",
    secondary: "#bbf7d0",
    accent: "#f97316",
    background: "#f0fdf4",
    card: "#ffffff",
  },
]

function getMockColors(album: Album): AlbumColors {
  for (const [key, palette] of Object.entries(NAMED_PALETTES)) {
    if (album.name.includes(key)) return palette
  }
  const hash = album.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return FALLBACK_PALETTES[hash % FALLBACK_PALETTES.length]
}

export default function HomePage() {
  const t = useT()
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [albumStats, setAlbumStats] = useState<Record<string, AlbumStats | null>>({})
  const fetchedIds = useRef(new Set<string>())

  useEffect(() => {
    getAlbums()
      .then((data) => {
        setAlbums(data)
        setSelectedAlbum(data[0] ?? null)
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [])

  const selectedAlbumId = selectedAlbum?.id ?? null

  useEffect(() => {
    if (!selectedAlbumId || fetchedIds.current.has(selectedAlbumId)) return
    fetchedIds.current.add(selectedAlbumId)
    getAlbumStats(selectedAlbumId)
      .then((s) => setAlbumStats((prev) => ({ ...prev, [selectedAlbumId]: s })))
      .catch(() => setAlbumStats((prev) => ({ ...prev, [selectedAlbumId]: null })))
  }, [selectedAlbumId])

  const completedAlbumIds = new Set(
    Object.entries(albumStats)
      .filter(([, s]) => s !== null && s.total > 0 && s.collected === s.total)
      .map(([id]) => id),
  )

  const resolvedColors = selectedAlbum
    ? (selectedAlbum.colors ?? getMockColors(selectedAlbum))
    : null

  return (
    <div className='mx-auto max-w-6xl px-6 py-12'>
      {/* Page header */}
      <div className='mb-10'>
        <p className='mb-2 text-xs font-semibold uppercase tracking-widest' style={{ color: 'var(--brand-orange)' }}>
          {t.home.myCollection}
        </p>
        <div className='flex items-end justify-between'>
          <h1 className='text-5xl font-bold tracking-tight' style={{ color: 'var(--brand-dark)' }}>{t.home.title}</h1>
          {!isLoading && albums.length > 0 && (
            <div className='text-right'>
              <span className='text-4xl font-bold' style={{ color: 'var(--brand-orange)' }}>
                {albums.length}
              </span>
              <p className='mt-0.5 text-xs' style={{ color: 'var(--brand-muted)' }}>
                {albums.length === 1 ? t.home.albumSingular : t.home.albumsPlural}
              </p>
            </div>
          )}
        </div>
        <p className='mt-3' style={{ color: 'var(--brand-muted)' }}>
          {t.home.subtitle}
        </p>
        <div className='mt-6 h-px' style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--brand-orange) 40%, transparent), color-mix(in srgb, var(--brand-orange) 10%, transparent), transparent)' }} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 w-full rounded-2xl" />
          ))}
        </div>
      ) : hasError ? (
        <div className='py-32 text-center'>
          <p className='text-sm text-destructive'>{t.home.loadError}</p>
        </div>
      ) : albums.length === 0 ? (
        <div className='py-32 text-center'>
          <BookOpen className='mx-auto mb-4 h-12 w-12 text-muted-foreground/40' />
          <p className='font-medium text-muted-foreground'>
            {t.home.noAlbums}
          </p>
          <p className='mt-1 text-sm text-muted-foreground/60'>
            {t.home.noAlbumsHint}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              selected={selectedAlbum?.id === album.id}
              isComplete={completedAlbumIds.has(album.id)}
              onSelect={() => setSelectedAlbum(album)}
            />
          ))}
        </div>
      )}

      {selectedAlbum && resolvedColors && (
        <AlbumStatsPanel
          album={selectedAlbum}
          colors={resolvedColors}
          stats={albumStats[selectedAlbum.id]}
        />
      )}
    </div>
  )
}
