import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper function to delete an image
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

// Helper function to get image info
export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error) {
    console.error('Error getting image info from Cloudinary:', error)
    throw error
  }
}

// Helper function to extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(cloudinaryUrl: string): string {
  try {
    // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image.jpg
    const parts = cloudinaryUrl.split('/')
    const uploadIndex = parts.findIndex((part) => part === 'upload')

    if (uploadIndex === -1) return ''

    // Get everything after 'upload' and the version (v1234567890)
    const pathAfterUpload = parts.slice(uploadIndex + 2).join('/')

    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '')

    return publicId
  } catch (error) {
    console.error('Error extracting public ID:', error)
    return ''
  }
}

// Helper function to generate optimized image URLs
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  } = {},
) {
  try {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
    } = options

    const transformations = []

    if (width || height) {
      const dimensions = []
      if (width) dimensions.push(`w_${width}`)
      if (height) dimensions.push(`h_${height}`)
      dimensions.push(`c_${crop}`)
      transformations.push(dimensions.join(','))
    }

    transformations.push(`q_${quality}`)
    transformations.push(`f_${format}`)

    const transformationString = transformations.join('/')

    return cloudinary.url(publicId, {
      transformation: transformationString,
    })
  } catch (error) {
    console.error('Error generating optimized URL:', error)
    return ''
  }
}

export default cloudinary
