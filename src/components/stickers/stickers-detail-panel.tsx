"use client"

import { useT } from "@/i18n/use-t"
import type { AlbumColors, Sticker } from "@/types"
import { StickerSection } from "@/components/stickers/sticker-section"
import { X } from "lucide-react"
import { useEffect } from "react"

interface Props {
  colors: AlbumColors
  isOpen: boolean
  onClose: () => void
  stickers: Sticker[]
}

export function StickersDetailPanel({ colors, isOpen, onClose, stickers }: Props) {
  const t = useT()

  const missing = stickers.filter((s) => s.amount === 0).map((s) => s.number)

  const repeated = stickers.flatMap((s) =>
    Array.from({ length: Math.max(0, s.amount - 1) }, () => s.number),
  )

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
          <h2 className='text-sm font-bold text-white'>{t.stickers.stickerDetails}</h2>
          <button
            onClick={onClose}
            className='text-white/70 transition-colors hover:text-white'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='min-h-0 flex-1 overflow-y-auto p-5 pb-20 md:pb-5'>
          <div className='space-y-8'>
            <StickerSection
              title={t.stickers.missing}
              count={missing.length}
              items={missing}
              chipColor={colors.accent}
              emptyText={t.stickers.noMissing}
            />
            <StickerSection
              title={t.stickers.repeated}
              count={repeated.length}
              items={repeated}
              chipColor={colors.primary}
              emptyText={t.stickers.noRepeated}
            />
          </div>
        </div>
      </div>
    </>
  )
}
