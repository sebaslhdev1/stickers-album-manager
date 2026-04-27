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
