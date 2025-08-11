import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ignore ESLint errors during builds for production deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    NEXT_PUBLIC_FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
