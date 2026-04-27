import { api } from "@/lib/api"
import type { Album, AlbumStats } from "@/types"

export async function getAlbums(): Promise<Album[]> {
  const res = await api.get<Album[]>("/get_albums")
  return res.data
}

export async function getAlbum(id: string): Promise<Album | null> {
  const albums = await getAlbums()
  return albums.find((a) => a.id === id) ?? null
}

export async function getAlbumStats(albumId: string): Promise<AlbumStats> {
  const res = await api.get<ApiStats>("/get_stats", {
    params: { album_id: albumId },
  })
  const s = res.data
  return {
    total: s.total_stickers,
    collected: s.sticked_stickers,
    missing: s.pending_stickers,
    repeated: s.repeated_stickers,
    progress: Math.round(s.pctg_completed),
  }
}

interface ApiStats {
  total_stickers: number
  sticked_stickers: number
  pending_stickers: number
  repeated_stickers: number
  pctg_completed: number
}
