# Image Upload Setup Guide

## Setting Up Service Image Uploads

Your admin dashboard now supports uploading images directly from their device. Follow these steps to enable this feature:

## Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project (Sindiswa)
3. Click on **Storage** in the left menu
4. Click **Create a new bucket**
5. Name the bucket: `service-images`
6. Make it **Public** (toggle to ON)
7. Click **Create bucket**

## Step 2: Configure Bucket Settings

1. Click on the `service-images` bucket you just created
2. Go to **Settings** tab
3. Set these options:
   - **File size limit**: 10MB (should be default)
   - **Allowed MIME types**: `image/*` (or leave empty for all image types)
4. Save settings

## Step 3: Test Image Upload

1. Go to Admin Dashboard → Services tab
2. Create a new service or edit an existing one
3. Click on **"Click to upload image from device"**
4. Select an image from your computer
5. Wait for it to upload (you'll see a preview)
6. Click "Add Service" or "Update Service"

## Features

✅ **Drag & Drop Compatible** - Works with most modern browsers
✅ **File Validation** - Only accepts image files up to 5MB
✅ **Instant Preview** - See your image before saving
✅ **Auto Upload** - Images upload to Supabase automatically
✅ **Remove Option** - Delete selected image and choose another

## Supported Image Formats

- JPG / JPEG
- PNG
- GIF
- WebP
- BMP
- SVG

## Troubleshooting

**"Error uploading image"**
- Make sure the `service-images` bucket exists and is Public
- Check file size is under 5MB
- Try a different image format

**"Image won't show in preview"**
- Check your internet connection
- Try uploading again
- Make sure the bucket is set to Public

**Images appear in admin but not on homepage**
- The image URL should auto-populate in the image_url field
- Just click "Update Service" to save

## Size Recommendations

For best performance:
- **Image dimensions**: 400x300px or larger (landscape)
- **File size**: 200KB - 1MB compressed
- **Format**: JPG for photos, PNG for graphics

### Quick Image Compression

If your images are too large:
1. Use https://tinypng.com (free online)
2. Or use https://imageoptimizer.net (free online)
3. Or right-click image → Send to → Compressed
