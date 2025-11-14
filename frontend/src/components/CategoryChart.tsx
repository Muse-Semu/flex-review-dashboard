import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NormalizedReview } from '../store/reviewStore';

interface CategoryChartProps {
  reviews: NormalizedReview[];
}

export default function CategoryChart({ reviews }: CategoryChartProps) {
  const data = useMemo(() => {
    const categoryRatings: Record<string, { total: number; count: number }> = {};

    reviews.forEach((review) => {
      review.reviewCategories.forEach((cat) => {
        if (!categoryRatings[cat.category]) {
          categoryRatings[cat.category] = { total: 0, count: 0 };
        }
        categoryRatings[cat.category].total += cat.rating;
        categoryRatings[cat.category].count += 1;
      });
    });

    return Object.entries(categoryRatings)
      .map(([category, { total, count }]) => ({
        category: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        average: total / count,
      }))
      .sort((a, b) => b.average - a.average);
  }, [reviews]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 10]} />
        <YAxis dataKey="category" type="category" width={120} />
        <Tooltip />
        <Bar dataKey="average" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => {
            const color = entry.average >= 9 ? '#10b981' : entry.average >= 7 ? '#f59e0b' : '#ef4444';
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

