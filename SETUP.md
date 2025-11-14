# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Verify file structure:**
   - ✅ `backend/data/hostaway-reviews.json` exists
   - ✅ `backend/src/` contains server files
   - ✅ `frontend/src/` contains React components

3. **Start the application:**
   ```bash
   npm run dev
   ```

   This starts:
   - Backend on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

## First Time Setup

1. Open `http://localhost:3000` in your browser
2. The dashboard should load with mock reviews
3. Try filtering, selecting reviews, and viewing property pages

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `backend/data/hostaway-reviews.json` exists
- Check console for error messages

### Frontend won't connect
- Ensure backend is running first
- Check browser console for errors
- Verify proxy settings in `vite.config.ts`

### No reviews showing
- Check browser console for API errors
- Verify backend is returning data: `curl http://localhost:5000/api/reviews/hostaway`
- Check network tab in browser dev tools

### Build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm run install:all`
- Check TypeScript version compatibility
- Verify all dependencies are installed

## Testing the API

```bash
# Health check
curl http://localhost:5000/health

# Get all reviews
curl http://localhost:5000/api/reviews/hostaway

# Get specific property reviews
curl http://localhost:5000/api/reviews/hostaway/2b-n1-a-29-shoreditch-heights
```

## Development Tips

- Use browser DevTools to inspect API calls
- Check Zustand store in Redux DevTools (if installed)
- Review console logs for warnings/errors
- Hot reload should work for both frontend and backend changes

