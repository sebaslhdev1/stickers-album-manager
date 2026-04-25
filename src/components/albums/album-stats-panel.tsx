"use client";

import { useEffect, useState } from "react";
import { getAlbumStats } from "@/services/albums";
import type { Album, AlbumColors, AlbumStats } from "@/types";
import { CheckCircle2, CircleDashed, Copy, Layers, Loader2, Trophy } from "lucide-react";
import Link from "next/link";

export function AlbumStatsPanel({
  album,
  colors,
}: {
  album: Album;
  colors: AlbumColors;
}) {
  const [result, setResult] = useState<{ albumId: string; stats: AlbumStats } | null>(null);

  const isLoading = result?.albumId !== album.id;

  useEffect(() => {
    getAlbumStats(album.id).then((stats) =>
      setResult({ albumId: album.id, stats })
    );
  }, [album.id]);

  const stats = result?.stats;

  const statTiles = stats
    ? [
        { label: "Total stickers", value: stats.total, color: colors.primary, Icon: Layers },
        { label: "Collected", value: stats.collected, color: colors.primary, Icon: CheckCircle2 },
        { label: "Missing", value: stats.missing, color: colors.accent, Icon: CircleDashed },
        { label: "Repeated", value: stats.repeated, color: colors.accent, Icon: Copy },
      ]
    : [];

  return (
    <div className="mt-10">
      <div
        className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/8"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex items-center gap-2.5">
            <Trophy className="h-4 w-4 text-white opacity-80" />
            <span className="font-semibold text-white">{album.name}</span>
          </div>
          <Link
            href={`/album/${album.id}`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: colors.accent }}
          >
            Open Album
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: colors.primary }} />
          </div>
        ) : stats ? (
          <div className="space-y-6 p-6">
            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statTiles.map(({ label, value, color, Icon }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: colors.card }}
                >
                  <Icon className="mb-2 h-4 w-4" style={{ color }} />
                  <p className="text-2xl font-bold" style={{ color }}>
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: colors.secondary }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium" style={{ color: colors.primary }}>
                  Progress
                </span>
                <span className="font-semibold" style={{ color: colors.accent }}>
                  {stats.progress}%
                </span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full"
                style={{ backgroundColor: colors.secondary }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.progress}%`, backgroundColor: colors.primary }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
