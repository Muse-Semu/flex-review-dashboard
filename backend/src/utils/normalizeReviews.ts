import { HostawayReview } from '../services/reviewService.js';

export interface NormalizedReview {
  id: number;
  propertyId: string;
  propertyName: string;
  type: string;
  status: string;
  rating: number | null;
  averageCategoryRating: number;
  publicReview: string;
  reviewCategories: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  channel: 'hostaway';
  selectedForWebsite: boolean;
  date: Date;
}

export function normalizeReviews(reviews: HostawayReview[]): NormalizedReview[] {
  if (!Array.isArray(reviews)) {
    console.warn('normalizeReviews received non-array input, returning empty array');
    return [];
  }

  return reviews
    .filter(review => {
      // Filter out invalid reviews
      if (!review || typeof review !== 'object') {
        console.warn('Skipping invalid review object');
        return false;
      }
      if (!review.id || !review.listingName) {
        console.warn('Skipping review with missing required fields:', review.id);
        return false;
      }
      return true;
    })
    .map(review => {
      try {
        // Generate propertyId from listing name (simplified)
        const propertyId = (review.listingName || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || `property-${review.id}`;
        
        // Calculate average category rating
        const categoryRatings = Array.isArray(review.reviewCategory) ? review.reviewCategory : [];
        const validCategoryRatings = categoryRatings.filter(cat => 
          cat && typeof cat.rating === 'number' && cat.rating >= 0 && cat.rating <= 10
        );
        
        const averageCategoryRating = validCategoryRatings.length > 0
          ? validCategoryRatings.reduce((sum, cat) => sum + cat.rating, 0) / validCategoryRatings.length
          : (review.rating && review.rating >= 0 && review.rating <= 10 ? review.rating : 0);
        
        // Parse date with validation
        let reviewDate: Date;
        if (review.submittedAt) {
          reviewDate = new Date(review.submittedAt);
          if (isNaN(reviewDate.getTime())) {
            console.warn(`Invalid date for review ${review.id}, using current date`);
            reviewDate = new Date();
          }
        } else {
          reviewDate = new Date();
        }
        
        return {
          id: review.id,
          propertyId,
          propertyName: review.listingName || 'Unknown Property',
          type: review.type || 'unknown',
          status: review.status || 'unknown',
          rating: (review.rating && review.rating >= 0 && review.rating <= 10) ? review.rating : null,
          averageCategoryRating: Math.round(averageCategoryRating * 10) / 10,
          publicReview: review.publicReview || '',
          reviewCategories: validCategoryRatings,
          submittedAt: review.submittedAt || new Date().toISOString(),
          guestName: review.guestName || 'Anonymous',
          channel: 'hostaway',
          selectedForWebsite: false, // Default to false, managers can select
          date: reviewDate
        };
      } catch (error) {
        console.error(`Error normalizing review ${review.id}:`, error);
        // Return a minimal valid review object
        return {
          id: review.id || 0,
          propertyId: `property-${review.id || 'unknown'}`,
          propertyName: review.listingName || 'Unknown Property',
          type: review.type || 'unknown',
          status: review.status || 'unknown',
          rating: null,
          averageCategoryRating: 0,
          publicReview: review.publicReview || '',
          reviewCategories: [],
          submittedAt: new Date().toISOString(),
          guestName: review.guestName || 'Anonymous',
          channel: 'hostaway',
          selectedForWebsite: false,
          date: new Date()
        };
      }
    });
}

