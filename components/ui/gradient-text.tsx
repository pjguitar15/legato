'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type GradientTextProps = {
  children: React.ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number // seconds
  showBorder?: boolean
}

// React Bits-style GradientText (package-free):
// - Animated gradient sweep across text
// - Optional animated gradient outline container
export default function GradientText({
  children,
  className,
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`

  const textStyle: React.CSSProperties = {
    background: gradient,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '200% 100%',
    animation: `gradient-text-shift ${animationSpeed}s ease-in-out infinite`,
  }

  if (!showBorder) {
    return (
      <span className={cn('inline-block', className)} style={textStyle}>
        {children}
      </span>
    )
  }

  // Border container with animated gradient outline
  return (
    <span
      className={cn('inline-block rounded-lg p-[2px]', className)}
      style={{
        background: gradient,
        backgroundSize: '200% 100%',
        animation: `gradient-text-shift ${animationSpeed}s ease-in-out infinite`,
      }}
    >
      <span className='block rounded-md bg-transparent px-1' style={textStyle}>
        {children}
      </span>
    </span>
  )
}
