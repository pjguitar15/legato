"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import faqData from "@/data/faq.json"

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Got questions? We've got answers. Here are some of the most common questions we receive.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-border pt-4">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
          <button
            onClick={() => window.open("https://wa.me/639171234567", "_blank")}
            className="bg-[hsl(var(--primary))] text-primary-foreground px-8 py-3 rounded-xl hover:bg-[hsl(var(--primary))]/90 transition-colors font-semibold"
          >
            Contact Us on WhatsApp
          </button>
        </div>
      </div>
    </section>
  )
}
