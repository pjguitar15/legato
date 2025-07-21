'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string | File
  onChange: (file: File | string | null) => void
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    // Set initial preview if value is a URL
    if (value && typeof value === 'string') {
      setPreviewUrls([value])
    }
  }, [])

  // Handle value changes after mounted
  useEffect(() => {
    if (isMounted && value !== undefined) {
      if (typeof value === 'string' && value) {
        setPreviewUrls([value])
        setSelectedFiles([])
      } else if (value instanceof File) {
        const url = URL.createObjectURL(value)
        setPreviewUrls([url])
        setSelectedFiles([value])
      } else {
        setPreviewUrls([])
        setSelectedFiles([])
      }
    }
  }, [value, isMounted])

  const openFileDialog = () => {
    if (disabled || !isMounted) return
    fileInputRef.current?.click()
  }

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)

    try {
      const fileArray = Array.from(files)
      const limitedFiles = multiple
        ? fileArray.slice(0, maxFiles)
        : [fileArray[0]]

      // Create preview URLs for display
      const urls = limitedFiles.map((file) => URL.createObjectURL(file))

      setSelectedFiles(limitedFiles)
      setPreviewUrls(urls)

      // Return the file(s) to parent component
      if (multiple) {
        onChange(limitedFiles.length > 0 ? limitedFiles[0] : null) // For now, handle single file
      } else {
        onChange(limitedFiles[0] || null)
      }
    } catch (error) {
      console.error('Error handling file selection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    // Clean up object URLs to prevent memory leaks
    const urlToRevoke = previewUrls[indexToRemove]
    if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRevoke)
    }

    const newUrls = previewUrls.filter((_, index) => index !== indexToRemove)
    const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove)

    setPreviewUrls(newUrls)
    setSelectedFiles(newFiles)

    if (multiple) {
      onChange(newFiles.length > 0 ? newFiles[0] : null) // For now, handle single file
    } else {
      onChange(null)
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [])

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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple={multiple}
        onChange={handleFileSelection}
        className='hidden'
        disabled={disabled}
      />

      {/* Upload Area */}
      <div className='space-y-2'>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            disabled
              ? 'border-muted bg-muted/50 cursor-not-allowed'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          }`}
          onClick={openFileDialog}
        >
          {isLoading ? (
            <div className='flex flex-col items-center space-y-2'>
              <Loader2 className='w-8 h-8 text-primary animate-spin' />
              <p className='text-sm text-muted-foreground'>
                Processing image...
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center space-y-2'>
              <Upload className='w-8 h-8 text-muted-foreground' />
              <p className='text-sm font-medium'>{placeholder}</p>
              <p className='text-xs text-muted-foreground'>
                Supports JPG, PNG, GIF up to 10MB • Click to select files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Images */}
      {previewUrls.length > 0 && (
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Selected Images:</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {previewUrls.map((url, index) => (
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
                  className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-destructive/80'
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
      {previewUrls.length === 0 && (
        <div className='text-center'>
          <div className='flex items-center justify-center space-x-2 text-muted-foreground'>
            <ImageIcon className='w-4 h-4' />
            <span className='text-sm'>No images selected yet</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to upload file to cloudinary (to be used in form submissions)
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'legato_preset',
  )

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}
