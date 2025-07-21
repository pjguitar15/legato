"use client"

import { useState } from "react"
import { X, Calendar, MapPin, Tag } from "lucide-react"
import galleryData from "@/data/gallery.json"

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const openModal = (image: any) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <section id="gallery" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Event <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take a look at some of our recent events and see how we transform ordinary spaces into extraordinary
            experiences.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryData.images.map((image, index) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 glow-hover ${
                index % 4 === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              } ${index % 5 === 0 ? "lg:row-span-2" : ""}`}
              onClick={() => openModal(image)}
            >
              <div className="aspect-square lg:aspect-auto lg:h-80 bg-secondary/30 relative overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">{image.caption}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{image.eventType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{image.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[hsl(var(--primary))] text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {image.eventType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="bg-card rounded-2xl overflow-hidden">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.caption}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{selectedImage.caption}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span>{selectedImage.eventType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{selectedImage.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(selectedImage.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
