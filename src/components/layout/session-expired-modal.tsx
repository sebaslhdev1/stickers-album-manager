"use client"

import { useT } from "@/i18n/use-t"
import { LogIn, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const t = useT()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("auth:expired", handler)
    return () => window.removeEventListener("auth:expired", handler)
  }, [])

  if (!open) return null

  function handleGoToLogin() {
    setOpen(false)
    router.push("/login")
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
      <div className='relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl'>
        <div className='flex flex-col items-center gap-4 p-8 text-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full' style={{ backgroundColor: 'color-mix(in srgb, var(--brand-orange) 15%, transparent)' }}>
            <ShieldAlert className='h-7 w-7' style={{ color: 'var(--brand-orange)' }} />
          </div>
          <div className='space-y-1.5'>
            <h2 className='text-lg font-bold tracking-tight'>{t.errors.sessionExpiredTitle}</h2>
            <p className='text-sm text-muted-foreground'>
              {t.errors.sessionExpiredDesc}
            </p>
          </div>
          <button
            onClick={handleGoToLogin}
            className='mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
            style={{ backgroundColor: 'var(--brand-orange)' }}
          >
            <LogIn className='h-4 w-4' />
            {t.errors.sessionExpiredButton}
          </button>
        </div>
      </div>
    </div>
  )
}
