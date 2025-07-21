# 🚀 Production Environment Variables Guide

## 📋 Required Environment Variables

### 1. Database Configuration

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legato-production?retryWrites=true&w=majority
```

### 2. Authentication Security

```bash
# NextAuth.js Configuration (CRITICAL FOR SECURITY)
NEXTAUTH_SECRET=your-super-secure-random-32-character-string-here
NEXTAUTH_URL=https://yourdomain.com

# Admin Authentication
ADMIN_USERNAME=your-secure-admin-username
ADMIN_PASSWORD=your-very-secure-admin-password-123
```

### 3. Cloudinary Configuration

```bash
# Image Upload Service
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=legato_preset
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_key
```

## 🔒 Security Best Practices

### 1. Generate Secure NEXTAUTH_SECRET

```bash
# Use this command to generate a secure secret:
openssl rand -base64 32

# Or use this online tool: https://generate-secret.vercel.app/32
```

### 2. Strong Admin Credentials

- **Username**: At least 8 characters, avoid common names
- **Password**: At least 12 characters with mix of letters, numbers, symbols
- **Examples** (DON'T use these exact ones):
  ```bash
  ADMIN_USERNAME=legato_admin_2024
  ADMIN_PASSWORD=Lg@to$ounds2024!
  ```

### 3. Database Security

- Use MongoDB Atlas with restricted IP access
- Enable database authentication
- Use strong database passwords

## 🌐 Platform-Specific Deployment

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add all variables above
4. Set **Production** environment for all

### Netlify Deployment

1. Site Settings → Environment Variables
2. Add all required variables
3. Redeploy your site

### Railway/Render/Heroku

1. Dashboard → Environment Variables
2. Add all required variables
3. Restart your application

## ⚠️ NEVER Commit These to Git

Make sure your `.env.local` is in `.gitignore`:

```gitignore
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Cloudinary
.cloudinary/

# Database
*.db
*.sqlite
```

## 🧪 Testing Your Environment

### 1. Development Testing

```bash
# Copy this into .env.local for development
MONGODB_URI=mongodb://localhost:27017/legato-admin
NEXTAUTH_SECRET=development-secret-only-not-for-production
NEXTAUTH_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=legato_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Production Checklist

- [ ] NEXTAUTH_SECRET is 32+ characters and random
- [ ] Admin password is strong and unique
- [ ] MongoDB URI uses Atlas (cloud) not localhost
- [ ] Cloudinary credentials are correct
- [ ] NEXTAUTH_URL matches your domain exactly
- [ ] All environment variables are set in deployment platform

## 🔧 Environment Variable Validation

Add this to your `next.config.ts` for validation:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Runtime checks
  async headers() {
    // Validate required environment variables
    const requiredVars = [
      'MONGODB_URI',
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    ]

    for (const envVar of requiredVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`)
      }
    }

    return []
  },
}

module.exports = nextConfig
```

## 🚨 Emergency Environment Reset

If your environment is compromised:

1. **Immediately change**:

   - `NEXTAUTH_SECRET` (generate new one)
   - `ADMIN_PASSWORD` (create new strong password)
   - Database password (in MongoDB Atlas)

2. **Rotate Cloudinary keys**:

   - Generate new API Key/Secret in Cloudinary dashboard
   - Update environment variables

3. **Check access logs**:
   - Review admin access logs
   - Check for suspicious activity

## 📞 Support

If you need help with environment setup:

- Vercel: [vercel.com/support](https://vercel.com/support)
- MongoDB Atlas: [support.mongodb.com](https://support.mongodb.com)
- Cloudinary: [support.cloudinary.com](https://support.cloudinary.com)

## 🎯 Quick Production Deploy Commands

### Vercel

```bash
npx vercel env add MONGODB_URI
npx vercel env add NEXTAUTH_SECRET
npx vercel env add ADMIN_USERNAME
npx vercel env add ADMIN_PASSWORD
npx vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
npx vercel env add CLOUDINARY_API_KEY
npx vercel env add CLOUDINARY_API_SECRET
```

### Using Vercel CLI (Recommended)

```bash
# Deploy with environment check
vercel --prod
```

Your production environment is ready! 🚀
