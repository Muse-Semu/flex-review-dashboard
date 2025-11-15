import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
}

interface HostawayResponse {
  status: string;
  result: HostawayReview[];
}

interface NormalizedReview {
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
  channel: string;
  selectedForWebsite: boolean;
  date: Date;
}

async function getHostawayReviews(): Promise<HostawayReview[]> {
  try {
    const possiblePaths = [
      join(process.cwd(), 'backend/data/hostaway-reviews.json'),
      join(process.cwd(), '../../backend/data/hostaway-reviews.json'),
      join(__dirname, '../../backend/data/hostaway-reviews.json'),
    ];
    
    let fileContent = '';
    for (const filePath of possiblePaths) {
      try {
        fileContent = await readFile(filePath, 'utf-8');
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!fileContent) {
      throw new Error('Could not find hostaway-reviews.json file');
    }
    
    const data: HostawayResponse = JSON.parse(fileContent);
    
    if (data.status !== 'success' || !Array.isArray(data.result)) {
      return [];
    }
    
    return data.result;
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

function normalizeReviews(reviews: HostawayReview[]): NormalizedReview[] {
  if (!Array.isArray(reviews)) return [];

  return reviews
    .filter(review => review && review.id && review.listingName)
    .map(review => {
      const propertyId = (review.listingName || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `property-${review.id}`;
      
      const categoryRatings = Array.isArray(review.reviewCategory) ? review.reviewCategory : [];
      const validCategoryRatings = categoryRatings.filter(cat => 
        cat && typeof cat.rating === 'number' && cat.rating >= 0 && cat.rating <= 10
      );
      
      const averageCategoryRating = validCategoryRatings.length > 0
        ? validCategoryRatings.reduce((sum, cat) => sum + cat.rating, 0) / validCategoryRatings.length
        : (review.rating && review.rating >= 0 && review.rating <= 10 ? review.rating : 0);
      
      let reviewDate: Date;
      if (review.submittedAt) {
        reviewDate = new Date(review.submittedAt);
        if (isNaN(reviewDate.getTime())) {
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
        selectedForWebsite: false,
        date: reviewDate
      };
    });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { propertyId } = req.query;
    
    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const reviews = await getHostawayReviews();
    const normalized = normalizeReviews(reviews);
    const filtered = normalized.filter(r => r.propertyId === propertyId);
    
    res.json({
      status: 'success',
      count: filtered.length,
      reviews: filtered
    });
  } catch (error) {
    console.error('Error fetching property reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch property reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

