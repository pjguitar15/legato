import React from 'react'
import Navbar from '@/components/navbar'

export default function ContentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
