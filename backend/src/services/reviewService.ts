import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export async function getHostawayReviews(): Promise<HostawayReview[]> {
  try {
    const filePath = join(__dirname, '../../data/hostaway-reviews.json');
    const fileContent = await readFile(filePath, 'utf-8');
    
    if (!fileContent || fileContent.trim().length === 0) {
      throw new Error('Mock review data file is empty');
    }
    
    let data: HostawayResponse;
    try {
      data = JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error('Invalid JSON in mock review data file');
    }
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data structure in mock review file');
    }
    
    if (data.status !== 'success') {
      throw new Error('Invalid response status from mock data');
    }
    
    if (!Array.isArray(data.result)) {
      console.warn('Result is not an array, returning empty array');
      return [];
    }
    
    return data.result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        throw new Error('Mock review data file not found. Please ensure hostaway-reviews.json exists in backend/data/');
      }
      throw error;
    }
    throw new Error('Unknown error reading review data');
  }
}

