# Email Setup Guide for Women Fashions Contact Form

## Overview
The contact form on your website now sends emails to **pawcare376@gmail.com** when visitors submit messages.

## Setup Instructions

### 1. Gmail App Password Setup

Since you're using Gmail, you need to create an **App Password** (not your regular Gmail password) for security:

#### Steps to Create Gmail App Password:

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Create App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Women Fashions Website"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### 2. Update .env File

Open `backend/.env` and add your Gmail App Password:

```env
# Email Configuration (Gmail)
EMAIL_USER=pawcare376@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
```

**Example:**
```env
EMAIL_USER=pawcare376@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 3. Restart the Backend Server

After updating the `.env` file, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd backend
npm run dev
```

## Testing the Contact Form

1. Make sure both servers are running:
   - Backend: `npm run dev` in `backend` folder (port 5000)
   - Frontend: `python -m http.server 8000` in root folder (port 8000)

2. Open http://localhost:8000/contact.html in your browser

3. Fill out the contact form and click "Send Message"

4. Check the email inbox at **pawcare376@gmail.com** for the message

## Email Features

✅ **Beautifully formatted HTML emails** with your brand colors
✅ **All form data included**: Name, Phone, Email, Service, Message
✅ **Success/Error notifications** shown to users
✅ **Form auto-resets** after successful submission
✅ **Professional email template** matching your brand

## Troubleshooting

### "Failed to send message" error:
- ✓ Check that `EMAIL_PASSWORD` is set in `.env`
- ✓ Verify the App Password is correct (16 characters)
- ✓ Make sure 2-Step Verification is enabled on Gmail
- ✓ Restart the backend server after updating `.env`

### Email not received:
- ✓ Check spam/junk folder
- ✓ Verify `EMAIL_USER` is set to `pawcare376@gmail.com`
- ✓ Check backend console for error messages

### Connection error:
- ✓ Make sure backend server is running on port 5000
- ✓ Check that CORS is properly configured (already done)

## Files Modified

1. **Backend:**
   - `backend/services/emailService.js` - Email sending logic
   - `backend/routes/contact.js` - API endpoint for contact form
   - `backend/server.js` - Added contact route
   - `backend/.env` - Email configuration

2. **Frontend:**
   - `contact.html` - Updated form with email functionality

## Security Notes

⚠️ **Never commit your `.env` file to Git** - It contains sensitive passwords
⚠️ **Use App Passwords, not your main Gmail password**
⚠️ **Keep your App Password secure** - Treat it like a password

## Support

If you need help setting up the Gmail App Password or have any issues, let me know!
