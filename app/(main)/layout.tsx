'use client'

import React from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FacebookMessenger from '@/components/facebook-messenger'
import { useMessenger } from '@/contexts/messenger-context'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isMessengerOpen, closeMessenger } = useMessenger()

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FacebookMessenger isOpen={isMessengerOpen} onClose={closeMessenger} />
    </>
  )
}
