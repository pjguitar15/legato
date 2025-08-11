'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type ShinyTextProps = {
  children: React.ReactNode
  className?: string
  speedMs?: number
  from?: string
  highlight?: string
}

/**
 * ShinyText – a lightweight glossy sweep across text, inspired by React Bits "Shiny Text".
 * Uses the global `shimmer` keyframes (already in globals.css) to animate a moving gradient.
 */
export default function ShinyText({
  children,
  className,
  speedMs = 2200,
  from = 'rgba(255,255,255,0.25)',
  highlight = 'rgba(255,255,255,0.9)',
}: ShinyTextProps) {
  const gradient = `linear-gradient(90deg, ${from} 0%, ${highlight} 50%, ${from} 100%)`

  return (
    <span
      className={cn('inline-block', className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: `shimmer ${speedMs}ms linear infinite`,
      }}
    >
      {children}
    </span>
  )
}
