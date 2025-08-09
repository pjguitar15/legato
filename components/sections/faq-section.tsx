'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { SkeletonFAQ, SkeletonText } from '@/components/ui/skeleton'
import { useMessenger } from '@/contexts/messenger-context'

interface FAQ {
  _id: string
  question: string
  answer: string
  order: number
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { openMessenger } = useMessenger()

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/faq')
      const data = await response.json()

      if (data.success) {
        // Sort by order field
        const sortedFaqs = data.data.sort((a: FAQ, b: FAQ) => a.order - b.order)
        setFaqs(sortedFaqs)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (isLoading) {
    return (
      <section id='faq' className='py-20 bg-muted/50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Frequently Asked <span className='text-gradient'>Questions</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Everything you need to know about our sound and lighting services.
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Frequently Asked <span className='text-gradient'>Questions</span>
            </h2>
            <SkeletonText lines={2} className='max-w-3xl mx-auto' />
          </div>

          <SkeletonFAQ />
        </div>
      </section>
    )
  }

  if (faqs.length === 0) {
    return (
      <section id='faq' className='py-20 bg-muted/50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Frequently Asked <span className='text-gradient'>Questions</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              We're building our FAQ section. If you have questions, please
              contact us directly!
            </p>
          </div>

          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <HelpCircle className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>FAQs Coming Soon</h3>
            <p className='text-muted-foreground'>
              We're compiling the most common questions for you.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='faq' className='py-20 bg-muted/50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Frequently Asked <span className='text-gradient'>Questions</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Everything you need to know about our sound and lighting services.
            Can't find what you're looking for? Contact us!
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className='bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-300'
            >
              <button
                onClick={() => toggleFAQ(index)}
                className='w-full flex items-center justify-between p-6 text-left hover:bg-accent/50 transition-colors cursor-pointer'
              >
                <h3 className='text-lg font-semibold pr-4'>{faq.question}</h3>
                <div className='flex-shrink-0'>
                  {openIndex === index ? (
                    <ChevronUp className='w-5 h-5 text-primary' />
                  ) : (
                    <ChevronDown className='w-5 h-5 text-primary' />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className='px-6 pb-6 border-t border-border'>
                  <div className='pt-4 text-muted-foreground leading-relaxed'>
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className='mt-16 text-center bg-card rounded-2xl p-8 border border-border'>
          <h3 className='text-2xl font-semibold mb-4'>Still Have Questions?</h3>
          <p className='text-muted-foreground mb-6'>
            Our team is here to help! Get in touch and we'll answer any
            questions about our services.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={openMessenger}
              className='bg-[hsl(var(--primary))] text-primary-foreground px-8 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors font-semibold cursor-pointer'
            >
              Contact Us Today
            </button>
            <button className='bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-lg transition-colors font-semibold cursor-pointer'>
              View Our Services
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
