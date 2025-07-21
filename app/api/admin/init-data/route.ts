import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Package from '@/models/Package'
import Event from '@/models/Event'
import Testimonial from '@/models/Testimonial'
import Gallery from '@/models/Gallery'
import FAQ from '@/models/FAQ'
import EquipmentCategory from '@/models/Equipment'
import Company from '@/models/Company'
import About from '@/models/About'

// Import JSON data
import packagesData from '@/data/packages.json'
import eventsData from '@/data/events.json'
import testimonialsData from '@/data/testimonials.json'
import galleryData from '@/data/gallery.json'
import faqData from '@/data/faq.json'
import equipmentData from '@/data/equipment.json'
import companyData from '@/data/company.json'
import aboutData from '@/data/about.json'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const results = {
      packages: 0,
      events: 0,
      testimonials: 0,
      gallery: 0,
      faqs: 0,
      equipment: 0,
      company: 0,
      about: 0,
    }

    // Clear existing data
    await Promise.all([
      Package.deleteMany({}),
      Event.deleteMany({}),
      Testimonial.deleteMany({}),
      Gallery.deleteMany({}),
      FAQ.deleteMany({}),
      EquipmentCategory.deleteMany({}),
      Company.deleteMany({}),
      About.deleteMany({}),
    ])

    // Insert Packages
    if (packagesData.packages) {
      const packages = await Package.insertMany(packagesData.packages)
      results.packages = packages.length
    }

    // Insert Events
    if (eventsData.events) {
      const events = await Event.insertMany(eventsData.events)
      results.events = events.length
    }

    // Insert Testimonials
    if (testimonialsData.testimonials) {
      const testimonials = await Testimonial.insertMany(
        testimonialsData.testimonials,
      )
      results.testimonials = testimonials.length
    }

    // Insert Gallery
    if (galleryData.images) {
      const gallery = await Gallery.insertMany(galleryData.images)
      results.gallery = gallery.length
    }

    // Insert FAQs
    if (faqData.faqs) {
      const faqs = await FAQ.insertMany(
        faqData.faqs.map((faq, index) => ({
          ...faq,
          order: index,
        })),
      )
      results.faqs = faqs.length
    }

    // Insert Equipment
    if (equipmentData.categories) {
      const equipment = await EquipmentCategory.insertMany(
        equipmentData.categories,
      )
      results.equipment = equipment.length
    }

    // Insert Company
    if (companyData) {
      const company = new Company(companyData)
      await company.save()
      results.company = 1
    }

    // Insert About
    if (aboutData) {
      const about = new About(aboutData)
      await about.save()
      results.about = 1
    }

    return NextResponse.json({
      success: true,
      message: 'Data initialized successfully',
      results,
    })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize data', details: error },
      { status: 500 },
    )
  }
}
