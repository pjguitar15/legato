'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import faqData from '@/data/faq.json'

interface PricingItem {
  package: string
  price: string
}

interface FAQItem {
  id: number
  question: string
  answer: string
  pricing?: PricingItem[]
  note?: string
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    )
  }

  return (
    <section id='faq' className='py-20'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Frequently Asked <span className='text-gradient'>Questions</span>
          </h2>
          <p className='text-xl text-muted-foreground'>
            Everything you need to know about our rock-solid sound and lighting
            services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {faqData.faqs.map((faq, index) => {
            const faqItem = faq as FAQItem
            return (
              <div
                key={index}
                className='bg-card rounded-2xl border border-border overflow-hidden'
              >
                <button
                  onClick={() => toggleItem(index)}
                  className='w-full px-8 py-6 text-left flex items-center justify-between hover:bg-accent transition-colors'
                >
                  <h3 className='text-lg font-semibold pr-4'>
                    {faqItem.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className='w-5 h-5 text-primary flex-shrink-0' />
                  ) : (
                    <ChevronDown className='w-5 h-5 text-primary flex-shrink-0' />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className='px-8 pb-6'>
                    <div className='text-muted-foreground'>
                      {faqItem.answer}
                    </div>
                    {faqItem.pricing && (
                      <div className='mt-4 p-4 bg-secondary/50 rounded-xl'>
                        <h4 className='font-semibold text-primary mb-2'>
                          Pricing:
                        </h4>
                        <ul className='space-y-1 text-sm'>
                          {faqItem.pricing.map((price, idx) => (
                            <li key={idx} className='flex justify-between'>
                              <span>{price.package}</span>
                              <span className='font-semibold'>
                                {price.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {faqItem.note && (
                      <div className='mt-4 p-4 bg-primary/10 rounded-xl'>
                        <p className='text-sm font-medium text-primary'>
                          💡 Pro Tip: {faqItem.note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className='mt-16 text-center bg-secondary/30 rounded-3xl p-8'>
          <h3 className='text-2xl font-bold mb-4'>Still Have Questions?</h3>
          <p className='text-muted-foreground mb-6'>
            Our sound engineers are ready to help you plan the perfect setup for
            your event.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors'>
              WhatsApp Us
            </button>
            <button className='bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors'>
              Facebook Messenger
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
