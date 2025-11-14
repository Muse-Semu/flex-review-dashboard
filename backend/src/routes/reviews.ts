import { Router } from 'express';
import { getHostawayReviews } from '../services/reviewService.js';
import { normalizeReviews } from '../utils/normalizeReviews.js';

const router = Router();

router.get('/hostaway', async (req, res) => {
  try {
    const reviews = await getHostawayReviews();
    const normalized = normalizeReviews(reviews);
    
    res.json({
      status: 'success',
      count: normalized.length,
      reviews: normalized
    });
  } catch (error) {
    console.error('Error fetching Hostaway reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/hostaway/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
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
});

export default router;

