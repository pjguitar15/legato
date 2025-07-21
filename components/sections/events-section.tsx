"use client"

import { useState } from "react"
import { Calendar, MapPin, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import eventsData from "@/data/events.json"

export default function EventsSection() {
  const [currentEvent, setCurrentEvent] = useState(0)

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev + 1) % eventsData.events.length)
  }

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev - 1 + eventsData.events.length) % eventsData.events.length)
  }

  const currentEventData = eventsData.events[currentEvent]

  return (
    <section id="events" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Event <span className="text-gradient">Highlights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover some of our most memorable events and see how we bring visions to life with professional sound and
            lighting.
          </p>
        </div>

        {/* Featured Event */}
        <div className="relative bg-card rounded-3xl overflow-hidden border border-border shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Event Image */}
            <div className="relative aspect-video lg:aspect-auto">
              <img
                src={currentEventData.image || "/placeholder.svg"}
                alt={currentEventData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                  {currentEventData.eventType}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-display font-bold mb-4">{currentEventData.title}</h3>

              <p className="text-muted-foreground mb-6 text-lg">{currentEventData.description}</p>

              {/* Event Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{new Date(currentEventData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{currentEventData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>{currentEventData.package}</span>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="font-semibold mb-4">Event Highlights:</h4>
                <ul className="space-y-3">
                  {currentEventData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <button
              onClick={prevEvent}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <button
              onClick={nextEvent}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Event Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {eventsData.events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEvent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentEvent ? "bg-[hsl(var(--primary))]" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* All Events Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-display font-bold text-center mb-8">Recent Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventsData.events.map((event, index) => (
              <div
                key={event.id}
                className={`bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer glow-hover ${
                  index === currentEvent ? "border-primary" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCurrentEvent(index)}
              >
                <div className="aspect-video relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[hsl(var(--primary))] text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {event.eventType}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold mb-2 line-clamp-2">{event.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
