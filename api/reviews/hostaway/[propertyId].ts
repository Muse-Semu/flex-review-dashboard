import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../hostaway';

export default async function propertyHandler(
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

    // Call the main handler and filter results
    const mainHandler = handler as any;
    const result = await new Promise((resolve, reject) => {
      const mockRes = {
        json: (data: any) => {
          if (data.status === 'success' && Array.isArray(data.reviews)) {
            const filtered = data.reviews.filter((r: any) => r.propertyId === propertyId);
            resolve({
              status: 'success',
              count: filtered.length,
              reviews: filtered
            });
          } else {
            resolve(data);
          }
        },
        status: (code: number) => ({
          json: (data: any) => reject({ code, data })
        })
      } as any;
      
      mainHandler(req, mockRes).catch(reject);
    });

    res.json(result);
  } catch (error: any) {
    if (error.code) {
      return res.status(error.code).json(error.data);
    }
    console.error('Error fetching property reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch property reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

