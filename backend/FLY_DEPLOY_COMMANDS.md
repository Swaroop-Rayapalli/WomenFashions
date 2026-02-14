# Quick Fly.io Deployment Commands

## After installing Fly CLI, run these commands:

```powershell
# 1. Navigate to backend directory
cd d:\Web_Projects\WomenFashions\backend

# 2. Login to Fly.io (opens browser)
flyctl auth login

# 3. Launch the app (interactive setup)
flyctl launch

# When prompted:
# - App name: womenfashions-backend (or press Enter for auto-generated)
# - Region: sin (Singapore) or bom (Mumbai)
# - PostgreSQL: No
# - Redis: No
# - Deploy now: No (we'll set secrets first)

# 4. Set environment secrets
flyctl secrets set `
  NODE_ENV=production `
  FRONTEND_URL=https://womensfashions.netlify.app `
  EMAIL_USER=pawcare376@gmail.com `
  EMAIL_PASSWORD=stdybnndcdpghrxv `
  JWT_SECRET=womenfashion_super_secret_key_2025_change_this_in_production `
  JWT_EXPIRE=7d

# 5. Deploy
flyctl deploy

# 6. Check status
flyctl status

# 7. View logs
flyctl logs

# 8. Get your URL
# It will be: https://womenfashions-backend.fly.dev
```

## After Deployment

Update `contact.html` line 293-295:
```javascript
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://womenfashions-backend.fly.dev/api';
```

Then push to GitHub:
```powershell
cd d:\Web_Projects\WomenFashions
git add .
git commit -m "Deploy backend to Fly.io"
git push
```
