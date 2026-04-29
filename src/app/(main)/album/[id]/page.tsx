"use client"

import { StickerCard } from "@/components/stickers/sticker-card"
import { StickersDetailPanel } from "@/components/stickers/stickers-detail-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/constants"
import { getErrorMessage } from "@/lib/errors"
import { getAlbum } from "@/services/albums"
import { getStickers, saveStickers } from "@/services/stickers"
import type { Album, AlbumColors, Sticker } from "@/types"
import {
  ArrowLeft,
  CheckCircle2,
  List,
  RotateCcw,
  Save,
  Trophy,
} from "lucide-react"
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
  const [activeSections, setActiveSections] = useState<Set<string>>(new Set())
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [savedCompleted, setSavedCompleted] = useState<Set<string>>(new Set())
  const originalAmounts = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    Promise.all([getAlbum(id), getStickers(id)])
      .then(([albumData, stickersData]) => {
        setAlbum(albumData)
        setStickers(stickersData)
        originalAmounts.current = new Map(
          stickersData.map((s) => [s.id, s.amount]),
        )
        setSavedCompleted(
          new Set(stickersData.filter((s) => s.amount > 0).map((s) => s.id)),
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
    const wasComplete =
      stickers.length > 0 &&
      stickers.every((s) => (originalAmounts.current.get(s.id) ?? 0) > 0)
    const willBeComplete =
      stickers.length > 0 && stickers.every((s) => s.amount > 0)
    setIsSaving(true)
    setSaveError(null)
    try {
      const modified = stickers.filter((s) => dirty.has(s.id))
      await saveStickers(id, modified)
      modified.forEach((s) => originalAmounts.current.set(s.id, s.amount))
      setSavedCompleted((prev) => {
        const next = new Set(prev)
        modified.forEach((s) => {
          if (s.amount > 0) next.add(s.id)
          else next.delete(s.id)
        })
        return next
      })
      setDirty(new Set())
      setRefreshKey((k) => k + 1)
      if (!wasComplete && willBeComplete) {
        window.scrollTo({ top: 0, behavior: "smooth" })
        fireConfetti()
      }
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
    repeated: stickers.reduce((sum, s) => sum + Math.max(0, s.amount - 1), 0),
  }

  const isComplete =
    stickers.length > 0 && savedCompleted.size === stickers.length

  async function fireConfetti() {
    const confetti = (await import("canvas-confetti")).default
    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.6 },
      colors: [colors.primary, colors.accent, "#fbbf24", "#ffffff"],
    })
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
        colors: [colors.primary, colors.accent, "#fbbf24"],
      })
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.65 },
        colors: [colors.primary, colors.accent, "#fbbf24"],
      })
    }, 250)
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-5xl px-6 py-8'>
        {/* Header skeleton */}
        <Skeleton className='mb-6 h-4 w-28 rounded-full' />
        <Skeleton className='mb-8 h-44 w-full rounded-2xl' />
        {/* Filter bar skeleton */}
        <div className='mb-6 flex gap-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-7 w-16 rounded-full' />
          ))}
        </div>
        {/* Sticker grid skeleton */}
        <div className='space-y-8'>
          {Array.from({ length: 3 }).map((_, s) => (
            <div key={s}>
              <Skeleton className='mb-3 h-3 w-20 rounded' />
              <div className='grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className='h-16 rounded-xl' />
                ))}
              </div>
            </div>
          ))}
        </div>
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
            className={`mb-8 overflow-hidden rounded-2xl shadow-xl transition-all duration-500${isComplete ? " ring-4 ring-yellow-400/50 ring-offset-2" : ""}`}
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
            }}
          >
            {isComplete && (
              <div className='flex items-center justify-center gap-2.5 bg-linear-to-r from-yellow-500 to-amber-500 px-6 py-2.5'>
                <Trophy className='h-4 w-4 text-white' />
                <span className='text-sm font-bold uppercase tracking-widest text-white'>
                  Album Complete!
                </span>
                <Trophy className='h-4 w-4 text-white' />
              </div>
            )}
            <div className='flex items-center md:items-end gap-6 p-6'>
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

        {/* Section filter bar */}
        <div className='mb-6 flex flex-wrap items-center gap-2'>
          <button
            onClick={() => setActiveSections(new Set())}
            className='rounded-full px-3 py-1.5 text-xs font-semibold transition-colors'
            style={
              activeSections.size === 0
                ? { backgroundColor: colors.primary, color: "#fff" }
                : {
                    backgroundColor: "transparent",
                    color: colors.primary,
                    outline: `1.5px solid ${colors.primary}`,
                  }
            }
          >
            ALL
          </button>
          {Object.keys(sections).map((section) => (
            <button
              key={section}
              onClick={() =>
                setActiveSections((prev) => {
                  const next = new Set(prev)
                  if (next.has(section)) next.delete(section)
                  else next.add(section)
                  return next
                })
              }
              className='rounded-full px-3 py-1.5 text-xs font-semibold transition-colors'
              style={
                activeSections.has(section)
                  ? { backgroundColor: colors.primary, color: "#fff" }
                  : {
                      backgroundColor: "transparent",
                      color: colors.primary,
                      outline: `1.5px solid ${colors.primary}`,
                    }
              }
            >
              {section.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setIsPanelOpen(true)}
            className='ml-auto flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80'
            style={{ backgroundColor: colors.primary }}
          >
            <List className='h-3.5 w-3.5' />
            Details
          </button>
        </div>

        {/* Sticker grid */}
        <div className='space-y-8 pb-24'>
          {Object.entries(sections)
            .filter(
              ([section]) =>
                activeSections.size === 0 || activeSections.has(section),
            )
            .map(([section, sectionStickers], index) => (
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
                  const total = sectionStickers.length
                  const collected = sectionStickers.filter((s) =>
                    savedCompleted.has(s.id),
                  ).length
                  const done = collected === total
                  return (
                    <div className='mb-3 flex items-center justify-between'>
                      <h2
                        className='text-xs font-extrabold uppercase tracking-widest'
                        style={{ color: colors.primary }}
                      >
                        {section}
                      </h2>
                      {done ? (
                        <span
                          className='flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white'
                          style={{ backgroundColor: colors.primary }}
                        >
                          <CheckCircle2 className='h-3 w-3' />
                          Complete
                        </span>
                      ) : (
                        <span
                          className='text-[11px] font-semibold tabular-nums'
                          style={{ color: colors.primary }}
                        >
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

      <StickersDetailPanel
        albumId={id}
        colors={colors}
        isOpen={isPanelOpen}
        refreshKey={refreshKey}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}
