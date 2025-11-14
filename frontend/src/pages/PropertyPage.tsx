import { useParams, Link } from 'react-router-dom';
import { useReviewStore } from '../store/reviewStore';
import { format } from 'date-fns';
import { Star, ArrowLeft, Home, MapPin, Calendar, User } from 'lucide-react';
import { useMemo } from 'react';

export default function PropertyPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { reviews, properties } = useReviewStore();
  
  const property = useMemo(() => {
    return properties().find((p) => p.id === propertyId);
  }, [propertyId, properties]);

  const selectedReviews = useMemo(() => {
    if (!propertyId) return [];
    return reviews
      .filter((r) => r.propertyId === propertyId && r.selectedForWebsite && r.status === 'published')
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [propertyId, reviews]);

  const propertyStats = useMemo(() => {
    if (!propertyId) return null;
    const propertyReviews = reviews.filter((r) => r.propertyId === propertyId);
    const ratings = propertyReviews
      .map((r) => r.rating || r.averageCategoryRating)
      .filter((r): r is number => r !== null);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;
    
    return {
      total: propertyReviews.length,
      averageRating,
      selectedCount: selectedReviews.length,
    };
  }, [propertyId, reviews, selectedReviews]);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-flex-green to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-6 h-6" />
                <h1 className="text-4xl font-bold">{property.name}</h1>
              </div>
              
              {propertyStats && propertyStats.averageRating > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-6 h-6 fill-current" />
                    <span className="text-2xl font-bold">{propertyStats.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-white/80">
                    ({propertyStats.total} {propertyStats.total === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed">
                Experience flexible living at its finest. This property offers modern amenities, 
                convenient location, and exceptional comfort for your stay. Perfect for both short 
                and long-term stays.
              </p>
            </div>

            {/* Reviews Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                {propertyStats && (
                  <span className="text-gray-600">
                    {selectedReviews.length} {selectedReviews.length === 1 ? 'review' : 'reviews'} displayed
                  </span>
                )}
              </div>

              {selectedReviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No reviews available</p>
                  <p className="text-gray-400 text-sm">
                    Reviews will appear here once they are selected for display by the manager.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedReviews.map((review) => {
                    const rating = review.rating || review.averageCategoryRating;
                    const ratingColor = rating >= 9 
                      ? 'text-green-600' 
                      : rating >= 7 
                      ? 'text-yellow-600' 
                      : 'text-red-600';

                    return (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-5 h-5 text-gray-400" />
                              <span className="font-semibold text-gray-900">{review.guestName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{format(review.date, 'MMMM d, yyyy')}</span>
                            </div>
                          </div>
                          
                          {rating !== null && (
                            <div className={`flex items-center space-x-1 ${ratingColor}`}>
                              <Star className="w-5 h-5 fill-current" />
                              <span className="text-xl font-bold">{rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4">{review.publicReview}</p>

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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{property.name}</span>
                </div>
                {propertyStats && (
                  <>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Star className="w-5 h-5 text-gray-400" />
                      <span>Average Rating: {propertyStats.averageRating > 0 ? propertyStats.averageRating.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span className="text-gray-400">📊</span>
                      <span>Total Reviews: {propertyStats.total}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card bg-flex-green text-white">
              <h3 className="text-lg font-semibold mb-2">Interested in this property?</h3>
              <p className="text-white/90 text-sm mb-4">
                Contact us to learn more about availability and pricing.
              </p>
              <button className="w-full bg-white text-flex-green px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

