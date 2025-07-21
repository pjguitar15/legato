'use client'

import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

// Card skeleton for content cards
function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-card rounded-xl border border-border p-6', className)}
      {...props}
    >
      <div className='space-y-4'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <div className='space-y-2'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-4/5' />
          <Skeleton className='h-3 w-3/4' />
        </div>
      </div>
    </div>
  )
}

// Text block skeleton
function SkeletonText({
  lines = 3,
  className,
  ...props
}: { lines?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

// Hero section skeleton
function SkeletonHero({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-center space-y-6', className)} {...props}>
      <Skeleton className='h-12 w-2/3 mx-auto' />
      <Skeleton className='h-6 w-1/2 mx-auto' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-3/4 mx-auto' />
        <Skeleton className='h-4 w-2/3 mx-auto' />
      </div>
      <div className='flex justify-center space-x-4'>
        <Skeleton className='h-12 w-32' />
        <Skeleton className='h-12 w-32' />
      </div>
    </div>
  )
}

// Team member skeleton
function SkeletonTeam({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-card rounded-xl border border-border p-6', className)}
      {...props}
    >
      <div className='text-center space-y-4'>
        <Skeleton className='h-24 w-24 rounded-full mx-auto' />
        <div className='space-y-2'>
          <Skeleton className='h-5 w-32 mx-auto' />
          <Skeleton className='h-4 w-24 mx-auto' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-4/5 mx-auto' />
          <Skeleton className='h-3 w-3/4 mx-auto' />
        </div>
      </div>
    </div>
  )
}

// Gallery item skeleton
function SkeletonGallery({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border overflow-hidden',
        className,
      )}
      {...props}
    >
      <Skeleton className='h-48 w-full' />
      <div className='p-4 space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
        <div className='flex space-x-2'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>
      </div>
    </div>
  )
}

// Package/Service skeleton
function SkeletonPackage({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-card rounded-2xl border border-border p-8', className)}
      {...props}
    >
      <div className='text-center space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-32 mx-auto' />
          <Skeleton className='h-8 w-24 mx-auto' />
          <Skeleton className='h-4 w-40 mx-auto' />
        </div>
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center space-x-2'>
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 flex-1' />
            </div>
          ))}
        </div>
        <Skeleton className='h-12 w-full rounded-lg' />
      </div>
    </div>
  )
}

// Stats skeleton
function SkeletonStats({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('grid grid-cols-2 md:grid-cols-4 gap-6', className)}
      {...props}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className='text-center space-y-2'>
          <Skeleton className='h-8 w-16 mx-auto' />
          <Skeleton className='h-4 w-20 mx-auto' />
        </div>
      ))}
    </div>
  )
}

// FAQ skeleton
function SkeletonFAQ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='bg-card rounded-xl border border-border p-6'>
          <div className='flex items-center justify-between mb-4'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-5 w-5 rounded' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='h-4 w-3/4' />
          </div>
        </div>
      ))}
    </div>
  )
}

// Loading pulse animation for whole sections
function SkeletonSection({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('animate-pulse', className)} {...props}>
      {children}
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonHero,
  SkeletonTeam,
  SkeletonGallery,
  SkeletonPackage,
  SkeletonStats,
  SkeletonFAQ,
  SkeletonSection,
}
