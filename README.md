# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, featuring a manager dashboard and public-facing property pages.

## 🚀 Features

- **Manager Dashboard**
  - View all reviews across properties
  - Filter by property, rating, category, channel, and date range
  - Visual analytics with charts (rating distribution, category performance, trends)
  - Select reviews for public display
  - Property performance statistics

- **Public Property Pages**
  - Clean, modern property detail pages
  - Display only manager-selected reviews
  - Responsive design matching Flex Living brand

- **Hostaway Integration**
  - Mocked API integration
  - Normalized review data structure
  - Support for review categories and ratings

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Zustand** for state management
- **React Router** for navigation
- **Lucide React** for icons
- **date-fns** for date formatting

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **CORS** enabled for cross-origin requests

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:3000`

3. **Or run separately:**
   ```bash
   # Backend only
   npm run dev:backend

   # Frontend only
   npm run dev:frontend
   ```

## 📁 Project Structure

```
Flex/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── reviews.ts      # API routes
│   │   ├── services/
│   │   │   └── reviewService.ts # Data fetching
│   │   ├── utils/
│   │   │   └── normalizeReviews.ts # Data normalization
│   │   └── server.ts           # Express server
│   ├── data/
│   │   └── hostaway-reviews.json # Mock review data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand store
│   │   ├── services/          # API services
│   │   └── App.tsx
│   └── package.json
└── package.json
```

## 🔌 API Endpoints

### `GET /api/reviews/hostaway`
Fetches all Hostaway reviews (normalized).

**Response:**
```json
{
  "status": "success",
  "count": 10,
  "reviews": [
    {
      "id": 7453,
      "propertyId": "2b-n1-a-29-shoreditch-heights",
      "propertyName": "2B N1 A - 29 Shoreditch Heights",
      "type": "guest-to-host",
      "status": "published",
      "rating": 9,
      "averageCategoryRating": 9.0,
      "publicReview": "...",
      "reviewCategories": [...],
      "submittedAt": "2023-10-15 14:30:00",
      "guestName": "Emma Thompson",
      "channel": "hostaway",
      "selectedForWebsite": false,
      "date": "2023-10-15T14:30:00.000Z"
    }
  ]
}
```

### `GET /api/reviews/hostaway/:propertyId`
Fetches reviews for a specific property.

## 🎨 Key Design Decisions

### 1. Data Normalization
- Flattened review structure for easier filtering
- Generated `propertyId` from listing names
- Computed `averageCategoryRating` when main rating is missing
- Consistent date handling

### 2. State Management
- Zustand with persistence for review selection
- Computed values for filtered reviews and statistics
- Optimized re-renders with memoization

### 3. UI/UX
- Clean, modern design with Flex Living green accent color
- Responsive grid layouts
- Clear visual hierarchy
- Intuitive filtering and sorting
- Error boundaries for graceful error handling

### 4. Review Selection
- Managers can toggle reviews for public display
- Selection persisted in localStorage
- Only selected reviews appear on property pages

## 🔍 Google Reviews Integration (Exploration)

### Feasibility
Google Reviews can be integrated via the **Google Places API**:

1. **Place ID Lookup**: Use property name/address to find Google Place ID
2. **Reviews Endpoint**: Fetch reviews using Place ID
3. **Rate Limits**: Free tier allows 1,000 requests/day
4. **Cost**: $0.017 per request after free tier

### Implementation Flow
```
Property Name → Places API (Text Search) → Place ID → 
Places API (Place Details) → Reviews Array → Normalize → Store
```

### Not Implemented
- Focus on Hostaway mock data for assessment
- Would require Google API key and billing setup
- Additional error handling for API limits
- Review deduplication logic

### Recommendation
- Start with Hostaway integration (current)
- Add Google Reviews as phase 2 with proper API key management
- Consider caching to reduce API calls
- Implement review deduplication by guest name/date

## 🐛 Error Handling

- **API Errors**: Graceful error messages with retry options
- **Network Errors**: User-friendly notifications
- **Data Validation**: Type-safe data handling
- **Error Boundaries**: React error boundaries for component errors
- **Loading States**: Clear loading indicators

## 🧪 Testing the API

```bash
# Health check
curl http://localhost:5000/health

# Get all reviews
curl http://localhost:5000/api/reviews/hostaway

# Get property reviews
curl http://localhost:5000/api/reviews/hostaway/2b-n1-a-29-shoreditch-heights
```

## 📝 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
```

## 🚢 Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## 📄 License

Internal use for Flex Living.

---

**Built with ❤️ for Flex Living**

