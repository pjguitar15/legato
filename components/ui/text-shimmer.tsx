'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type TextShimmerProps = {
  children: React.ReactNode
  className?: string
  speedMs?: number
  gradient?: string
}

/**
 * Lightweight shimmer text inspired by reactbits.dev Text effects
 * No external deps; uses the global `@keyframes shimmer` already defined in globals.css
 */
export default function TextShimmer({
  children,
  className,
  speedMs = 2500,
  gradient = 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(16,185,129,1) 50%, rgba(255,255,255,0.35) 100%)',
}: TextShimmerProps) {
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
