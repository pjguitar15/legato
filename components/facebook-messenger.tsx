'use client'

import { FacebookProvider, CustomChat } from 'react-facebook'

interface FacebookMessengerProps {
  pageId?: string
  isOpen: boolean
  onClose: () => void
}

export default function FacebookMessenger({
  pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID ||
    'legatosoundsandlightsrental',
  isOpen,
  onClose,
}: FacebookMessengerProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-colors'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {/* Messenger Chat */}
        <div className='p-4'>
          <div className='text-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Chat with us on Messenger
            </h3>
            <p className='text-sm text-gray-600'>
              Get instant quotes and fast response!
            </p>
          </div>

          <div className='text-center'>
            <button
              onClick={() => {
                const messengerUrl = `https://m.me/${pageId}`
                window.open(messengerUrl, '_blank', 'noopener,noreferrer')
                console.log('Opening Messenger:', messengerUrl)
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
              </svg>
              <span>Start Chat on Messenger</span>
            </button>
            <p className='text-xs text-gray-500 mt-2'>
              Opens in a new tab - no login required
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
