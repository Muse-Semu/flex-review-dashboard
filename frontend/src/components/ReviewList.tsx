import { useReviewStore, NormalizedReview } from '../store/reviewStore';
import { format } from 'date-fns';
import { Star, CheckCircle2, Circle, Globe, User, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewListProps {
  reviews: NormalizedReview[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const { toggleReviewSelection } = useReviewStore();

  if (reviews.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">No reviews match your filters</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const rating = review.rating || review.averageCategoryRating;
        const ratingColor = rating >= 9 ? 'text-green-600' : rating >= 7 ? 'text-yellow-600' : 'text-red-600';

        return (
          <div
            key={review.id}
            className={`card border-l-4 ${
              review.selectedForWebsite ? 'border-flex-green bg-green-50' : 'border-gray-200'
            } hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <button
                    onClick={() => toggleReviewSelection(review.id)}
                    className={`flex-shrink-0 ${
                      review.selectedForWebsite ? 'text-flex-green' : 'text-gray-300'
                    } hover:text-flex-green transition-colors`}
                    title={review.selectedForWebsite ? 'Selected for website' : 'Click to select for website'}
                  >
                    {review.selectedForWebsite ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{review.guestName}</span>
                      {review.selectedForWebsite && (
                        <span className="px-2 py-0.5 bg-flex-green text-white text-xs rounded-full flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>Public</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <Link
                          to={`/property/${review.propertyId}`}
                          className="hover:text-flex-green transition-colors"
                        >
                          {review.propertyName}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(review.date, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  {rating !== null && (
                    <div className={`flex items-center space-x-1 ${ratingColor}`}>
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-xl font-bold">{rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-3 leading-relaxed">{review.publicReview}</p>

                {review.reviewCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.reviewCategories.map((cat, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        <span className="font-medium">
                          {cat.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        </span>{' '}
                        <span className="font-semibold">{cat.rating}/10</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Type: {review.type.replace(/-/g, ' ')}</span>
                  <span>Channel: {review.channel}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    review.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

