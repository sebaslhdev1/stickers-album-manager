import { api } from "@/lib/api"
import type { Sticker } from "@/types"

interface ApiSticker {
  sticker_id: string
  sticker_name: string
  amount: number
}

export async function getStickers(albumId: string): Promise<Sticker[]> {
  const res = await api.get<ApiSticker[]>("/get_stickers", {
    params: { album_id: albumId },
  })
  return res.data.map((s) => ({
    id: s.sticker_id,
    number: s.sticker_name,
    name: s.sticker_name,
    section: s.sticker_name.replace(/\s*\d+$/, "").trim(),
    amount: s.amount,
  }))
}

function parseStickers(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
  if (typeof raw !== "string" || !raw.trim()) return []
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}

export async function getMissingStickers(albumId: string): Promise<string[]> {
  const res = await api.get<{ missing: unknown }>("/get_missing_stickers", {
    params: { album_id: albumId },
  })
  return parseStickers(res.data.missing)
}

export async function getRepeatedStickers(albumId: string): Promise<string[]> {
  const res = await api.get<{ repeated: unknown }>("/get_repeated_stickers", {
    params: { album_id: albumId },
  })
  return parseStickers(res.data.repeated)
}

interface ApiStickerMatch {
  sticker_id: string
  sticker_name: string
}

export async function getMatchingStickers(
  albumId: string,
  userCode: string,
): Promise<{ my_offer: string[]; their_offer: string[]; exchange_user_name: string }> {
  const res = await api.post<{
    my_offer: ApiStickerMatch[]
    their_offer: ApiStickerMatch[]
    exchange_user_name: string
  }>(
    "/get_matching_stickers",
    { album_id: albumId, user_code: userCode },
  )
  return {
    my_offer: res.data.my_offer.map((s) => s.sticker_name),
    their_offer: res.data.their_offer.map((s) => s.sticker_name),
    exchange_user_name: res.data.exchange_user_name,
  }
}

export async function saveStickers(
  albumId: string,
  stickers: Pick<Sticker, "id" | "number" | "amount">[]
): Promise<void> {
  await api.post(
    "/modify_stickers",
    stickers.map((s) => ({
      sticker_id: s.id,
      sticker_name: s.number,
      amount: s.amount,
    })),
    { params: { album_id: albumId } }
  )
}
