"use client"

import { useT } from "@/i18n/use-t"
import { Check, ChevronDown, Copy } from "lucide-react"
import { useState } from "react"

interface Props {
  title: string
  count: number
  items: string[]
  chipColor: string
  emptyText: string
}

export function StickerSection({
  title,
  count,
  items,
  chipColor,
  emptyText,
}: Props) {
  const t = useT()
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(items.map((i) => i.toUpperCase()).join(", "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='overflow-hidden rounded-xl border border-black/8'>
      <button
        onClick={() => setOpen((o) => !o)}
        className='flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-black/5'
      >
        <div className='flex items-center gap-2'>
          <h3 className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
            {title}
          </h3>
          <span
            className='rounded-full px-2 py-0.5 text-[10px] font-bold text-white'
            style={{ backgroundColor: chipColor }}
          >
            {count}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          {items.length > 0 && (
            <span
              onClick={handleCopy}
              className='flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-black/8'
            >
              {copied ? (
                <Check className='h-3 w-3' />
              ) : (
                <Copy className='h-3 w-3' />
              )}
              {copied ? t.stickers.copied : t.stickers.copy}
            </span>
          )}
          <ChevronDown
            className='h-4 w-4 text-muted-foreground transition-transform duration-200'
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {open && (
        <div className='px-4 pb-4 pt-2'>
          {items.length === 0 ? (
            <p className='text-sm text-muted-foreground'>{emptyText}</p>
          ) : (
            <div className='flex flex-wrap gap-1.5'>
              {items.map((name) => (
                <span
                  key={name}
                  className='rounded-full px-2.5 py-1 text-xs font-semibold text-white'
                  style={{ backgroundColor: chipColor }}
                >
                  {name.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
