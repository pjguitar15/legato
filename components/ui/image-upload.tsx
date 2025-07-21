'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  disabled?: boolean
  multiple?: boolean
  maxFiles?: number
  className?: string
  placeholder?: string
}

export default function ImageUpload({
  value,
  onChange,
  disabled = false,
  multiple = false,
  maxFiles = 1,
  className = '',
  placeholder = 'Click to upload image',
}: ImageUploadProps) {
  const cloudinaryRef = useRef<any>(null)
  const widgetRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    // Set initial files only after mounting
    if (value) {
      const initialFiles = Array.isArray(value) ? value : [value]
      setUploadedFiles(initialFiles.filter(Boolean))
    }
  }, [])

  // Handle value changes after mounted
  useEffect(() => {
    if (isMounted && value !== undefined) {
      const newFiles = value ? (Array.isArray(value) ? value : [value]) : []
      setUploadedFiles(newFiles.filter(Boolean))
    }
  }, [value, isMounted])

  useEffect(() => {
    // Only load Cloudinary after component is mounted
    if (isMounted && typeof window !== 'undefined') {
      loadCloudinaryWidget()
    }
  }, [isMounted])

  const loadCloudinaryWidget = () => {
    // Check if Cloudinary is already loaded
    if (window.cloudinary) {
      initializeWidget()
      return
    }

    // Load Cloudinary widget script
    const existingScript = document.querySelector(
      'script[src*="cloudinary.com"]',
    )
    if (existingScript) {
      existingScript.addEventListener('load', initializeWidget)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
    script.async = true
    script.onload = () => {
      setTimeout(initializeWidget, 100) // Small delay to ensure widget is ready
    }
    script.onerror = () => {
      console.warn('Failed to load Cloudinary widget')
    }
    document.head.appendChild(script)
  }

  const initializeWidget = () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.warn(
        'Cloudinary cloud name not found. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your environment variables.',
      )
      return
    }

    try {
      cloudinaryRef.current = window.cloudinary
      widgetRef.current = cloudinaryRef.current?.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset:
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'legato_preset',
          sources: ['local', 'url', 'camera'],
          multiple: multiple,
          maxFiles: multiple ? maxFiles : 1,
          maxImageFileSize: 10000000, // 10MB
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          theme: 'minimal',
          showAdvancedOptions: false,
          cropping: false,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1',
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            const imageUrl = result.info.secure_url

            if (multiple) {
              const newFiles = [...uploadedFiles, imageUrl]
              setUploadedFiles(newFiles)
              onChange(newFiles.join(','))
            } else {
              setUploadedFiles([imageUrl])
              onChange(imageUrl)
            }
            setIsLoading(false)
          }

          if (error) {
            console.error('Cloudinary upload error:', error)
            setIsLoading(false)
          }

          if (result && result.event === 'upload-start') {
            setIsLoading(true)
          }
        },
      )
    } catch (error) {
      console.error('Failed to initialize Cloudinary widget:', error)
    }
  }

  const openWidget = () => {
    if (disabled || !isMounted) return

    if (widgetRef.current) {
      setIsLoading(true)
      widgetRef.current.open()
    } else {
      // Fallback: simple file input
      handleSimpleUpload()
    }
  }

  const handleSimpleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = multiple

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        setIsLoading(true)

        // For demo purposes when Cloudinary isn't configured
        const urls = Array.from(files).map((file) => URL.createObjectURL(file))

        setTimeout(() => {
          if (multiple) {
            const newFiles = [...uploadedFiles, ...urls]
            setUploadedFiles(newFiles)
            onChange(newFiles.join(','))
          } else {
            setUploadedFiles([urls[0]])
            onChange(urls[0])
          }
          setIsLoading(false)
        }, 1000)
      }
    }

    input.click()
  }

  const removeImage = (indexToRemove: number) => {
    const newFiles = uploadedFiles.filter((_, index) => index !== indexToRemove)
    setUploadedFiles(newFiles)

    if (multiple) {
      onChange(newFiles.length > 0 ? newFiles.join(',') : null)
    } else {
      onChange(null)
    }
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className='border-2 border-dashed rounded-lg p-6 text-center'>
          <div className='flex flex-col items-center space-y-2'>
            <div className='w-8 h-8 bg-muted animate-pulse rounded'></div>
            <p className='text-sm text-muted-foreground'>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div className='space-y-2'>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            disabled
              ? 'border-muted bg-muted/50 cursor-not-allowed'
              : 'border-border hover:border-primary/50 cursor-pointer'
          }`}
          onClick={openWidget}
        >
          {isLoading ? (
            <div className='flex flex-col items-center space-y-2'>
              <Loader2 className='w-8 h-8 text-primary animate-spin' />
              <p className='text-sm text-muted-foreground'>
                Uploading to Cloudinary...
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center space-y-2'>
              <Upload className='w-8 h-8 text-muted-foreground' />
              <p className='text-sm font-medium'>{placeholder}</p>
              <p className='text-xs text-muted-foreground'>
                Supports JPG, PNG, GIF up to 10MB • Powered by Cloudinary
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Images */}
      {uploadedFiles.length > 0 && (
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Uploaded Images:</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {uploadedFiles.map((url, index) => (
              <div key={`${url}-${index}`} className='relative group'>
                <div className='aspect-square rounded-lg overflow-hidden bg-muted'>
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 50vw, 33vw'
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50'
                  type='button'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      {uploadedFiles.length === 0 && (
        <div className='text-center'>
          <div className='flex items-center justify-center space-x-2 text-muted-foreground'>
            <ImageIcon className='w-4 h-4' />
            <span className='text-sm'>No images uploaded yet</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Extend window type for TypeScript
declare global {
  interface Window {
    cloudinary: any
  }
}
