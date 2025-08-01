'use client'

import { useEffect, useState } from 'react'
import { Volume2, Zap, Users, Award, Target, Star } from 'lucide-react'
import Image from 'next/image'
import {
  SkeletonText,
  SkeletonTeam,
  SkeletonStats,
  SkeletonCard,
} from '@/components/ui/skeleton'
import { useMessenger } from '@/contexts/messenger-context'

interface AboutData {
  _id?: string
  title: string
  description: string
  story: string
  mission: string
  vision: string
  values: string[]
  experience: {
    years: number
    events: number
    clients: number
  }
  team: Array<{
    name: string
    role: string
    experience: string
    specialization: string
    image?: string
    bio: string
  }>
}

export default function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { openMessenger } = useMessenger()

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/about')
      const data = await response.json()

      if (data.success && data.data) {
        setAboutData(data.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id='about' className='py-20 bg-muted/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              About <span className='text-gradient'>Legato</span>
            </h2>
            <SkeletonText lines={2} className='max-w-3xl mx-auto' />
          </div>

          {/* Loading Skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            <div className='space-y-8'>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className='space-y-8'>
              <SkeletonStats />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>

          {/* Team Skeleton */}
          <div className='mt-20'>
            <div className='text-center mb-12'>
              <SkeletonText lines={1} className='w-48 mx-auto mb-4' />
              <SkeletonText lines={2} className='max-w-2xl mx-auto' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonTeam key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!aboutData) {
    return (
      <section id='about' className='py-20 bg-muted/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              About <span className='text-gradient'>Legato</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              We're building something amazing. Check back soon to learn more
              about our story!
            </p>
          </div>

          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <Users className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>
              About Section Coming Soon
            </h3>
            <p className='text-muted-foreground'>
              We're crafting our story to share with you.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='about' className='py-20 bg-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            {aboutData.title || 'About Legato'}
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            {aboutData.description}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Left Column - Story & Mission */}
          <div className='space-y-8'>
            {/* Our Story */}
            <div>
              <h3 className='text-2xl font-bold mb-4 flex items-center'>
                <Target className='w-6 h-6 mr-2 text-primary' />
                Our Story
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {aboutData.story}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className='grid grid-cols-1 gap-6'>
              <div className='bg-card p-6 rounded-xl border'>
                <h4 className='font-semibold mb-3 flex items-center text-primary'>
                  <Target className='w-5 h-5 mr-2' />
                  Our Mission
                </h4>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {aboutData.mission}
                </p>
              </div>

              <div className='bg-card p-6 rounded-xl border'>
                <h4 className='font-semibold mb-3 flex items-center text-primary'>
                  <Star className='w-5 h-5 mr-2' />
                  Our Vision
                </h4>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {aboutData.vision}
                </p>
              </div>
            </div>

            {/* Company Values */}
            {aboutData.values && aboutData.values.length > 0 && (
              <div>
                <h3 className='text-2xl font-bold mb-4 flex items-center'>
                  <Award className='w-6 h-6 mr-2 text-primary' />
                  Our Values
                </h3>
                <div className='grid grid-cols-2 gap-3'>
                  {aboutData.values.map((value, index) => (
                    <div
                      key={index}
                      className='bg-[hsl(var(--primary))]/10 text-primary px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-[hsl(var(--primary))]/20 transition-colors'
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Experience */}
          <div className='space-y-8'>
            {/* Experience Stats */}
            <div>
              <h3 className='text-2xl font-bold mb-6 flex items-center'>
                <Award className='w-6 h-6 mr-2 text-primary' />
                Our Experience
              </h3>
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-card p-4 rounded-xl border text-center hover:shadow-md transition-shadow'>
                  <div className='text-2xl font-bold text-primary mb-1'>
                    {aboutData.experience?.years || 0}+
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Years Experience
                  </div>
                </div>
                <div className='bg-card p-4 rounded-xl border text-center hover:shadow-md transition-shadow'>
                  <div className='text-2xl font-bold text-primary mb-1'>
                    {aboutData.experience?.events || 0}+
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Events Completed
                  </div>
                </div>
                <div className='bg-card p-4 rounded-xl border text-center hover:shadow-md transition-shadow'>
                  <div className='text-2xl font-bold text-primary mb-1'>
                    {aboutData.experience?.clients || 0}+
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Happy Clients
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className='bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20'>
              <h4 className='font-semibold mb-4 text-primary'>
                Why Choose Legato?
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <Volume2 className='w-5 h-5 text-primary' />
                  <span className='text-sm'>Professional-grade equipment</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Zap className='w-5 h-5 text-primary' />
                  <span className='text-sm'>Expert technical support</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Users className='w-5 h-5 text-primary' />
                  <span className='text-sm'>Experienced team</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Award className='w-5 h-5 text-primary' />
                  <span className='text-sm'>Proven track record</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        {aboutData.team && aboutData.team.length > 0 && (
          <div className='mt-20'>
            <div className='text-center mb-12'>
              <h3 className='text-3xl font-bold mb-4'>Meet Our Team</h3>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                The passionate professionals behind every successful event
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {aboutData.team.map((member, index) => (
                <div
                  key={index}
                  className='bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300 group'
                >
                  <div className='text-center mb-4'>
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        className='w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20 group-hover:border-primary/50 transition-colors'
                      />
                    ) : (
                      <div className='w-20 h-20 rounded-full bg-[hsl(var(--primary))]/20 mx-auto mb-4 border-4 border-primary/20 group-hover:border-primary/50 transition-colors flex items-center justify-center'>
                        <Users className='w-8 h-8 text-primary' />
                      </div>
                    )}
                    <h4 className='font-semibold text-lg group-hover:text-primary transition-colors'>
                      {member.name}
                    </h4>
                    <p className='text-primary font-medium text-sm'>
                      {member.role}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {member.experience} • {member.specialization}
                    </p>
                  </div>
                  <p className='text-muted-foreground text-sm text-center leading-relaxed'>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className='mt-16 text-center bg-card rounded-2xl p-8 border'>
          <h3 className='text-2xl font-semibold mb-4'>
            Ready to Work With Us?
          </h3>
          <p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
            Let's bring your vision to life with professional sound and lighting
            that makes every moment unforgettable.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={openMessenger}
              className='bg-[hsl(var(--primary))] text-primary-foreground px-8 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors font-semibold hover:shadow-lg cursor-pointer'
            >
              Get Started Today
            </button>
            <button
              onClick={() => {
                const packagesSection = document.getElementById('packages')
                packagesSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className='bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-lg transition-colors font-semibold hover:shadow-lg cursor-pointer'
            >
              View Our Services
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
