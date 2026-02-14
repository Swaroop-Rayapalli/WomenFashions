    # Deployment Guide - Women Fashions

## Current Setup
- ✅ **Frontend**: Deployed on Netlify (static HTML/CSS/JS)
- ❌ **Backend**: Not deployed (needs to be deployed for email to work)

## Problem
The contact form tries to connect to `http://localhost:5000/api/contact` which only works on your local machine. On Netlify, it fails because there's no backend server.

---

## Solution: Deploy Backend to Render.com

### Step 1: Prepare Backend for Deployment

1. **Add a start script** to `backend/package.json`:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. **Create `.gitignore` in backend folder** (if not exists):
   ```
   node_modules/
   .env
   uploads/
   *.sqlite
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push
   ```

### Step 2: Deploy to Render.com

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repo**: `WomenFashions`
5. **Configure**:
   - **Name**: `womenfashions-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=5000
   EMAIL_USER=pawcare376@gmail.com
   EMAIL_PASSWORD=stdybnndcdpghrxv
   FRONTEND_URL=https://your-netlify-site.netlify.app
   JWT_SECRET=womenfashion_super_secret_key_2025_change_this_in_production
   JWT_EXPIRE=7d
   ```

7. **Click "Create Web Service"**

8. **Wait 5-10 minutes** for deployment

9. **Copy the URL** (e.g., `https://womenfashions-backend.onrender.com`)

### Step 3: Update Frontend to Use Deployed Backend

Update `contact.html` line ~310:
```javascript
// Change from:
const response = await fetch('http://localhost:5000/api/contact', {

// To:
const response = await fetch('https://womenfashions-backend.onrender.com/api/contact', {
```


### Step 4: Deploy Updated Frontend

```bash
git add contact.html
git commit -m "Update API URL for production"
git push
```

Netlify will auto-deploy the changes!

---

## Alternative: Use Netlify Functions (Serverless)

If you prefer to keep everything on Netlify:

1. Convert backend to Netlify Functions
2. No separate backend deployment needed
3. Slightly more complex setup

Let me know if you want this approach instead!

---

## Testing

After deployment:
1. Visit your Netlify site
2. Go to Contact page
3. Submit the form
4. Check pawcare376@gmail.com for the email!

---

## Troubleshooting

**Backend not starting on Render:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure `package.json` has correct start script

**CORS errors:**
- Make sure `FRONTEND_URL` in Render matches your Netlify URL exactly
- Include `https://` in the URL

**Email not sending:**
- Verify `EMAIL_PASSWORD` is set correctly in Render
- Check Render logs for error messages
