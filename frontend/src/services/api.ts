import { NormalizedReview } from '../store/reviewStore';

const API_BASE = '/api';

export async function fetchHostawayReviews(): Promise<NormalizedReview[]> {
  try {
    const response = await fetch(`${API_BASE}/reviews/hostaway`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default message
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.error || 'Failed to fetch reviews');
    }
    
    if (!Array.isArray(data.reviews)) {
      throw new Error('Invalid response format: reviews is not an array');
    }
    
    // Convert date strings back to Date objects with validation
    return data.reviews.map((review: any) => {
      const date = review.submittedAt ? new Date(review.submittedAt) : new Date();
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date for review ${review.id}, using current date`);
      }
      return {
        ...review,
        date: isNaN(date.getTime()) ? new Date() : date,
      };
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export async function fetchPropertyReviews(propertyId: string): Promise<NormalizedReview[]> {
  if (!propertyId || typeof propertyId !== 'string') {
    throw new Error('Invalid property ID');
  }

  try {
    const response = await fetch(`${API_BASE}/reviews/hostaway/${encodeURIComponent(propertyId)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default message
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.error || 'Failed to fetch property reviews');
    }
    
    if (!Array.isArray(data.reviews)) {
      return []; // Return empty array if invalid format
    }
    
    return data.reviews.map((review: any) => {
      const date = review.submittedAt ? new Date(review.submittedAt) : new Date();
      return {
        ...review,
        date: isNaN(date.getTime()) ? new Date() : date,
      };
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    console.error('Error fetching property reviews:', error);
    throw error;
  }
}

