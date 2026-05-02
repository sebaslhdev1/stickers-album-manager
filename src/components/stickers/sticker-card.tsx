"use client"

import { cn } from "@/lib/utils"
import { Minus, Plus } from "lucide-react"
import { memo } from "react"

interface StickerCardProps {
  id: string
  number: string
  amount: number
  onAdd: (id: string) => void
  onRemove: (id: string) => void
}

export const StickerCard = memo(function StickerCard({
  id,
  number,
  amount,
  onAdd,
  onRemove,
}: StickerCardProps) {
  const missing = amount === 0
  const repeated = amount > 1

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-2.5 transition-colors duration-200",
        missing && "border-gray-200 bg-gray-50",
        !missing && !repeated && "border-green-200 bg-green-50",
        repeated && "border-amber-200 bg-amber-50",
      )}
    >
      <div className='text-center'>
        <p
          className={cn(
            "text-xs font-bold leading-tight",
            missing && "text-gray-400",
            !missing && !repeated && "text-green-700",
            repeated && "text-amber-700",
          )}
        >
          {number.toUpperCase()}
        </p>
      </div>

      <div className='flex items-center justify-between gap-1'>
        <button
          onClick={() => onRemove(id)}
          disabled={amount === 0}
          className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30'
        >
          <Minus className='h-2.5 w-2.5' />
        </button>
        <span
          className={cn(
            "text-xs font-bold",
            missing && "text-gray-400",
            !missing && !repeated && "text-green-600",
            repeated && "text-amber-600",
          )}
        >
          {amount}
        </span>
        <button
          onClick={() => onAdd(id)}
          className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100'
        >
          <Plus className='h-2.5 w-2.5' />
        </button>
      </div>
    </div>
  )
})
