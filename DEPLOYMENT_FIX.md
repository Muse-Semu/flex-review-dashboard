# Fix for Vercel API Routing Issue

## Problem
The API routes are returning HTML instead of JSON because Vercel is routing all requests to the frontend.

## Solution

I've updated the configuration. Here's what you need to do:

### 1. Push the updated files to GitHub
```bash
git add .
git commit -m "Fix Vercel API routing"
git push
```

### 2. Redeploy on Vercel
- Go to your Vercel dashboard
- Click on your project
- Go to "Deployments" tab
- Click "Redeploy" on the latest deployment
- Or push a new commit to trigger auto-deployment

### 3. Verify the fix
After redeployment, test:
- `https://your-app.vercel.app/api/reviews/hostaway` should return JSON
- `https://your-app.vercel.app/` should return the frontend

## Changes Made

1. **Simplified `vercel.json`**: Removed conflicting routes, let Vercel auto-detect API folder
2. **Fixed rewrite rules**: Only rewrite non-API routes to index.html
3. **Updated file paths**: Serverless functions now try multiple paths to find the data file
4. **Fixed propertyId handler**: Made it standalone instead of calling the main handler

## If Still Not Working

If the API still returns HTML after redeployment:

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for errors

2. **Verify File Structure**:
   - Make sure `backend/data/hostaway-reviews.json` exists
   - The file should be in your Git repository

3. **Alternative: Embed Data**:
   If the file path issue persists, we can embed the JSON data directly in the serverless functions.

4. **Check Build Logs**:
   - In Vercel Dashboard → Deployments → Click on deployment → View Build Logs
   - Look for any errors during build

## Quick Test

After redeployment, run this in your browser console or use curl:

```bash
curl https://your-app.vercel.app/api/reviews/hostaway
```

Should return JSON, not HTML.

