# Flex Living Reviews Dashboard - Technical Documentation

## Overview

This document provides detailed technical information about the Reviews Dashboard implementation, including architecture decisions, API behaviors, and design rationale.

## Architecture

### Frontend Architecture

The frontend follows a component-based architecture with clear separation of concerns:

- **Pages**: Top-level route components (`Dashboard`, `PropertyPage`)
- **Components**: Reusable UI components (`ReviewList`, `ReviewFilters`, charts)
- **Store**: Zustand store for global state management
- **Services**: API communication layer

### Backend Architecture

Simple Express.js API with:
- **Routes**: RESTful endpoints for reviews
- **Services**: Business logic for data fetching
- **Utils**: Data transformation and normalization

## Data Flow

```
Hostaway API (Mocked) 
  → Backend Service (reviewService.ts)
  → Normalization (normalizeReviews.ts)
  → API Route (/api/reviews/hostaway)
  → Frontend Service (api.ts)
  → Zustand Store (reviewStore.ts)
  → React Components
```

## Normalization Logic

### Input Format (Hostaway)
```typescript
{
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{category: string; rating: number}>;
  submittedAt: string;
  guestName: string;
  listingName: string;
}
```

### Output Format (Normalized)
```typescript
{
  id: number;
  propertyId: string;              // Generated from listingName
  propertyName: string;            // Original listingName
  type: string;
  status: string;
  rating: number | null;
  averageCategoryRating: number;  // Computed from categories
  publicReview: string;
  reviewCategories: Array<...>;
  submittedAt: string;
  guestName: string;
  channel: 'hostaway';
  selectedForWebsite: boolean;     // Default: false
  date: Date;                      // Parsed from submittedAt
}
```

### Key Transformations

1. **Property ID Generation**
   - Convert listing name to URL-friendly slug
   - Example: "2B N1 A - 29 Shoreditch Heights" → "2b-n1-a-29-shoreditch-heights"

2. **Average Rating Calculation**
   - If `rating` exists, use it
   - Otherwise, calculate average from `reviewCategory` ratings
   - Round to 1 decimal place

3. **Date Parsing**
   - Convert `submittedAt` string to Date object
   - Handle timezone correctly

4. **Default Values**
   - `selectedForWebsite`: false (managers must explicitly select)
   - `channel`: 'hostaway' (extensible for future channels)

## API Behaviors

### GET /api/reviews/hostaway

**Purpose**: Fetch all normalized reviews

**Process**:
1. Read mock data from `backend/data/hostaway-reviews.json`
2. Validate response structure
3. Normalize each review
4. Return structured response

**Error Handling**:
- File not found → 500 with descriptive message
- Invalid JSON → 500 with parse error
- Missing data → Returns empty array

**Response Format**:
```json
{
  "status": "success",
  "count": 10,
  "reviews": [...]
}
```

### GET /api/reviews/hostaway/:propertyId

**Purpose**: Fetch reviews for specific property

**Process**:
1. Fetch all reviews
2. Filter by `propertyId`
3. Return filtered results

**Error Handling**:
- Invalid propertyId → Returns empty array (not an error)
- Same error handling as main endpoint

## State Management

### Zustand Store Structure

```typescript
{
  reviews: NormalizedReview[];      // All reviews
  filters: ReviewFilters;            // Current filter state
  loading: boolean;                  // Loading state
  error: string | null;              // Error message
  
  // Actions
  setReviews, setLoading, setError
  updateFilter, resetFilters
  toggleReviewSelection
  selectAllReviews, deselectAllReviews
  
  // Computed
  filteredReviews()                  // Apply filters
  selectedReviews()                  // Selected for website
  properties()                       // Unique properties
  propertyStats(propertyId)          // Stats per property
}
```

### Persistence

- Reviews and selections persisted to localStorage
- Date objects serialized/deserialized correctly
- Automatic restoration on page load

## Filtering Logic

Filters are applied sequentially:

1. **Property**: Exact match on `propertyId`
2. **Rating**: Minimum threshold (uses `rating` or `averageCategoryRating`)
3. **Category**: Review must have matching category
4. **Channel**: Exact match on `channel`
5. **Date Range**: `date` must be within range
6. **Search**: Case-insensitive search in review text, guest name, property name

All filters are AND conditions (must all match).

## Dashboard Features

### Overview Tab

1. **Statistics Cards**
   - Total reviews count
   - Average rating (computed)
   - Selected for website count
   - Published count

2. **Charts**
   - **Rating Distribution**: Bar chart showing count per rating (1-10)
   - **Category Performance**: Horizontal bar chart of average ratings per category
   - **Review Trends**: Line chart showing review count and average rating over time

