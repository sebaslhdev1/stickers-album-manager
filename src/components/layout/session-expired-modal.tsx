"use client"

import { LogIn, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />

      {/* Modal */}
      <div className='relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl'>
        <div className='flex flex-col items-center gap-4 p-8 text-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-amber-100'>
            <ShieldAlert className='h-7 w-7 text-amber-500' />
          </div>
          <div className='space-y-1.5'>
            <h2 className='text-lg font-bold tracking-tight'>Session expired</h2>
            <p className='text-sm text-muted-foreground'>
              Your session has expired. Please sign in again to continue.
            </p>
          </div>
          <button
            onClick={handleGoToLogin}
            className='mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
          >
            <LogIn className='h-4 w-4' />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}
