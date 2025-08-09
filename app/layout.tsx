import type React from 'react'
import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { MessengerProvider } from '@/contexts/messenger-context'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title:
    'Legato Sounds and Lights | Professional Live Sound & Stage Lighting for Rock Bands',
  description:
    'Premium live sound engineering and stage lighting for rock bands, concerts, and high-energy events across Cavite, Metro Manila, and nearby areas.',
  keywords:
    'sound system rental, stage lighting, rock band equipment, live sound, Cavite, Metro Manila, Trece Martires',
  authors: [{ name: 'Legato Sounds and Lights' }],
  creator: 'Legato Sounds and Lights',
  publisher: 'Legato Sounds and Lights',
  openGraph: {
    title:
      'Legato Sounds and Lights | Professional Live Sound & Stage Lighting',
    description:
      'Premium live sound engineering and stage lighting for rock bands, concerts, and high-energy events.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Legato Sounds and Lights',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Legato Sounds and Lights | Professional Live Sound & Stage Lighting',
    description:
      'Premium live sound engineering and stage lighting for rock bands, concerts, and high-energy events.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${poppins.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className='transition-colors duration-300' suppressHydrationWarning>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey='legato-theme'
        >
          <MessengerProvider>
            {children}
            <SonnerToaster position='top-center' richColors closeButton />
          </MessengerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
