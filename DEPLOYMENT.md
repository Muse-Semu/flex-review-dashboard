# Deployment Guide

This guide covers deploying the Flex Living Reviews Dashboard to various platforms.

## Option 1: Vercel (Recommended - Full Stack)

Vercel supports both frontend and backend (via serverless functions).

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Configure Build Settings:**
   - Root Directory: `/` (root)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install:all`

4. **Environment Variables (if needed):**
   - Go to Project Settings → Environment Variables
   - Add any required variables

### Vercel Configuration

The project includes:
- `vercel.json` - Main configuration
- `api/` folder - Serverless functions for backend API
- Frontend builds to `frontend/dist`

### Access Your App

After deployment, Vercel will provide a URL like:
`https://your-project-name.vercel.app`

---

## Option 2: Render (Full Stack)

Render supports full-stack applications with persistent services.

### Steps

1. **Create a Web Service:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend:**
   - **Name:** flex-reviews-backend
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `backend`

3. **Configure Frontend:**
   - Create another Web Service
   - **Name:** flex-reviews-frontend
   - **Environment:** Static Site
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Root Directory:** `frontend`

4. **Update API URL:**
   - In `frontend/src/services/api.ts`, update `API_BASE` to your backend URL
   - Or use environment variables

### Render Configuration Files

Create `render.yaml` in the root:

```yaml
services:
  - type: web
    name: flex-reviews-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

  - type: web
    name: flex-reviews-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
```

---

## Option 3: Railway (Full Stack)

Railway makes it easy to deploy full-stack apps.

### Steps

1. **Go to [railway.app](https://railway.app)**
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your repository**
4. **Add Services:**
   - **Backend Service:**
     - Root Directory: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - **Frontend Service:**
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run preview`

5. **Configure Environment:**
   - Add environment variables in Railway dashboard
   - Update frontend API URL to backend service URL

---

## Option 4: Netlify (Frontend) + Railway/Render (Backend)

### Frontend on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. **Build settings:**
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

### Backend on Railway/Render

Follow Option 2 or 3 for backend deployment, then update frontend API URL.

---

## Environment Variables

If deploying separately, you may need:

**Backend:**
- `PORT` (usually auto-set by platform)
- `NODE_ENV=production`

**Frontend:**
- `VITE_API_URL` (if backend is on different domain)

Update `frontend/src/services/api.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

---

## Quick Deploy Commands

### Vercel CLI
```bash
npm i -g vercel
vercel
```

### Netlify CLI
```bash
npm i -g netlify-cli
netlify deploy
```

---

## Post-Deployment Checklist

- [ ] Test API endpoints (`/api/reviews/hostaway`)
- [ ] Test frontend loads correctly
- [ ] Verify reviews are displaying
- [ ] Check console for errors
- [ ] Test filtering and sorting
- [ ] Test review selection
- [ ] Verify property pages work

---

## Troubleshooting

### API not working
- Check CORS settings in backend
- Verify API routes are accessible
- Check browser console for errors

### Build fails
- Ensure all dependencies are in `package.json`
- Check Node.js version (18+)
- Review build logs for specific errors

### Frontend can't reach backend
- Update API URL in frontend
- Check CORS configuration
- Verify backend is running

---

## Support

For deployment issues, check:
- Platform-specific documentation
- Build logs in deployment dashboard
- Browser console for runtime errors

