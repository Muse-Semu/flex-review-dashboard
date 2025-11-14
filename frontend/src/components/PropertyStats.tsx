import { useReviewStore } from '../store/reviewStore';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';

export default function PropertyStats() {
  const { properties, propertyStats } = useReviewStore();
  const propertyList = properties();

  if (propertyList.length === 0) {
    return <p className="text-gray-500">No properties found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Reviews
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selected for Website
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {propertyList.map((property) => {
            const stats = propertyStats(property.id);
            const ratingColor = stats.averageRating >= 9 
              ? 'text-green-600' 
              : stats.averageRating >= 7 
              ? 'text-yellow-600' 
              : 'text-red-600';

            return (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{property.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stats.total}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {stats.averageRating > 0 ? (
                    <div className={`flex items-center space-x-1 ${ratingColor}`}>
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{stats.averageRating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{stats.selectedCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    to={`/property/${property.id}`}
                    className="text-flex-green hover:text-green-700 font-medium"
                  >
                    View Page →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

