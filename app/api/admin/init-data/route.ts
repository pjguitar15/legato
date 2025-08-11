import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import mongoose from 'mongoose'
import About from '@/models/About'
import Company from '@/models/Company'
import Package from '@/models/Package'
import FAQ from '@/models/FAQ'
import Equipment from '@/models/Equipment'
import Event from '@/models/Event'
import Gallery from '@/models/Gallery'
import Testimonial from '@/models/Testimonial'
import Vlog from '@/models/Vlog'

export async function POST() {
  console.log('🚀 Init-data route called')
  try {
    console.log('📁 Connecting to database...')
    await connectToDatabase()
    console.log('✅ Database connected successfully')

    // Initialize About Us data with original hardcoded content (force refresh)
    console.log('🔍 Checking for existing About data...')
    const existingAbout = await About.findOne()
    console.log(
      '📊 Existing About data:',
      existingAbout ? 'Found (will replace)' : 'Not found',
    )

    // Force complete collection reset to ensure new schema
    console.log('🗑️ Removing all existing About data to ensure clean schema...')
    try {
      await About.collection.drop()
      console.log('🆕 About collection dropped successfully')
    } catch (error) {
      console.log('ℹ️ Collection does not exist or already empty')
    }

    // Clear mongoose model cache to ensure fresh schema
    delete mongoose.models.About
    console.log('🔄 Mongoose model cache cleared')

    console.log('📝 Creating new About data with updated structure...')
    const aboutDataToCreate = {
      title: 'Legato Sounds and Lights',
      description:
        'Delivering unforgettable sound and lighting experiences since 2022, we transform ordinary events into extraordinary memories through professional-grade equipment and exceptional service.',
      story:
        "Founded in 2022 by a team of audio and lighting enthusiasts, Legato Sounds and Lights began with a simple mission: to provide professional-grade equipment and services that make every event memorable. Starting with just a few pieces of equipment and a passion for perfect sound, we've grown to become one of the most trusted names in event production across Cavite and Metro Manila.",
      mission:
        'Delivering unforgettable sound and lighting experiences since 2022, we transform ordinary events into extraordinary memories through professional-grade equipment and exceptional service.',
      vision:
        'To be the premier sounds and lights provider in Cavite and Metro Manila, known for reliability, quality, and innovation.',
      values: [
        'Professional Excellence',
        'Customer Satisfaction',
        'Reliable Service',
        'Innovation in Technology',
      ],
      experience: {
        years: 3,
        events: 500,
        clients: 200,
      },
      team: [
        {
          name: 'Philson S. Josol',
          role: 'Founder & Lead Sound Engineer',
          experience: '4+ years',
          specialization: 'Live Sound Engineering, Drummer',
          image: '/philson.jpg',
          bio: 'Philson brings over 4 years of experience in live sound engineering and has worked with various artists and corporate clients across several areas in the Philippines.',
        },
        {
          name: 'Ana Reyes',
          role: 'Lighting Designer & Technician',
          experience: '6+ years',
          specialization: 'Stage Lighting, Event Design',
          image: '/placeholder.svg?height=300&width=300',
          bio: 'Ana specializes in creating stunning visual experiences through innovative lighting design, with expertise in both traditional and LED lighting systems.',
        },
        {
          name: 'Jose Garcia',
          role: 'Equipment Manager & Technician',
          experience: '5+ years',
          specialization: 'Equipment Maintenance, Setup Coordination',
          image: '/placeholder.svg?height=300&width=300',
          bio: 'Jose ensures all our equipment is in perfect condition and coordinates seamless setup and breakdown for every event.',
        },
      ],
    }

    console.log(
      '📊 About data structure to be created:',
      JSON.stringify(aboutDataToCreate, null, 2),
    )

    const createdAbout = await About.create(aboutDataToCreate)
    console.log(
      '📊 Successfully created About document:',
      JSON.stringify(createdAbout, null, 2),
    )
    console.log(
      '✓ About Us data initialized with original content and new structure',
    )

    // Initialize Company data with original hardcoded content
    console.log('🔍 Checking for existing Company data...')
    const existingCompany = await Company.findOne()
    console.log(
      '🏢 Existing Company data:',
      existingCompany ? 'Found' : 'Not found',
    )

    // Force complete collection reset to ensure new schema
    console.log(
      '🗑️ Removing all existing Company data to ensure clean schema...',
    )
    try {
      await Company.collection.drop()
      console.log('🆕 Company collection dropped successfully')
    } catch (error) {
      console.log('ℹ️ Collection does not exist or already empty')
    }

    // Clear mongoose model cache to ensure fresh schema
    delete mongoose.models.Company
    console.log('🔄 Mongoose model cache cleared')

    const companyData = {
      name: 'Legato Sounds and Lights',
      tagline: 'Professional Live Sound & Stage Lighting',
      description:
        'Premium live sound engineering and stage lighting, concerts, and high-energy events across Cavite, Metro Manila, and nearby areas.',
      coverage:
        'Serving Rock Bands & Live Music Events - Cavite, Metro Manila, and Nearby Areas',
      footerDescription:
        'Premium live sound engineering and stage lighting, concerts, and high-energy events across Cavite, Metro Manila, and nearby areas.',
      logo: '/Legato Landscape.png',
      contact: {
        address: '123 Rock Street, Trece Martires City',
        city: 'Trece Martires',
        province: 'Cavite',
        zipCode: '4109',
        phone: '09762737247',
        email: 'info@legatosounds.com',
      },
      socialMedia: {
        facebook: 'https://www.facebook.com/legatosoundsandlightsrental',
        messenger: 'https://www.facebook.com/legatosoundsandlightsrental',
        youtube: 'https://www.youtube.com/@LegatoSoundsandLights',
        facebookPageId: 'legatosoundsandlightsrental',
      },
      businessHours: {
        weekdays: '9:00 AM - 6:00 PM',
        weekends: '10:00 AM - 4:00 PM',
        holidays: 'By appointment only',
      },
      serviceAreas: ['Cavite Province', 'Metro Manila', 'Nearby Areas'],
      founded: 2022,
      stats: [
        { value: '500+', label: 'Live Shows' },
        { value: '3+', label: 'Years Of Service' },
        { value: '5.0⭐', label: 'Service Rating' },
      ],
    }

    console.log('🏢 Creating new Company data with updated structure...')
    console.log(
      '📊 Company data structure to be created:',
      JSON.stringify(companyData, null, 2),
    )

    const createdCompany = await Company.create(companyData)
    console.log(
      '📊 Successfully created Company document:',
      JSON.stringify(createdCompany, null, 2),
    )
    console.log(
      '✓ Company data initialized with original content and new structure',
    )

    // Initialize sample FAQ data
    console.log('🔍 Checking for existing FAQ data...')
    const existingFAQs = await FAQ.find()
    console.log('❓ Existing FAQ count:', existingFAQs.length)
    if (existingFAQs.length === 0) {
      console.log('❓ Creating sample FAQ data...')
      const faqData = [
        {
          question: 'What types of events do you serve?',
          answer:
            'We provide sound and lighting services for a wide range of events including weddings, corporate events, concerts, birthday parties, graduations, and more. Our equipment is suitable for both indoor and outdoor venues.',
          order: 1,
        },
        {
          question: 'How far in advance should I book your services?',
          answer:
            'We recommend booking at least 2-4 weeks in advance, especially during peak seasons (December-January, June-July). However, we can accommodate last-minute bookings based on availability.',
          order: 2,
        },
        {
          question: 'Do you provide setup and breakdown services?',
          answer:
            'Yes! Our packages include complete setup and breakdown services. Our technical team arrives early to set up all equipment and ensures everything is properly dismantled after your event.',
          order: 3,
        },
        {
          question: 'What areas do you serve?',
          answer:
            'We primarily serve Cavite Province, Metro Manila, and nearby areas in Laguna and Batangas. Travel charges may apply for locations outside our standard service area.',
          order: 4,
        },
        {
          question: 'Can you customize packages for specific needs?',
          answer:
            "Absolutely! While we have standard packages, we're happy to create custom solutions based on your specific requirements, venue size, and budget. Contact us to discuss your needs.",
          order: 5,
        },
      ]

      for (const faq of faqData) {
        await FAQ.create(faq)
      }
      console.log('✓ FAQ data initialized')
    } else {
      console.log('ℹ️  FAQ data already exists, skipping...')
    }

    // Initialize Equipment data
    console.log('🔍 Checking for existing Equipment data...')
    const existingEquipment = await Equipment.find()
    console.log('🎵 Existing Equipment count:', existingEquipment.length)
    if (existingEquipment.length === 0) {
      console.log('🎵 Creating sample Equipment data...')
      const unsplash = (q: string) =>
        `https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=60&sig=${Math.floor(
          Math.random() * 10000,
        )}&${q}`
      const picsum = () => `https://picsum.photos/seed/${Math.random()}/800/600`

      const equipmentData = [
        {
          name: 'Audio Equipment',
          items: [
            {
              name: 'RCF ART 745A',
              type: 'Active Speaker',
              description:
                'Professional 15" active speaker with exceptional clarity and power',
              image: '/rcf.webp',
              features: [
                '1400W Peak Power',
                'Class-D Amplifier',
                'Professional Grade',
              ],
              brand: 'RCF',
            },
            {
              name: 'Allen & Heath SQ-5',
              type: 'Digital Mixer',
              description:
                'Professional digital mixing console with advanced features',
              image: '/sq5.jpg',
              features: [
                '48 Input Channels',
                'Touch Screen Control',
                'Built-in Effects',
              ],
              brand: 'Allen & Heath',
            },
            {
              name: 'Shure SM58',
              type: 'Dynamic Microphone',
              description: 'Industry standard vocal microphone',
              image: '/shure.webp',
              features: [
                'Cardioid Pattern',
                'Shock Mount',
                'Legendary Reliability',
              ],
              brand: 'Shure',
            },
            {
              name: 'QSC KW181 Subwoofer',
              type: 'Subwoofer',
              description: '18" powered subwoofer for deep low-end',
              image: picsum(),
              features: ['1000W Class-D', 'Deep Bass', 'Rugged Build'],
              brand: 'QSC',
            },
            {
              name: 'Sennheiser e935',
              type: 'Dynamic Microphone',
              description: 'Vocal mic with clear presence and definition',
              image: unsplash('mic'),
              features: ['Cardioid', 'Feedback Rejection', 'Durable'],
              brand: 'Sennheiser',
            },
          ],
        },
        {
          name: 'Instruments',
          items: [
            {
              name: 'Pearl Export Series',
              type: 'Drum Set',
              description: 'Professional 5-piece drum set with cymbals',
              image: '/placeholder.svg?height=300&width=400',
              features: [
                '5-Piece Configuration',
                'Poplar Shells',
                'Professional Hardware',
              ],
              brand: 'Pearl',
            },
            {
              name: 'Fender Jazz Bass',
              type: 'Bass Guitar',
              description: 'Classic 4-string bass with rich tone',
              image: unsplash('bass'),
              features: ['Alder Body', 'Maple Neck', 'Versatile'],
              brand: 'Fender',
            },
            {
              name: 'Marshall DSL40C',
              type: 'Guitar Amplifier',
              description: '40W tube combo amp with classic crunch',
              image: picsum(),
              features: ['2 Channels', 'Reverb', 'Classic Marshall Tone'],
              brand: 'Marshall',
            },
          ],
        },
        {
          name: 'Lighting Equipment',
          items: [
            {
              name: 'Moving Head LED',
              type: 'Intelligent Lighting',
              description:
                'Professional moving head lights with full color spectrum',
              image: '/placeholder.svg?height=300&width=400',
              features: ['360° Pan/Tilt', 'RGB+W LEDs', 'DMX Control'],
              brand: 'Chauvet',
            },
            {
              name: 'LED Par Lights',
              type: 'Wash Lighting',
              description: 'Versatile LED par lights for ambient lighting',
              image: '/placeholder.svg?height=300&width=400',
              features: [
                'RGBW Color Mixing',
                'Silent Operation',
                'Compact Design',
              ],
              brand: 'ADJ',
            },
            {
              name: 'Fog Machine',
              type: 'Atmosphere',
              description: 'Creates atmospheric haze/fog effects',
              image: picsum(),
              features: ['Fast Warm-up', 'Remote Control', 'Compact'],
              brand: 'ADJ',
            },
            {
              name: 'LED Pixel Bar',
              type: 'Effect Lighting',
              description: 'Chase effects and pixel mapping for stages',
              image: unsplash('led lighting'),
              features: ['RGB', 'DMX Control', 'Low Power'],
              brand: 'Chauvet',
            },
          ],
        },
        {
          name: 'Backline',
          items: [
            {
              name: 'DW 9000 Kick Pedal',
              type: 'Drum Hardware',
              description: 'Smooth and responsive double-chain pedal',
              image: picsum(),
              features: ['Adjustable Cam', 'Dual-chain', 'Carry Case'],
              brand: 'DW',
            },
            {
              name: 'Korg Kronos 61',
              type: 'Keyboard',
              description: 'Workstation synth for live and studio',
              image: unsplash('keyboard'),
              features: ['Multiple Engines', 'Touchscreen', 'Aftertouch'],
              brand: 'Korg',
            },
          ],
        },
      ]

      for (const equipment of equipmentData) {
        await Equipment.create(equipment)
      }
      console.log('✓ Equipment data initialized')
    } else {
      console.log('ℹ️  Equipment data already exists, skipping...')
    }

    // Initialize Packages data
    console.log('🔍 Checking for existing Packages data...')
    const existingPackages = await Package.find()
    console.log('📦 Existing Packages count:', existingPackages.length)
    if (existingPackages.length === 0) {
      console.log('📦 Creating sample Packages data...')
      const packagesData = [
        {
          name: 'Basic Setup',
          price: 6000,
          currency: '₱',
          description:
            'Perfect for acoustic sets and intimate live performances',
          features: [
            '2 Wireless Microphones',
            'Acoustic-Optimized Sound System',
            'Basic Stage Lighting',
            '4-hour Live Performance Support',
            'Setup & Breakdown',
          ],
          equipment: [
            'RCF ART 312A Speakers',
            'Yamaha MG10XU Mixer',
            'Shure SM58 Microphones',
            'Basic LED Stage Lights',
          ],
          idealFor: 'Acoustic performances, small venues, coffee shop gigs',
          maxGuests: 50,
          popular: false,
          recommendedEvents: [
            'Acoustic gigs',
            'Coffee shop sessions',
            'Birthday at home',
          ],
        },
        {
          name: 'Full Band Setup',
          price: 15000,
          currency: '₱',
          description: 'Complete live band setup for rock performances',
          features: [
            '4 Wireless Microphones',
            'Professional Live Sound System',
            'Dynamic Stage Lighting',
            'Full Drum Kit & Backline',
            '6-hour Live Performance Support',
            'Professional Sound Engineer',
          ],
          equipment: [
            'RCF ART 745A Speakers',
            'Allen & Heath SQ-5 Mixer',
            'Pearl Export Drum Set',
            'Moving Head LED Stage Lights',
            'Fog Machine',
            'Guitar/Bass Amplifiers',
          ],
          idealFor: 'Rock bands, live concerts, music festivals',
          maxGuests: 200,
          popular: true,
          recommendedEvents: ['Bar gigs', 'Corporate party', 'School fair'],
        },
        {
          name: 'Full Concert Experience',
          price: 20000,
          currency: '₱',
          description: 'Ultimate concert experience for major live events',
          features: [
            '6 Wireless Microphones',
            'Arena-Grade Sound System',
            'Full Concert Lighting Rig',
            'Complete Backline Setup',
            '8-hour Concert Support',
            'Dedicated Sound & Light Crew',
          ],
          equipment: [
            'RCF TTL55A Line Array',
            'Allen & Heath dLive S3000',
            'Pearl Reference Drum Set',
            'Full LED Concert Lighting Truss',
            'Haze Machine',
            'Wireless In-Ear Monitor System',
            'Professional Backline',
          ],
          idealFor: 'Major concerts, music festivals, arena shows',
          maxGuests: 500,
          popular: false,
          recommendedEvents: [
            'Town fiesta',
            'Outdoor concert',
            'Large corporate show',
          ],
        },
      ]

      for (const pkg of packagesData) {
        await Package.create(pkg)
      }
      console.log('✓ Packages data initialized')
    } else {
      console.log('ℹ️  Packages data already exists, skipping...')
    }

    // Initialize Vlogs (YouTube links)
    console.log('🔍 Checking for existing Vlogs data...')
    const existingVlogs = await Vlog.find()
    if (existingVlogs.length === 0) {
      const youtubeUrls = [
        'https://www.youtube.com/watch?v=tgD2soayoRE',
        'https://www.youtube.com/watch?v=C7Bib3B5yNs',
        'https://www.youtube.com/watch?v=TL1hv4GoIfo',
        'https://www.youtube.com/watch?v=89BcqVpeaXQ&t=8s',
        'https://www.youtube.com/watch?v=yWw6qzXrDRw&t=219s',
        'https://www.youtube.com/watch?v=8trNMKgUbns&t=113s',
      ]
      const toId = (u: string) =>
        (u.match(/v=([^&]+)/)?.[1] || '').replace(/\s/g, '')
      await Vlog.insertMany(
        youtubeUrls.map((url) => ({ url, youtubeId: toId(url) })),
      )
      console.log('✓ Vlogs data initialized')
    } else {
      console.log('ℹ️  Vlogs already exist, skipping...')
    }

    // Initialize Recent Events mapped to packages
    console.log('🔍 Checking for existing Events data...')
    const existingEvents = await Event.find()
    if (existingEvents.length === 0) {
      console.log('📅 Creating sample Events data linked to packages...')
      const sampleEvents = [
        {
          title: 'Christmas Party at Versailles Palace, Alabang',
          description: 'Corporate year-end party with live band and program',
          date: '2025-12-10',
          location: 'Versailles Palace, Alabang',
          eventType: 'Christmas Party',
          package: 'Semi Basic Setup',
          image: '/placeholder.jpg',
          highlights: ['Subwoofers', 'Basic lighting'],
        },
        {
          title: 'Bar Gigs Night — Makati',
          description: 'Full band setup for bar residency',
          date: '2025-11-05',
          location: 'Makati City',
          eventType: 'Bar gig',
          package: 'Full Band Setup',
          image: '/placeholder.jpg',
          highlights: ['Moving heads', 'Fog machine'],
        },
        {
          title: 'Town Fiesta Open Grounds',
          description: 'Outdoor concert stage with full concert experience',
          date: '2025-10-15',
          location: 'Silang, Cavite',
          eventType: 'Town fiesta',
          package: 'Full Concert Experience',
          image: '/placeholder.jpg',
          highlights: ['Line array', 'LED truss'],
        },
      ]

      for (const ev of sampleEvents) {
        await Event.create(ev)
      }
      console.log('✓ Events data initialized')
    } else {
      console.log('ℹ️  Events data already exists, skipping...')
    }

    console.log('🎉 All data initialization completed successfully!')
    return NextResponse.json({
      success: true,
      message:
        'Original About Us, Company, Equipment, and Packages data has been successfully stored in the database!',
    })
  } catch (error) {
    console.error('❌ Error initializing data:', error)
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown',
    })

    // Return more detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
