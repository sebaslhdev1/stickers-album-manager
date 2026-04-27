import { cn } from "@/lib/utils"
import type { Album } from "@/types"
import { Check, Trophy } from "lucide-react"
import Image from "next/image"

export function AlbumCard({
  album,
  selected,
  isComplete,
  onSelect,
}: {
  album: Album
  selected: boolean
  isComplete?: boolean
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300",
        "shadow-md hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20",
        selected && "ring-2 ring-primary ring-offset-2 shadow-xl shadow-primary/20",
        isComplete && !selected && "ring-2 ring-yellow-400 ring-offset-2 shadow-xl shadow-yellow-400/30",
      )}
    >
      {/* Image */}
      <div className='relative aspect-3/4 w-full overflow-hidden bg-slate-900'>
        {/* Blurred background to fill letterbox gaps */}
        <Image
          src={album.image_url}
          alt=""
          fill
          aria-hidden
          className='scale-110 object-cover blur-xl brightness-50'
        />
        {/* Sharp foreground */}
        <Image
          src={album.image_url}
          alt={album.name}
          fill
          className='object-contain transition-transform duration-500 group-hover:scale-105'
        />

        {/* Completion shimmer overlay */}
        {isComplete && (
          <div className='absolute inset-0 bg-linear-to-t from-yellow-500/30 via-transparent to-transparent' />
        )}

        {/* Bottom gradient overlay */}
        <div className='absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent' />

        {/* Album name inside the overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <p className='text-base font-bold leading-tight text-white drop-shadow'>
            {album.name}
          </p>
        </div>

        {/* Completion badge */}
        {isComplete && (
          <div className='absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-1 shadow-lg'>
            <Trophy className='h-3 w-3 text-yellow-900' />
            <span className='text-[10px] font-bold uppercase tracking-wide text-yellow-900'>
              Complete
            </span>
          </div>
        )}

        {/* Selected check */}
        {selected && (
          <div className='absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-lg'>
            <Check className='h-4 w-4 text-white' />
          </div>
        )}
      </div>
    </div>
  )
}
