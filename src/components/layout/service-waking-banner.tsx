"use client"

import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ServiceWakingBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onWaking = () => setVisible(true)
    const onReady = () => setVisible(false)
    window.addEventListener("service:waking", onWaking)
    window.addEventListener("service:ready", onReady)
    return () => {
      window.removeEventListener("service:waking", onWaking)
      window.removeEventListener("service:ready", onReady)
    }
  }, [])

  if (!visible) return null

  return (
    <div className='fixed bottom-6 left-1/2 z-50 -translate-x-1/2'>
      <div className='flex items-center gap-2.5 rounded-full bg-gray-900 px-4 py-2.5 text-sm text-white shadow-xl'>
        <Loader2 className='h-4 w-4 animate-spin text-white/70' />
        <span>Connecting to server, please wait…</span>
      </div>
    </div>
  )
}
