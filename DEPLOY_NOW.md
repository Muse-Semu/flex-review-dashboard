# Quick Deploy Instructions

## 🚀 Deploy to Vercel (Easiest - 5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**

### Step 3: Add Backend API Routes

After frontend is deployed, add API routes:

1. In Vercel dashboard, go to your project
2. Go to **Settings** → **Functions**
3. The `api/` folder will be automatically detected as serverless functions

### Step 4: Update API URL (if needed)

If API routes don't work, update `frontend/src/services/api.ts`:
```typescript
const API_BASE = 'https://your-project.vercel.app/api';
```

Or use environment variable in Vercel:
- Go to **Settings** → **Environment Variables**
- Add: `VITE_API_URL` = `https://your-project.vercel.app/api`

---

## 🎯 Alternative: Deploy to Render (Full Stack)

### Backend:
1. Go to https://render.com
2. **New** → **Web Service**
3. Connect GitHub repo
4. Settings:
   - **Name:** flex-reviews-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node

### Frontend:
1. **New** → **Static Site**
2. Connect same GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

---

## 📝 Post-Deployment

1. Test your app: `https://your-app.vercel.app`
2. Test API: `https://your-app.vercel.app/api/reviews/hostaway`
3. Share the URL with your team!

---

## ⚠️ Important Notes

- **Mock Data:** The app uses `backend/data/hostaway-reviews.json` - make sure this file is included in deployment
- **CORS:** Backend is configured to allow all origins in production
- **Environment:** No environment variables needed for basic deployment

---

## 🆘 Need Help?

Check the full deployment guide in `DEPLOYMENT.md` for detailed instructions and troubleshooting.

