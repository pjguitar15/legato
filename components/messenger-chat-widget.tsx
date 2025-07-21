'use client'

import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

interface MessengerChatWidgetProps {
  pageId?: string
  minimized?: boolean
  themeColor?: string
}

export default function MessengerChatWidget({
  pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
  minimized = true,
  themeColor = '#10b981', // Legato's primary green color
}: MessengerChatWidgetProps) {
  useEffect(() => {
    // Load Facebook SDK
    if (typeof window !== 'undefined' && pageId) {
      // Set up Facebook SDK
      window.fbAsyncInit = function () {
        window.FB?.init({
          xfbml: true,
          version: 'v18.0',
        })
      }

      // Load the SDK asynchronously
      ;(function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        js = d.createElement(s) as HTMLScriptElement
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
        fjs.parentNode?.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
    }
  }, [pageId])

  if (!pageId) {
    return (
      <div className='fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg'>
        <p className='text-sm'>Facebook Page ID not configured</p>
      </div>
    )
  }

  return (
    <>
      {/* Facebook Messenger Chat Plugin */}
      <div id='fb-root'></div>

      <div
        className='fb-customerchat'
        attribution='setup_tool'
        page_id={pageId}
        theme_color={themeColor}
        minimized={minimized.toString()}
      />

      {/* Custom Chat Button (optional - shows before FB loads) */}
      <div className='fixed bottom-4 right-4 z-50 group'>
        <div className='bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer group-hover:scale-110'>
          <MessageCircle className='w-6 h-6' />

          {/* Tooltip */}
          <div className='absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
            <div className='bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap'>
              Chat with us on Messenger!
              <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema markup for better SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Legato Sounds and Lights',
            contactPoint: [
              {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English', 'Filipino'],
                url: `https://m.me/${pageId}`,
              },
            ],
          }),
        }}
      />
    </>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    fbAsyncInit: () => void
    FB: any
  }
}
