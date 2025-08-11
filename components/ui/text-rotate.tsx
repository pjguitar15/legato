'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type TextRotateProps = {
  words: string[]
  className?: string
  intervalMs?: number
}

// Minimal rotating text inspired by React Bits "Rotating Text" (no deps)
export default function TextRotate({
  words,
  className,
  intervalMs = 1800,
}: TextRotateProps) {
  const list = useMemo(() => words.filter(Boolean), [words])
  const [i, setI] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setI((v) => (v + 1) % list.length)
    }, intervalMs)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [list, intervalMs])

  return (
    <span className={cn('inline-flex items-baseline', className)}>
      {list[i]}
    </span>
  )
}

