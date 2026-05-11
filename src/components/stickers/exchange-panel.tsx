"use client"

import { StickerSection } from "@/components/stickers/sticker-section"
import { Skeleton } from "@/components/ui/skeleton"
import { useT } from "@/i18n/use-t"
import { getErrorMessage } from "@/lib/errors"
import { getUserCode } from "@/lib/token"
import { getMatchingStickers } from "@/services/stickers"
import type { AlbumColors } from "@/types"
import { ArrowLeftRight, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Props {
  albumId: string
  colors: AlbumColors
  isOpen: boolean
  onClose: () => void
}

type SearchResult =
  | { status: "success"; myOffer: string[]; theirOffer: string[]; userName: string }
  | { status: "not_found" }
  | { status: "error"; message: string }

export function ExchangePanel({ albumId, colors, isOpen, onClose }: Props) {
  const t = useT()
  const [inputCode, setInputCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const myCode = getUserCode()

  async function handleSearch() {
    const code = inputCode.trim().toUpperCase()
    if (!code || isSearching) return
    setIsSearching(true)
    setResult(null)
    try {
      const data = await getMatchingStickers(albumId, code)
      setResult({ status: "success", myOffer: data.my_offer, theirOffer: data.their_offer, userName: data.exchange_user_name })
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        setResult({ status: "not_found" })
      } else {
        setResult({ status: "error", message: getErrorMessage(err) })
      }
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 320)
    } else {
      setTimeout(() => {
        setInputCode("")
        setResult(null)
      }, 0)
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 right-0 top-0 z-40 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-5 py-4"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-white" />
              <h2 className="text-sm font-bold text-white">{t.exchange.title}</h2>
            </div>
            <button onClick={onClose} className="text-white/70 transition-colors hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          {myCode && (
            <div className="mt-2.5 flex items-center gap-1.5 self-start rounded-full bg-white/15 px-2.5 py-1 w-fit">
              <span className="text-[10px] font-medium text-white/60">{t.exchange.yourCode}:</span>
              <span className="text-xs font-black tracking-widest text-white">{myCode}</span>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="shrink-0 border-b px-5 py-4" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
              placeholder={t.exchange.searchPlaceholder}
              maxLength={6}
              className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm font-mono tracking-widest outline-none transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-gray-400 focus:ring-2"
              style={{
                borderColor: "rgba(0,0,0,0.12)",
                color: colors.primary,
              }}
            />
            <button
              onClick={handleSearch}
              disabled={!inputCode.trim() || isSearching}
              className="flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: colors.primary }}
            >
              <Search className="h-3.5 w-3.5" />
              {isSearching ? t.exchange.searching : t.exchange.search}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-20 md:pb-5">
          {/* Empty state */}
          {!result && !isSearching && (
            <div className="flex flex-col items-center justify-center gap-3 pt-12 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${colors.primary}18` }}
              >
                <ArrowLeftRight className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                {t.exchange.emptyState}
              </p>
              <p className="max-w-55 text-xs text-gray-400">{t.exchange.emptyStateHint}</p>
            </div>
          )}

          {/* Loading */}
          {isSearching && (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-3 h-4 w-28 rounded" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-14 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Not found */}
          {result?.status === "not_found" && (
            <div className="flex flex-col items-center justify-center gap-3 pt-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="max-w-55 text-sm text-red-500">{t.exchange.userNotFound}</p>
            </div>
          )}

          {/* Error */}
          {result?.status === "error" && (
            <p className="text-sm text-destructive">{result.message}</p>
          )}

          {/* Results */}
          {result?.status === "success" && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: `${colors.primary}12` }}>
                <span className="text-xs text-gray-500">{t.exchange.tradingWith}</span>
                <span className="text-sm font-bold" style={{ color: colors.primary }}>{result.userName}</span>
              </div>
              <StickerSection
                title={t.exchange.myOffer}
                count={result.myOffer.length}
                items={result.myOffer}
                chipColor={colors.accent}
                emptyText={t.exchange.noMyOffer}
              />
              <StickerSection
                title={t.exchange.theirOffer}
                count={result.theirOffer.length}
                items={result.theirOffer}
                chipColor={colors.primary}
                emptyText={t.exchange.noTheirOffer}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
