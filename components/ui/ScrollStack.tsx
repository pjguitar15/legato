'use client'

import React, { useMemo, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'

type StackProps = {
  children: React.ReactNode
  top?: number // sticky offset in px
  gap?: number // vertical gap between stacked items in px
  height?: number // per-item scroll height in vh
}

type ItemProps = {
  children: React.ReactNode
}

export default function ScrollStack({
  children,
  top = 96,
  gap = 24,
  height = 70,
}: StackProps) {
  const items = useMemo(() => React.Children.toArray(children), [children])
  const count = items.length

  return (
    <div
      className='relative'
      style={{
        // @ts-ignore
        '--stack-top': `${top}px`,
      }}
    >
      <div className='space-y-6'>
        {items.map((child, index) => (
          <ScrollStackRow
            key={index}
            index={index}
            count={count}
            height={height}
            gap={gap}
          >
            {child}
          </ScrollStackRow>
        ))}
      </div>
    </div>
  )
}

function ScrollStackRow({
  children,
  index,
  count,
  height,
  gap,
}: {
  children: React.ReactNode
  index: number
  count: number
  height: number
  gap: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Animate into place as the row enters view
  const y = useTransform(scrollYProgress, [0, 1], [index * gap, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])
  const shadow = useTransform(scrollYProgress, [0, 1], [0.1, 0.35])
  const boxShadow = useMotionTemplate`0 20px 60px rgba(0,0,0, ${shadow})`

  return (
    <div ref={ref} style={{ height: `${height}vh` }} className='relative'>
      <motion.div
        className='sticky will-change-transform'
        style={{
          top: 'var(--stack-top)' as unknown as number,
          zIndex: count - index,
          y,
          scale,
        }}
      >
        <motion.div
          className='rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-6'
          style={{ boxShadow }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}

export function ScrollStackItem({ children }: ItemProps) {
  return <div>{children}</div>
}
