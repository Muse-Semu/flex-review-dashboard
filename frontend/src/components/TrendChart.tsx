import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfMonth, eachMonthOfInterval, min, max } from 'date-fns';
import { NormalizedReview } from '../store/reviewStore';

interface TrendChartProps {
  reviews: NormalizedReview[];
}

export default function TrendChart({ reviews }: TrendChartProps) {
  const data = useMemo(() => {
    if (reviews.length === 0) return [];

    const dates = reviews.map((r) => r.date);
    const minDate = min(dates);
    const maxDate = max(dates);
    const months = eachMonthOfInterval({ start: minDate, end: maxDate });

    const monthlyData = months.map((month) => {
      const monthReviews = reviews.filter(
        (r) => r.date >= month && r.date < startOfMonth(new Date(month.getTime() + 32 * 24 * 60 * 60 * 1000))
      );

      const ratings = monthReviews
        .map((r) => r.rating || r.averageCategoryRating)
        .filter((r): r is number => r !== null);

      return {
        month: format(month, 'MMM yyyy'),
        count: monthReviews.length,
        averageRating: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0,
      };
    });

    return monthlyData;
  }, [reviews]);

  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-8">No data available for trends</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Review Count"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="averageRating"
          stroke="#10b981"
          strokeWidth={2}
          name="Avg Rating"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

