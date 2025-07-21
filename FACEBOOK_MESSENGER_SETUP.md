# Facebook Messenger Integration Setup Guide

## 🎯 What's Integrated

✅ **Webhook API endpoint** (`/api/messenger/webhook`)
✅ **Automated responses** for Legato services
✅ **Chat widget** on website
✅ **Lead capture** system
✅ **24/7 customer service** automation

## 🔧 Setup Instructions

### Step 1: Create Facebook App & Page

1. **Go to [Facebook Developers](https://developers.facebook.com/)**

   - Click "Create App"
   - Choose "Business" app type
   - Name: "Legato Messenger Bot"

2. **Add Messenger Product**

   - Go to your app dashboard
   - Click "Add Product"
   - Select "Messenger"

3. **Connect Your Facebook Page**
   - In Messenger settings, click "Add or Remove Pages"
   - Select your "Legato Sounds and Lights" page
   - Generate Page Access Token

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Facebook Messenger Configuration
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
FACEBOOK_VERIFY_TOKEN=LegatoMessenger2024
FACEBOOK_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_FACEBOOK_PAGE_ID=your_facebook_page_id_here

# Contact Information
NEXT_PUBLIC_WHATSAPP_NUMBER=+639171234567
NEXT_PUBLIC_PHONE_NUMBER=+639171234567
```

### Step 3: Set Up Webhooks

1. **In Facebook App Dashboard:**

   - Go to Messenger > Settings
   - Click "Add Callback URL"
   - URL: `https://yourdomain.com/api/messenger/webhook`
   - Verify Token: `LegatoMessenger2024` (same as in .env)

2. **Subscribe to Events:**
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ messaging_optins
   - ✅ message_deliveries

### Step 4: Get Your Page ID

**Method 1 - From Facebook Page:**

1. Go to your Facebook page
2. Click "About"
3. Scroll to "Page ID"

**Method 2 - From Graph API:**

```bash
curl "https://graph.facebook.com/v18.0/me?access_token=YOUR_PAGE_ACCESS_TOKEN"
```

### Step 5: Test the Integration

1. **Deploy your website** (Vercel, Netlify, etc.)
2. **Update webhook URL** with your live domain
3. **Test messaging:**
   - Go to your Facebook page
   - Send message: "Hi"
   - Should get automated response! 🎉

## 🚀 Features Available

### Automated Responses for:

- 🎵 **Booking inquiries** - Event details, pricing
- 💰 **Package information** - Acoustic & Rock packages
- 🎛️ **Equipment specs** - Professional gear details
- 📍 **Service coverage** - Cavite, Metro Manila areas
- 📞 **Contact details** - WhatsApp, phone, email

### Smart Keywords Trigger:

- "book", "booking", "event" → Booking flow
- "price", "cost", "package" → Package pricing
- "equipment", "gear", "sound" → Equipment specs
- "location", "coverage", "area" → Service areas
- "contact", "phone", "whatsapp" → Contact info
- "hello", "hi", "hey" → Welcome message

## 📱 Chat Widget Features

- ✅ **Facebook Messenger** integration
- ✅ **Custom chat button** with tooltip
- ✅ **SEO optimized** with schema markup
- ✅ **Mobile responsive**
- ✅ **Legato branding** (green theme)

## 🔒 Security Features

- ✅ **Webhook signature verification**
- ✅ **Environment variable protection**
- ✅ **Error handling & logging**
- ✅ **Rate limiting protection**

## 🎨 Customization

### Update Responses:

Edit `/app/api/messenger/webhook/route.ts` - `handleMessage()` function

### Change Chat Widget Style:

Edit `/components/messenger-chat-widget.tsx` - theme colors, positioning

### Add New Keywords:

Add conditions in the message handler for new trigger words

## 📊 Analytics & Monitoring

Monitor your integration:

- **Facebook Page Insights** - Message metrics
- **Next.js logs** - Webhook activity
- **Vercel Analytics** - Traffic patterns

## 🆘 Troubleshooting

### Chat Widget Not Showing:

1. Check `NEXT_PUBLIC_FACEBOOK_PAGE_ID` is set
2. Verify page is published (not draft)
3. Check console for JavaScript errors

### Webhook Not Working:

1. Verify webhook URL is accessible
2. Check `FACEBOOK_VERIFY_TOKEN` matches
3. Ensure HTTPS (required by Facebook)
4. Check webhook subscriptions are active

### Messages Not Sending:

1. Verify `FACEBOOK_PAGE_ACCESS_TOKEN` is valid
2. Check app has `pages_messaging` permission
3. Ensure page is connected to the app

## 💡 Pro Tips

1. **Test locally** using ngrok for webhook development
2. **Monitor logs** in production for debugging
3. **Update responses** based on customer feedback
4. **Use Facebook Analytics** to track engagement
5. **Keep tokens secure** - never commit to Git

## 🎯 Business Benefits

- 💬 **24/7 Customer Service** - Never miss a lead
- 🚀 **Instant Responses** - Faster than competitors
- 📈 **Lead Capture** - More bookings from Facebook
- 💰 **Cost Effective** - FREE automation
- 🎵 **Professional Image** - Modern communication

## Next Steps

1. **Set up the Facebook app** following steps above
2. **Deploy your website** with the integration
3. **Test all message flows** thoroughly
4. **Train your team** on the new system
5. **Monitor and optimize** based on usage

Your Facebook Messenger integration is ready to rock! 🎸🔥
