"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useT } from "@/i18n/use-t"
import type { Album, AlbumColors, AlbumStats } from "@/types"
import {
  CheckCircle2,
  CircleDashed,
  Copy,
  Layers,
  Trophy,
} from "lucide-react"
import Link from "next/link"

export function AlbumStatsPanel({
  album,
  colors,
  stats,
}: {
  album: Album
  colors: AlbumColors
  stats: AlbumStats | null | undefined
}) {
  const t = useT()
  const isLoading = stats === undefined
  const hasError = stats === null

  const statTiles = stats
    ? [
        { label: t.album.totalStickers, value: stats.total, color: colors.primary, Icon: Layers },
        { label: t.album.collected, value: stats.collected, color: colors.primary, Icon: CheckCircle2 },
        { label: t.album.missing, value: stats.missing, color: colors.accent, Icon: CircleDashed },
        { label: t.album.repeated, value: stats.repeated, color: colors.accent, Icon: Copy },
      ]
    : []

  return (
    <div className='mt-10'>
      <div
        className='overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/8'
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div
          className='flex items-center justify-between px-6 py-4'
          style={{ backgroundColor: colors.primary }}
        >
          <div className='flex items-center gap-2.5'>
            <Trophy className='h-4 w-4 text-white opacity-80' />
            <span className='font-semibold text-white'>{album.name}</span>
          </div>
          <Link
            href={`/album/${album.id}`}
            className='rounded-lg px-3 py-1.5 text-xs font-semibold text-white'
            style={{ backgroundColor: colors.accent }}
          >
            {t.album.openAlbum}
          </Link>
        </div>

        {isLoading ? (
          <div className='space-y-6 p-6'>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-24 rounded-xl' />
              ))}
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-4 w-10' />
              </div>
              <Skeleton className='h-3 w-full rounded-full' />
            </div>
          </div>
        ) : hasError ? (
          <div className='flex items-center justify-center py-14'>
            <p className='text-sm font-bold' style={{ color: colors.primary }}>
              {t.album.statsLoadError}
            </p>
          </div>
        ) : stats ? (
          <div className='space-y-6 p-6'>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {statTiles.map(({ label, value, color, Icon }) => (
                <div
                  key={label}
                  className='rounded-xl p-4'
                  style={{ backgroundColor: colors.card }}
                >
                  <Icon className='mb-2 h-4 w-4' style={{ color }} />
                  <p className='text-2xl font-bold' style={{ color }}>
                    {value}
                  </p>
                  <p className='mt-0.5 text-xs' style={{ color: colors.secondary }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium' style={{ color: colors.primary }}>
                  {t.album.progress}
                </span>
                <span className='font-semibold' style={{ color: colors.accent }}>
                  {stats.progress}%
                </span>
              </div>
              <div
                className='h-3 overflow-hidden rounded-full'
                style={{ backgroundColor: colors.secondary }}
              >
                <div
                  className='h-full rounded-full transition-all duration-700'
                  style={{ width: `${stats.progress}%`, backgroundColor: colors.primary }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
