import { api } from "@/lib/api";
import type { Album, AlbumStats } from "@/types";

export async function getAlbums(): Promise<Album[]> {
  const res = await api.get<Album[]>("/get_albums");
  return res.data;
}

// TODO: replace with actual endpoint when available
export async function getAlbumStats(albumId: string): Promise<AlbumStats> {
  // const res = await api.get<AlbumStats>(`/albums/${albumId}/stats`);
  // return res.data;
  return buildMockStats(albumId);
}

function buildMockStats(albumId: string): AlbumStats {
  const seed = albumId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const total = 450 + (seed % 100);
  const collected = Math.floor(total * (0.4 + (seed % 40) / 100));
  const missing = total - collected;
  const repeated = Math.floor(collected * (0.05 + (seed % 15) / 100));
  const progress = Math.round((collected / total) * 100);
  return { total, collected, missing, repeated, progress };
}
