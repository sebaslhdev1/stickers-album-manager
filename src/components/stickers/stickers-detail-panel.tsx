"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/lib/errors"
import { getMissingStickers, getRepeatedStickers } from "@/services/stickers"
import type { AlbumColors } from "@/types"
import { StickerSection } from "@/components/stickers/sticker-section"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  albumId: string
  colors: AlbumColors
  isOpen: boolean
  refreshKey: number
  onClose: () => void
}

type PanelResult =
  | { key: string; status: "success"; missing: string[]; repeated: string[] }
  | { key: string; status: "error"; message: string }

export function StickersDetailPanel({
  albumId,
  colors,
  isOpen,
  refreshKey,
  onClose,
}: Props) {
  const [result, setResult] = useState<PanelResult | null>(null)

  const fetchKey = `${albumId}-${refreshKey}`
  const isLoading = isOpen && result?.key !== fetchKey

  useEffect(() => {
    if (!isOpen) return
    const key = `${albumId}-${refreshKey}`
    Promise.all([getMissingStickers(albumId), getRepeatedStickers(albumId)])
      .then(([missing, repeated]) =>
        setResult({ key, status: "success", missing, repeated }),
      )
      .catch((err) =>
        setResult({ key, status: "error", message: getErrorMessage(err) }),
      )
  }, [isOpen, albumId, refreshKey])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300'
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className='fixed bottom-0 right-0 top-0 z-40 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96'
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div
          className='flex shrink-0 items-center justify-between px-5 py-4'
          style={{ backgroundColor: colors.primary }}
        >
          <h2 className='text-sm font-bold text-white'>Sticker Details</h2>
          <button
            onClick={onClose}
            className='text-white/70 transition-colors hover:text-white'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-5'>
          {isLoading ? (
            <div className='space-y-6'>
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className='mb-3 h-4 w-24 rounded' />
                  <div className='flex flex-wrap gap-2'>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <Skeleton key={j} className='h-6 w-14 rounded-full' />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : result?.status === "error" ? (
            <p className='text-sm text-destructive'>{result.message}</p>
          ) : result?.status === "success" ? (
            <div className='space-y-8'>
              <StickerSection
                title='Missing'
                count={result.missing.length}
                items={result.missing}
                chipColor={colors.accent}
                emptyText='No missing stickers!'
              />
              <StickerSection
                title='Repeated'
                count={result.repeated.length}
                items={result.repeated}
                chipColor={colors.primary}
                emptyText='No repeated stickers.'
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
