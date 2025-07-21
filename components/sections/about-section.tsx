'use client'

import { Volume2, Zap, Users, Award, Target, Star } from 'lucide-react'
import aboutData from '@/data/about.json'
import companyData from '@/data/company.json'
import Image from 'next/image'

export default function AboutSection() {
  return (
    <section id='about' className='py-20 bg-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            About <span className='text-gradient'>Legato</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            {aboutData.company.mission}
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
              <p className='text-muted-foreground leading-relaxed mb-4'>
                {aboutData.company.story}
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                {aboutData.company.vision}
              </p>
            </div>

            {/* Team Lead Info */}
            <div className='bg-card rounded-2xl p-6 border border-border'>
              <div className='flex items-center space-x-4 mb-4'>
                <Image
                  src={aboutData.team[0]?.image || '/placeholder-user.jpg'}
                  alt={aboutData.team[0]?.name || 'Team Lead'}
                  width={60}
                  height={60}
                  className='rounded-full object-cover'
                />
                <div>
                  <h4 className='font-semibold text-lg'>
                    {aboutData.team[0]?.name}
                  </h4>
                  <p className='text-primary'>{aboutData.team[0]?.role}</p>
                </div>
              </div>
              <blockquote className='text-muted-foreground italic'>
                &quot;
                {aboutData.team[0]?.bio ||
                  'Dedicated to delivering exceptional sound and lighting experiences.'}
                &quot;
              </blockquote>
            </div>
          </div>

          {/* Right Column - Values & Stats */}
          <div className='space-y-8'>
            {/* Core Values */}
            <div>
              <h3 className='text-2xl font-bold mb-6 flex items-center'>
                <Star className='w-6 h-6 mr-2 text-primary' />
                Our Values
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                {aboutData.company.values.map((value, index) => (
                  <div
                    key={index}
                    className='bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors'
                  >
                    <h4 className='font-semibold text-primary mb-2'>
                      Value {index + 1}
                    </h4>
                    <p className='text-muted-foreground text-sm'>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Stats */}
            <div>
              <h3 className='text-2xl font-bold mb-6 flex items-center'>
                <Award className='w-6 h-6 mr-2 text-primary' />
                By the Numbers
              </h3>
              <div className='grid grid-cols-2 gap-6'>
                {companyData.stats.map((stat, index) => (
                  <div
                    key={index}
                    className='text-center bg-card rounded-xl p-6 border border-border'
                  >
                    <div className='text-3xl font-bold text-primary mb-2'>
                      {stat.value}
                    </div>
                    <div className='text-muted-foreground font-semibold'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='mt-16'>
          <h3 className='text-3xl font-bold text-center mb-12'>
            Why Choose <span className='text-gradient'>Legato</span>?
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {aboutData.achievements.slice(0, 3).map((achievement, index) => (
              <div
                key={index}
                className='text-center bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl'
              >
                <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                  {index === 0 && <Volume2 className='w-8 h-8 text-primary' />}
                  {index === 1 && <Zap className='w-8 h-8 text-primary' />}
                  {index === 2 && <Users className='w-8 h-8 text-primary' />}
                </div>
                <h4 className='text-xl font-bold mb-4'>
                  {index === 0 && 'Professional Sound'}
                  {index === 1 && 'Dynamic Lighting'}
                  {index === 2 && 'Expert Team'}
                </h4>
                <p className='text-muted-foreground'>{achievement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className='mt-16'>
          <h3 className='text-3xl font-bold text-center mb-12'>
            Meet Our <span className='text-gradient'>Team</span>
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {aboutData.team.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className='bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl'
              >
                <div className='aspect-square relative'>
                  <Image
                    src={member.image || '/placeholder-user.jpg'}
                    alt={member.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-6'>
                  <h4 className='text-xl font-bold mb-1'>{member.name}</h4>
                  <p className='text-primary font-semibold mb-2'>
                    {member.role}
                  </p>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {member.specialization}
                  </p>
                  <p className='text-xs text-muted-foreground mb-4'>
                    {member.bio}
                  </p>
                  <div className='flex items-center space-x-2'>
                    <Award className='w-4 h-4 text-primary' />
                    <span className='text-sm'>{member.experience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center bg-secondary/30 rounded-3xl p-8'>
          <h3 className='text-2xl font-bold mb-4'>
            Ready to Experience the Difference?
          </h3>
          <p className='text-muted-foreground mb-6'>
            Let&apos;s create an unforgettable experience for your next event
            with professional sound and lighting.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors'>
              Get Your Quote
            </button>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors'>
              View Our Work
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
