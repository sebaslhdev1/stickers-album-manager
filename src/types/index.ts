export interface User {
  id: string
  name: string
  email: string
}

export interface AlbumStats {
  total: number
  collected: number
  missing: number
  repeated: number
  progress: number
}

export interface AlbumColors {
  primary: string
  secondary: string
  accent: string
  background: string
  card: string
}

export interface Album {
  id: string
  name: string
  image_url: string
  colors?: AlbumColors
}

export interface Sticker {
  id: string
  number: string
  name: string
  section: string
  amount: number
}
