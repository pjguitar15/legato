'use client'

export default function VlogsRedirect() {
  if (typeof window !== 'undefined') {
    window.location.replace('/vlogs')
  }
  return null
}
