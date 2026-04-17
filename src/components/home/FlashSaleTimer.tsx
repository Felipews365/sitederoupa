'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function FlashSaleTimer() {
  const [seconds, setSeconds] = useState(3 * 3600 + 47 * 60 + 22)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1.5 bg-primary-dark text-white px-3 py-1.5 rounded-full text-xs font-semibold">
      <Clock className="w-3 h-3" />
      Termina em:&nbsp;
      <span className="font-mono tabular-nums">{pad(h)}:{pad(m)}:{pad(s)}</span>
    </div>
  )
}
