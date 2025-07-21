# ☁️ Cloudinary Setup Guide

## 🎉 Why Cloudinary is Perfect for You

✅ **25GB storage + 25GB bandwidth FREE forever**  
✅ **Much cheaper than alternatives** ($89/month vs $199+ elsewhere)  
✅ **Automatic image optimization**  
✅ **Global CDN included**  
✅ **Perfect for business websites**

## 1. Create Your FREE Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Verify your email
4. Complete the setup wizard

## 2. Get Your Credentials

After signing up:

1. Go to your **Dashboard**
2. Find these values in the **Account Details** section:
   - **Cloud Name** (e.g., `dxxxxxxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (starts with letters/numbers)

## 3. Create Upload Preset (IMPORTANT!)

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **"Add upload preset"**
4. Set these settings:
   - **Preset name**: `legato_preset`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `legato-images` (optional)
   - **Allowed formats**: `jpg,jpeg,png,gif,webp`
   - **Max file size**: `10000000` (10MB)
   - **Max image dimensions**: `2000x2000`
5. Click **"Save"**

## 4. Environment Variables

Create/update your `.env.local` file:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/legato-admin

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=legato_preset
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 5. Test Your Setup

1. **Restart your dev server**: `npm run dev`
2. Go to **Admin** → **Gallery** → **Add New Gallery Image**
3. Click the upload area
4. You should see the Cloudinary upload widget! 🎉
5. Upload an image and it will be stored in your Cloudinary account

## 6. What You Get FREE

✅ **25GB storage** (enough for thousands of images!)  
✅ **25GB monthly bandwidth** (perfect for business websites)  
✅ **Automatic optimization** (WebP conversion, compression)  
✅ **Global CDN** (fast delivery worldwide)  
✅ **Image transformations** (resize, crop, effects)  
✅ **99.9% uptime SLA**

## 7. Admin Pages with Image Upload

✅ **Testimonials** - Customer photos  
✅ **Gallery** - Event photos  
✅ **Events** - Event photos  
✅ **Equipment** - Equipment photos (coming soon)

## 8. Pricing (When You Grow)

**Free Forever Tier:**

- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month

**Advanced Plan** ($89/month):

- 75GB storage
- 75GB bandwidth/month
- 100,000 transformations/month

_Much better than Uploadcare's $199/month!_

## 9. Features Your Images Get

🚀 **Automatic Optimization**

- WebP conversion for modern browsers
- Automatic compression without quality loss
- Progressive JPEG loading

🌍 **Global CDN**

- Fast delivery from 200+ locations worldwide
- 99.9% uptime guarantee
- Automatic caching

✂️ **On-the-fly Transformations**

- Resize images: `your-image.jpg?w=300&h=200`
- Add effects: `your-image.jpg?e_sepia`
- Smart cropping: `your-image.jpg?c_fill,g_face`

## 10. Troubleshooting

**Upload widget not showing?**

- Check your Cloud Name in `.env.local`
- Restart your dev server
- Check browser console for errors

**Upload failing?**

- Verify your upload preset is set to "Unsigned"
- Check that preset name matches exactly: `legato_preset`

**Images not loading?**

- Check if URLs start with `https://res.cloudinary.com/`
- Verify your cloud name is correct

## 11. Advanced Tips

**Custom Transformations:**

```javascript
// Resize to 300x200
const resizedUrl = originalUrl.replace('/upload/', '/upload/w_300,h_200/')

// Add watermark
const watermarkedUrl = originalUrl.replace(
  '/upload/',
  '/upload/l_text:Arial_20:Legato/',
)
```

**Folder Organization:**

- Images are stored in `/legato-images/` folder
- You can create subfolders: `testimonials/`, `gallery/`, `events/`

Need help? Check the [Cloudinary Documentation](https://cloudinary.com/documentation) or contact their excellent support team!
