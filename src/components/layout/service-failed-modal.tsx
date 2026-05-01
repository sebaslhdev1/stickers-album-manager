"use client"

import { useT } from "@/i18n/use-t"
import { removeToken } from "@/lib/token"
import { LogIn, ServerCrash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ServiceFailedModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const t = useT()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("service:failed", handler)
    return () => window.removeEventListener("service:failed", handler)
  }, [])

  if (!open) return null

  function handleSignOut() {
    removeToken()
    setOpen(false)
    router.push("/login")
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
      <div className='relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl'>
        <div className='flex flex-col items-center gap-4 p-8 text-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full' style={{ backgroundColor: 'color-mix(in srgb, var(--brand-muted) 15%, transparent)' }}>
            <ServerCrash className='h-7 w-7' style={{ color: 'var(--brand-muted)' }} />
          </div>
          <div className='space-y-1.5'>
            <h2 className='text-lg font-bold tracking-tight'>
              {t.errors.serviceFailedTitle}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {t.errors.serviceFailedDesc}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className='mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
            style={{ backgroundColor: 'var(--brand-dark)' }}
          >
            <LogIn className='h-4 w-4' />
            {t.errors.serviceFailedButton}
          </button>
        </div>
      </div>
    </div>
  )
}
