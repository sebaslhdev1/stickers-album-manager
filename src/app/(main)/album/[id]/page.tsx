"use client"

import { StickerCard } from "@/components/stickers/sticker-card"
import { StickersDetailPanel } from "@/components/stickers/stickers-detail-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/constants"
import { useDebounce } from "@/hooks/use-debounce"
import { isSectionCountry, useCountry } from "@/i18n/countries"
import { useT } from "@/i18n/use-t"
import { getErrorMessage } from "@/lib/errors"
import { getAlbum } from "@/services/albums"
import { getStickers, saveStickers } from "@/services/stickers"
import type { Album, AlbumColors, Sticker } from "@/types"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  List,
  RotateCcw,
  Save,
  Search,
  Star,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

const DEFAULT_COLORS: AlbumColors = {
  primary: "#3b82f6",
  secondary: "#1d4ed8",
  accent: "#f59e0b",
  background: "#f8fafc",
  card: "#ffffff",
}

function withAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const t = useT()
  const getCountry = useCountry()
  const [album, setAlbum] = useState<Album | null>(null)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery)
  const [activeSections, setActiveSections] = useState<Set<string>>(new Set())
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  )
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [savedCompleted, setSavedCompleted] = useState<Set<string>>(new Set())
  const originalAmounts = useRef<Map<string, number>>(new Map())
  const stickersRef = useRef<Sticker[]>([])

  useLayoutEffect(() => {
    stickersRef.current = stickers
  })

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
        setCollapsedSections(new Set(stickersData.map((s) => s.section)))
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setMounted(true), 50)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  useEffect(() => {
    if (dirty.size === 0) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty.size])

  const colors = album?.colors ?? DEFAULT_COLORS

  const sections = useMemo(
    () =>
      stickers.reduce<Record<string, Sticker[]>>((acc, s) => {
        ;(acc[s.section] ??= []).push(s)
        return acc
      }, {}),
    [stickers],
  )

  const updateDirty = useCallback((stickerId: string, newAmount: number) => {
    setDirty((prev) => {
      const next = new Set(prev)
      if (newAmount === originalAmounts.current.get(stickerId)) {
        next.delete(stickerId)
      } else {
        next.add(stickerId)
      }
      return next
    })
  }, [])

  const handleAdd = useCallback(
    (stickerId: string) => {
      const sticker = stickersRef.current.find((s) => s.id === stickerId)!
      const newAmount = sticker.amount + 1
      setStickers((prev) =>
        prev.map((s) => (s.id === stickerId ? { ...s, amount: newAmount } : s)),
      )
      updateDirty(stickerId, newAmount)
    },
    [updateDirty],
  )

  const handleRemove = useCallback(
    (stickerId: string) => {
      const sticker = stickersRef.current.find((s) => s.id === stickerId)!
      if (sticker.amount <= 0) return
      const newAmount = Math.max(0, sticker.amount - 1)
      setStickers((prev) =>
        prev.map((s) => (s.id === stickerId ? { ...s, amount: newAmount } : s)),
      )
      updateDirty(stickerId, newAmount)
    },
    [updateDirty],
  )

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
    setIsSaving(true)
    setSaveError(null)
    try {
      const modified = stickers.filter((s) => dirty.has(s.id))
      await saveStickers(id, modified)
      modified.forEach((s) => originalAmounts.current.set(s.id, s.amount))
      // Compute completion from server-confirmed state, not optimistic UI state
      const willBeComplete =
        stickers.length > 0 &&
        stickers.every((s) => (originalAmounts.current.get(s.id) ?? 0) > 0)
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

  const stats = useMemo(
    () => ({
      total: stickers.length,
      collected: stickers.filter((s) => s.amount > 0).length,
      missing: stickers.filter((s) => s.amount === 0).length,
      repeated: stickers.reduce((sum, s) => sum + Math.max(0, s.amount - 1), 0),
    }),
    [stickers],
  )

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
        <Skeleton className='mb-6 h-4 w-28 rounded-full' />
        <Skeleton className='mb-8 h-44 w-full rounded-2xl' />
        <div className='mb-6 flex gap-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-7 w-16 rounded-full' />
          ))}
        </div>
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
          {t.album.backToAlbums}
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
                  {t.album.albumComplete}
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
                    {t.album.albumLabel}
                  </p>
                  <h1 className='text-3xl font-bold tracking-tight text-white'>
                    {album.name}
                  </h1>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {[
                    { label: t.album.total, value: stats.total },
                    { label: t.album.gotten, value: stats.collected },
                    { label: t.album.missing, value: stats.missing },
                    { label: t.album.repeated, value: stats.repeated },
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
        <div className='mb-6 space-y-3'>
          {/* Search input */}
          <div
            className='flex items-center gap-2 rounded-xl border px-3 py-2'
            style={{
              borderColor: withAlpha(colors.primary, 0.2),
              backgroundColor: withAlpha(colors.primary, 0.04),
            }}
          >
            <Search
              className='h-3.5 w-3.5 shrink-0'
              style={{ color: withAlpha(colors.primary, 0.5) }}
            />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.album.searchPlaceholder}
              className='w-full bg-transparent text-xs outline-none placeholder:text-gray-400'
              style={{ color: colors.primary }}
            />
          </div>

          {/* Summary row — always visible */}
          <div className='flex items-center justify-between'>
            <button
              onClick={() => setIsFiltersOpen((o) => !o)}
              className='flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-70'
            >
              <span
                className='text-xs font-bold uppercase tracking-widest'
                style={{ color: colors.primary }}
              >
                {t.album.filters}
              </span>
              <span
                className='text-xs font-semibold'
                style={{ color: colors.primary }}
              >
                {activeSections.size === 0
                  ? t.album.all
                  : [...activeSections]
                      .slice(0, 3)
                      .map((s) => s.toUpperCase())
                      .join(", ") + (activeSections.size > 3 ? "…" : "")}
              </span>
              <ChevronDown
                className='h-3.5 w-3.5 transition-transform duration-200'
                style={{
                  color: colors.primary,
                  transform: isFiltersOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            <button
              onClick={() => setIsPanelOpen(true)}
              className='flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80'
              style={{ backgroundColor: colors.primary }}
            >
              <List className='h-3.5 w-3.5' />
              {t.album.details}
            </button>
          </div>

          {/* Filter pills — collapsible */}
          {isFiltersOpen && (
            <div className='flex flex-wrap gap-2'>
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
                {t.album.all}
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
            </div>
          )}
        </div>

        {/* Sticker grid */}
        <div className='space-y-3 pb-24'>
          {(() => {
            const q = debouncedQuery.trim().toLowerCase()
            const allEntries = Object.entries(sections)
            const searchMatches = !q
              ? allEntries
              : allEntries.filter(([section]) =>
                  getCountry(section).name.toLowerCase().includes(q) ||
                  section.toLowerCase().includes(q),
                )
            const noSearchMatch = q.length > 0 && searchMatches.length === 0
            const entriesToShow = noSearchMatch ? allEntries : searchMatches
            return (
              <>
                {noSearchMatch && (
                  <p className='mb-2 text-xs' style={{ color: withAlpha(colors.primary, 0.6) }}>
                    {t.album.searchNoMatch}
                  </p>
                )}
                {entriesToShow
                  .filter(([section]) => activeSections.size === 0 || activeSections.has(section))
            .map(([section, sectionStickers], index) => {
              const total = sectionStickers.length
              const collected = sectionStickers.filter((s) =>
                savedCompleted.has(s.id),
              ).length
              const done = collected === total
              const isCollapsed = collapsedSections.has(section)
              return (
                <section
                  key={section}
                  className='overflow-hidden rounded-2xl transition-all duration-500'
                  style={{
                    transitionDelay: `${index * 60}ms`,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    backgroundColor: colors.card,
                    border: `1px solid ${done ? "#bbf7d0" : withAlpha(colors.primary, 0.15)}`,
                    boxShadow: `0 2px 8px ${done ? "rgba(22,163,74,0.10)" : withAlpha(colors.primary, 0.07)}`,
                  }}
                >
                  <button
                    onClick={() =>
                      setCollapsedSections((prev) => {
                        const next = new Set(prev)
                        if (next.has(section)) next.delete(section)
                        else next.add(section)
                        return next
                      })
                    }
                    className='flex w-full cursor-pointer items-center justify-between px-4 py-3 transition-colors'
                    style={{
                      backgroundColor: done
                        ? "#f0fdf4"
                        : withAlpha(colors.primary, 0.06),
                    }}
                  >
                    <h2
                      className='flex items-center gap-2 text-sm font-bold tracking-tight'
                      style={{ color: done ? "#15803d" : colors.primary }}
                    >
                      {isSectionCountry(section) ? (
                        <span
                          className={`fi fi-${getCountry(section).isoCode} rounded-sm`}
                          style={{ fontSize: "1.1em" }}
                        />
                      ) : (
                        <Star
                          className='h-3.5 w-3.5'
                          fill='#facc15'
                          color='#facc15'
                        />
                      )}
                      {getCountry(section).name}
                    </h2>
                    <div className='flex items-center gap-2'>
                      {done ? (
                        <span className='flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white'>
                          <CheckCircle2 className='h-3 w-3' />
                          {t.album.complete}
                        </span>
                      ) : (
                        <span
                          className='text-[11px] font-semibold tabular-nums'
                          style={{ color: colors.primary }}
                        >
                          {collected} / {total}
                        </span>
                      )}
                      <ChevronDown
                        className='h-3.5 w-3.5 transition-transform duration-200'
                        style={{
                          color: done ? "#15803d" : colors.primary,
                          transform: isCollapsed
                            ? "rotate(0deg)"
                            : "rotate(180deg)",
                        }}
                      />
                    </div>
                  </button>
                  <div
                    className='grid'
                    style={{
                      gridTemplateRows: isCollapsed ? "0fr" : "1fr",
                      transition: "grid-template-rows 280ms ease-in-out",
                    }}
                  >
                    <div className='overflow-hidden'>
                      <div className='p-4'>
                        <div className='grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'>
                          {sectionStickers.map((sticker) => (
                            <StickerCard
                              key={sticker.id}
                              id={sticker.id}
                              number={sticker.number}
                              amount={sticker.amount}
                              onAdd={handleAdd}
                              onRemove={handleRemove}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
              </>
            )
          })()}
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
            {t.album.discard}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='flex items-center gap-2 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-opacity disabled:opacity-70'
            style={{ backgroundColor: colors.primary }}
          >
            <Save className='h-3.5 w-3.5' />
            {isSaving ? t.album.saving : `${t.album.save} (${dirty.size})`}
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
