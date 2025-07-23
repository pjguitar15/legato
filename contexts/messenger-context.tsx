'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MessengerContextType {
  isMessengerOpen: boolean
  openMessenger: () => void
  closeMessenger: () => void
}

const MessengerContext = createContext<MessengerContextType | undefined>(
  undefined,
)

export function MessengerProvider({ children }: { children: ReactNode }) {
  const [isMessengerOpen, setIsMessengerOpen] = useState(false)

  const openMessenger = () => {
    setIsMessengerOpen(true)
  }

  const closeMessenger = () => {
    setIsMessengerOpen(false)
  }

  return (
    <MessengerContext.Provider
      value={{ isMessengerOpen, openMessenger, closeMessenger }}
    >
      {children}
    </MessengerContext.Provider>
  )
}

export function useMessenger() {
  const context = useContext(MessengerContext)
  if (context === undefined) {
    throw new Error('useMessenger must be used within a MessengerProvider')
  }
  return context
}
