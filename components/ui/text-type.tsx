'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type TextTypeProps = {
  text: string | string[]
  className?: string
  cursor?: string
  typingSpeedMs?: number
  deleteSpeedMs?: number
  pauseMs?: number
  loop?: boolean
}

/**
 * TextType — a small, dependency‑free typing effect inspired by React Bits "Text Type".
 * - Supports an array of phrases or a single phrase
 * - Optional looping with delete animation
 */
export default function TextType({
  text,
  className,
  cursor = '_',
  typingSpeedMs = 75,
  deleteSpeedMs = 40,
  pauseMs = 1500,
  loop = false,
}: TextTypeProps) {
  const phrases = useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const timerRef = useRef<number | null>(null)

  // Cursor blink
  useEffect(() => {
    const id = window.setInterval(() => setShowCursor((s) => !s), 500)
    return () => window.clearInterval(id)
  }, [])

  // Typing engine
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)

    const current = phrases[phraseIndex] ?? ''
    const doneTyping = !isDeleting && display === current
    const doneDeleting = isDeleting && display === ''

    if (doneTyping) {
      // Pause at end
      if (!loop && phrases.length === 1) return
      timerRef.current = window.setTimeout(() => setIsDeleting(true), pauseMs)
      return
    }

    if (doneDeleting) {
      const next = (phraseIndex + 1) % phrases.length
      setPhraseIndex(next)
      setIsDeleting(false)
      return
    }

    const nextText = isDeleting
      ? current.slice(0, Math.max(0, display.length - 1))
      : current.slice(0, display.length + 1)

    timerRef.current = window.setTimeout(
      () => setDisplay(nextText),
      isDeleting ? deleteSpeedMs : typingSpeedMs,
    )

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [
    display,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeedMs,
    deleteSpeedMs,
    pauseMs,
    loop,
  ])

  // Kickstart typing
  useEffect(() => {
    if (!display) setDisplay('')
  }, [])

  return (
    <span className={cn('inline-flex items-baseline', className)}>
      <span>{display}</span>
      <span
        aria-hidden
        className='ml-1 select-none opacity-80'
        style={{ visibility: showCursor ? 'visible' : 'hidden' }}
      >
        {cursor}
      </span>
    </span>
  )
}
