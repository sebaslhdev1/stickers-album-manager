"use client"

import { useT } from "@/i18n/use-t"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ServiceWakingBanner() {
  const [visible, setVisible] = useState(false)
  const t = useT()

  useEffect(() => {
    const onWaking = () => setVisible(true)
    const onHide = () => setVisible(false)
    window.addEventListener("service:waking", onWaking)
    window.addEventListener("service:ready", onHide)
    window.addEventListener("service:failed", onHide)
    return () => {
      window.removeEventListener("service:waking", onWaking)
      window.removeEventListener("service:ready", onHide)
      window.removeEventListener("service:failed", onHide)
    }
  }, [])

  if (!visible) return null

  return (
    <div className='fixed bottom-6 left-1/2 z-50 -translate-x-1/2'>
      <div className='flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm text-white shadow-xl' style={{ backgroundColor: 'var(--brand-dark)' }}>
        <Loader2 className='h-4 w-4 animate-spin text-white/70' />
        <span>{t.errors.serviceWaking}</span>
      </div>
    </div>
  )
}
