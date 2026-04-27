"use client"

import { StickerCard } from "@/components/stickers/sticker-card"
import { ROUTES } from "@/constants"
import { getErrorMessage } from "@/lib/errors"
import { getAlbum } from "@/services/albums"
import { getStickers, saveStickers } from "@/services/stickers"
import type { Album, AlbumColors, Sticker } from "@/types"
import { ArrowLeft, CheckCircle2, RotateCcw, Save } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const DEFAULT_COLORS: AlbumColors = {
  primary: "#3b82f6",
  secondary: "#1d4ed8",
  accent: "#f59e0b",
  background: "#f8fafc",
  card: "#ffffff",
}

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [album, setAlbum] = useState<Album | null>(null)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const originalAmounts = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    Promise.all([getAlbum(id), getStickers(id)])
      .then(([albumData, stickersData]) => {
        setAlbum(albumData)
        setStickers(stickersData)
        originalAmounts.current = new Map(
          stickersData.map((s) => [s.id, s.amount]),
        )
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setMounted(true), 50)
      return () => clearTimeout(t)
    }
  }, [isLoading])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (dirty.size === 0) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty.size])

  const colors = album?.colors ?? DEFAULT_COLORS

  const sections = stickers.reduce<Record<string, Sticker[]>>((acc, s) => {
    ;(acc[s.section] ??= []).push(s)
    return acc
  }, {})

  function updateDirty(stickerId: string, newAmount: number) {
    setDirty((prev) => {
      const next = new Set(prev)
      if (newAmount === originalAmounts.current.get(stickerId)) {
        next.delete(stickerId)
      } else {
        next.add(stickerId)
      }
      return next
    })
  }

  function handleAdd(stickerId: string) {
    const sticker = stickers.find((s) => s.id === stickerId)!
    const newAmount = sticker.amount + 1
    setStickers((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, amount: newAmount } : s)),
    )
    updateDirty(stickerId, newAmount)
  }

  function handleRemove(stickerId: string) {
    const sticker = stickers.find((s) => s.id === stickerId)!
    if (sticker.amount === 0) return
    const newAmount = sticker.amount - 1
    setStickers((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, amount: newAmount } : s)),
    )
    updateDirty(stickerId, newAmount)
  }

  function handleDiscard() {
    setStickers((prev) =>
      prev.map((s) => ({
        ...s,
        amount: originalAmounts.current.get(s.id) ?? s.amount,
      })),
    )
    setDirty(new Set())
  }

  async function handleSave() {
    if (dirty.size === 0 || isSaving) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const modified = stickers.filter((s) => dirty.has(s.id))
      await saveStickers(id, modified)
      modified.forEach((s) => originalAmounts.current.set(s.id, s.amount))
      setDirty(new Set())
    } catch (err) {
      setSaveError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  const stats = {
    total: stickers.length,
    collected: stickers.filter((s) => s.amount > 0).length,
    missing: stickers.filter((s) => s.amount === 0).length,
    repeated: stickers.filter((s) => s.amount > 1).length,
  }

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <p className='text-muted-foreground'>Loading stickers…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <p className='text-sm text-destructive'>{loadError}</p>
      </div>
    )
  }

  return (
    <div
      className='min-h-screen transition-colors duration-700'
      style={{ backgroundColor: colors.background }}
    >
      <div className='mx-auto max-w-5xl px-6 py-8'>
        {/* Back button */}
        <button
          onClick={() => router.push(ROUTES.HOME)}
          className='mb-6 flex items-center gap-1.5 cursor-pointer text-sm transition-all duration-300 hover:opacity-70'
          style={{
            color: colors.primary,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-6px)",
          }}
        >
          <ArrowLeft className='h-4 w-4' />
          Back to albums
        </button>

        {/* Album header */}
        {album && (
          <div
            className='mb-8 overflow-hidden rounded-2xl shadow-xl transition-all duration-500'
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
            }}
          >
            <div className='flex items-end gap-6 p-6'>
              <div className='relative h-36 w-24 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-2 ring-white/20'>
                <Image
                  src={album.image_url}
                  alt={album.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col gap-4 pb-1'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-widest text-white/60'>
                    Album
                  </p>
                  <h1 className='text-3xl font-bold tracking-tight text-white'>
                    {album.name}
                  </h1>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {[
                    { label: "Total", value: stats.total },
                    { label: "Gotten", value: stats.collected },
                    { label: "Missing", value: stats.missing },
                    { label: "Repeated", value: stats.repeated },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className='rounded-lg px-3 py-1.5 text-center'
                      style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                    >
                      <p className='text-base font-bold text-white'>{value}</p>
                      <p className='text-[10px] font-medium uppercase tracking-wide text-white/70'>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticker grid */}
        <div className='space-y-8 pb-24'>
          {Object.entries(sections).map(([section, sectionStickers], index) => (
            <section
              key={section}
              className='transition-all duration-500'
              style={{
                transitionDelay: `${index * 60}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {(() => {
                const collected = sectionStickers.filter((s) => s.amount > 0).length
                const total = sectionStickers.length
                const done = collected === total
                return (
                  <div className="mb-3 flex items-center justify-between">
                    <h2
                      className='text-xs font-extrabold uppercase tracking-widest'
                      style={{ color: colors.primary }}
                    >
                      {section}
                    </h2>
                    {done ? (
                      <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: colors.primary }}>
                        <CheckCircle2 className="h-3 w-3" />
                        Complete
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold tabular-nums" style={{ color: colors.primary }}>
                        {collected} / {total}
                      </span>
                    )}
                  </div>
                )
              })()}
              <div className='grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'>
                {sectionStickers.map((sticker) => (
                  <StickerCard
                    key={sticker.id}
                    number={sticker.number}
                    amount={sticker.amount}
                    onAdd={() => handleAdd(sticker.id)}
                    onRemove={() => handleRemove(sticker.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Floating save/discard bar */}
      <div
        className='fixed bottom-6 left-0 right-0 flex flex-col items-center gap-2 transition-all duration-300'
        style={{
          opacity: dirty.size > 0 ? 1 : 0,
          transform: dirty.size > 0 ? "translateY(0)" : "translateY(16px)",
          pointerEvents: dirty.size > 0 ? "auto" : "none",
        }}
      >
        {saveError && (
          <p className='rounded-full bg-destructive/10 px-4 py-1.5 text-xs font-medium text-destructive'>
            {saveError}
          </p>
        )}
        <div className='flex items-center gap-2 overflow-hidden rounded-full bg-white p-1.5 shadow-xl ring-1 ring-black/10'>
          <button
            onClick={handleDiscard}
            disabled={isSaving}
            className='flex items-center gap-2 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50'
          >
            <RotateCcw className='h-3.5 w-3.5' />
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='flex items-center gap-2 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-opacity disabled:opacity-70'
            style={{ backgroundColor: colors.primary }}
          >
            <Save className='h-3.5 w-3.5' />
            {isSaving ? "Saving…" : `Save (${dirty.size})`}
          </button>
        </div>
      </div>
    </div>
  )
}