3. **Property Stats Table**
   - Per-property metrics
   - Quick links to property pages

### Reviews Tab

1. **Filter Panel**
   - All filter controls
   - Clear all button

2. **Review List**
   - Individual review cards
   - Selection toggle
   - Visual indicators for selected reviews
   - Category badges
   - Rating display

## Property Page Features

### Layout

- **Hero Section**: Property name, average rating, total reviews
- **Main Content**: Description, reviews section
- **Sidebar**: Property info, CTA

### Review Display

- Only shows reviews where `selectedForWebsite === true`
- Only shows reviews where `status === 'published'`
- Sorted by date (newest first)
- Full review details with categories

## Error Handling Strategy

### Frontend

1. **API Errors**
   - Try-catch in service layer
   - Error state in store
   - User-friendly error messages
   - Retry button

2. **Component Errors**
   - React Error Boundary
   - Graceful fallback UI
   - Error details in development

3. **Data Validation**
   - TypeScript types
   - Runtime checks for missing data
   - Default values for optional fields

### Backend

1. **File Operations**
   - Try-catch around file reads
   - Descriptive error messages
   - 500 status for server errors

2. **Data Validation**
   - Check response structure
   - Validate required fields
   - Handle null/undefined gracefully

3. **Route Errors**
   - 404 for unknown routes
   - 500 for server errors
   - JSON error responses

## Performance Considerations

1. **Memoization**
   - Computed values in Zustand store
   - React.useMemo for expensive calculations
   - Chart data computed once

2. **Lazy Loading**
   - Components loaded on demand
   - API calls only when needed

3. **Optimistic Updates**
   - Review selection updates immediately
   - Persisted to localStorage

## Extensibility

### Adding New Review Channels

1. Add channel to `channel` type
2. Create new service in `backend/src/services/`
3. Add route in `backend/src/routes/reviews.ts`
4. Update frontend API service
5. Channel filter will automatically include it

### Adding New Filters

1. Add to `ReviewFilters` interface
2. Add UI control in `ReviewFilters` component
3. Update `filteredReviews()` logic
4. Add to `defaultFilters`

### Adding New Chart Types

1. Create component in `components/`
2. Add to Dashboard overview tab
3. Use Recharts library
4. Follow existing chart patterns

## Google Reviews Integration Notes

### API Requirements

- **Google Cloud Project** with Places API enabled
- **API Key** with appropriate restrictions
- **Billing** enabled (free tier: $200/month credit)

### Implementation Steps (Not Implemented)

1. **Text Search API**
   ```
   GET https://maps.googleapis.com/maps/api/place/textsearch/json
   ?query={propertyName}
   &key={API_KEY}
   ```

2. **Place Details API**
   ```
   GET https://maps.googleapis.com/maps/api/place/details/json
   ?place_id={placeId}
   &fields=reviews
   &key={API_KEY}
   ```

3. **Normalization**
   - Map Google review format to NormalizedReview
   - Handle different rating scale (1-5 vs 1-10)
   - Extract relevant fields

### Challenges

- **Rate Limiting**: 1,000 requests/day free tier
- **Cost**: $0.017 per request after free tier
- **Deduplication**: Need to match reviews by guest/date
- **Caching**: Should cache Place IDs to reduce API calls
- **Error Handling**: Handle API quota exceeded, invalid keys, etc.

### Recommendation

Implement in phases:
1. Phase 1: Hostaway only (current)
2. Phase 2: Add Google Reviews with proper error handling
3. Phase 3: Add caching and deduplication
4. Phase 4: Add more channels (Airbnb, Booking.com, etc.)

## Testing Recommendations

### Unit Tests
- Normalization logic
- Filter functions
- Computed store values

### Integration Tests
- API endpoints
- Data flow from API to UI
- Filter application

### E2E Tests
- Review selection workflow
- Property page display
- Filter interactions

## Security Considerations

1. **API Keys**: Never expose in frontend code
2. **CORS**: Configured for development (restrict in production)
3. **Input Validation**: Validate all user inputs
4. **XSS Prevention**: React automatically escapes content
5. **Rate Limiting**: Implement for production API

## Future Enhancements

1. **Bulk Operations**: Select/deselect multiple reviews
2. **Export**: Export reviews to CSV/PDF
3. **Email Notifications**: Alert on new reviews
4. **Review Responses**: Manager responses to reviews
5. **Analytics**: More detailed insights and trends
6. **Search**: Full-text search across reviews
7. **Tags**: Custom tags for reviews
8. **Workflow**: Review approval workflow

---

**Last Updated**: 2024
**Version**: 1.0.0

