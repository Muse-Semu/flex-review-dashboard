import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NormalizedReview } from '../store/reviewStore';

interface RatingChartProps {
  reviews: NormalizedReview[];
}

export default function RatingChart({ reviews }: RatingChartProps) {
  const data = useMemo(() => {
    const ratingCounts: Record<number, number> = {};
    
    reviews.forEach((review) => {
      const rating = Math.round(review.rating || review.averageCategoryRating);
      if (rating > 0) {
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      }
    });

    return Array.from({ length: 10 }, (_, i) => {
      const rating = i + 1;
      return {
        rating: `${rating}`,
        count: ratingCounts[rating] || 0,
      };
    });
  }, [reviews]);

  const colors = data.map((d) => {
    const rating = parseInt(d.rating);
    if (rating >= 9) return '#10b981'; // green
    if (rating >= 7) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

