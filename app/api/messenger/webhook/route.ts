import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const APP_SECRET = process.env.FACEBOOK_APP_SECRET

interface MessagingEvent {
  sender: { id: string }
  message?: { text?: string }
}

interface WebhookEntry {
  id: string
  messaging: MessagingEvent[]
}

interface WebhookData {
  object: string
  entry: WebhookEntry[]
}

// Verify webhook endpoint (GET request from Facebook)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully!')
    return new NextResponse(challenge)
  } else {
    console.log('Webhook verification failed')
    return new NextResponse('Verification failed', { status: 403 })
  }
}

// Handle incoming messages (POST request from Facebook)
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    // Verify the request signature
    if (!verifySignature(body, signature)) {
      console.log('Invalid signature')
      return new NextResponse('Invalid signature', { status: 401 })
    }

    const data: WebhookData = JSON.parse(body)

    if (data.object === 'page') {
      // Process each entry
      for (const entry of data.entry) {
        for (const messaging of entry.messaging) {
          await handleMessage(messaging)
        }
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Verify request signature for security
function verifySignature(body: string, signature: string | null): boolean {
  if (!signature || !APP_SECRET) return false

  const expectedSignature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(body)
    .digest('hex')

  const receivedSignature = signature.replace('sha256=', '')
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex'),
  )
}

// Handle incoming messages and send automated responses
async function handleMessage(messaging: MessagingEvent) {
  const senderId = messaging.sender.id
  const message = messaging.message

  // Skip if no message text (could be attachments, etc.)
  if (!message?.text) return

  const messageText = message.text.toLowerCase()
  let response = ''

  // Automated responses for Legato Sounds and Lights
  if (
    messageText.includes('book') ||
    messageText.includes('booking') ||
    messageText.includes('event')
  ) {
    response = `🎵 Hi there! Thanks for your interest in Legato Sounds and Lights! 

For bookings, please let us know:
📅 Event date
📍 Location (Cavite, Metro Manila, nearby areas)
🎸 Type of event (rock concert, live band, etc.)
👥 Expected audience size

We offer complete sound and lighting packages starting at ₱6,000!

WhatsApp: ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+63 917 123 4567'}
Phone: ${process.env.NEXT_PUBLIC_PHONE_NUMBER || '+63 917 123 4567'}`
  } else if (
    messageText.includes('price') ||
    messageText.includes('cost') ||
    messageText.includes('package')
  ) {
    response = `💰 Our Packages:

🎤 Acoustic Starter - ₱6,000
• 2 Wireless Microphones
• Acoustic-Optimized Sound System
• Basic Stage Lighting
• 4-hour Live Performance Support

🎸 Rock Amplifier - ₱15,000
• 6 Wireless Microphones
• Professional Live Sound System
• Dynamic Stage Lighting
• Full Drum Kit & Backline
• 8-hour Live Performance Support

All packages include setup & breakdown! 
Contact us for custom quotes: +63 917 123 4567`
  } else if (
    messageText.includes('equipment') ||
    messageText.includes('gear') ||
    messageText.includes('sound')
  ) {
    response = `🎛️ Professional Equipment:

🔊 Sound Systems: RCF, QSC, Yamaha
🎤 Microphones: Shure, Audio-Technica
🥁 Drums: Pearl, Tama
🎸 Amps: Marshall, Fender, Orange
💡 Lighting: Moving heads, LED panels, stage wash

We use only professional-grade equipment for rock bands and live events!`
  } else if (
    messageText.includes('location') ||
    messageText.includes('coverage') ||
    messageText.includes('area')
  ) {
    response = `📍 Service Coverage:

✅ Trece Martires, Cavite (our base)
✅ Metro Manila
✅ Cavite Province
✅ Nearby Laguna areas
✅ Batangas (selected areas)

We specialize in rock bands and live music events. Travel charges may apply for distant locations.`
  } else if (
    messageText.includes('contact') ||
    messageText.includes('phone') ||
    messageText.includes('whatsapp')
  ) {
    response = `📞 Contact Legato Sounds and Lights:

📱 WhatsApp: +63 917 123 4567
☎️ Phone: +63 917 123 4567
📧 Email: info@legatosounds.com
📍 Trece Martires City, Cavite

💬 Facebook: You&apos;re already here!
🌐 Website: [Your website URL]

Best way to reach us: WhatsApp for instant quotes! 🎵`
  } else if (
    messageText.includes('hello') ||
    messageText.includes('hi') ||
    messageText.includes('hey')
  ) {
    response = `🤘 Hey there! Welcome to Legato Sounds and Lights! 

We&apos;re your go-to team for ROCK-SOLID sound and lighting for:
🎸 Rock concerts
🎵 Live band performances  
🎤 Music events
💡 Professional stage lighting

How can we help make your event LEGENDARY? Just ask about:
• Bookings & packages
• Equipment specs
• Pricing
• Coverage areas

&quot;Turn It Up to 11!&quot; 🎵🔥`
  } else {
    response = `🎵 Thanks for contacting Legato Sounds and Lights! 

I can help you with:
📅 Bookings & event scheduling
💰 Package pricing
🎛️ Equipment information
📍 Service coverage areas
📞 Contact details

Just ask me anything about our sound and lighting services for rock bands and live events!

For immediate assistance: WhatsApp +63 917 123 4567`
  }

  // Send the response back to Facebook
  await sendMessage(senderId, response)
}

// Send message back to user via Facebook Graph API
async function sendMessage(recipientId: string, messageText: string) {
  if (!PAGE_ACCESS_TOKEN) {
    console.error('No page access token configured')
    return
  }

  const messageData = {
    recipient: { id: recipientId },
    message: { text: messageText },
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Error sending message:', error)
    } else {
      console.log('Message sent successfully')
    }
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
