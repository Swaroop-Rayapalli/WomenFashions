# Quick Railway Deployment Script

## Railway URL Placeholder
After deploying to Railway, you'll get a URL like:
`https://womenfashions-backend-production.up.railway.app`

## Update This File
Once you have your Railway URL, update the RAILWAY_URL below and run the update script.

```bash
# Your Railway URL (update this after deployment)
RAILWAY_URL=https://YOUR-RAILWAY-URL.up.railway.app
```

## Quick Update Command
After getting your Railway URL, run this in PowerShell:

```powershell
# Navigate to project root
cd d:\Web_Projects\WomenFashions

# Update contact.html with Railway URL
$railwayUrl = "https://YOUR-RAILWAY-URL.up.railway.app"  # Replace with your actual URL
$content = Get-Content contact.html -Raw
$content = $content -replace 'https://womenfashions-backend.onrender.com', $railwayUrl
Set-Content contact.html $content

# Commit and push
git add contact.html
git commit -m "Update API URL to Railway backend"
git push
```

## Environment Variables for Railway

Copy these to Railway Variables tab:

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://womensfashions.netlify.app
EMAIL_USER=pawcare376@gmail.com
EMAIL_PASSWORD=stdybnndcdpghrxv
JWT_SECRET=womenfashion_super_secret_key_2025_change_this_in_production
JWT_EXPIRE=7d
```
