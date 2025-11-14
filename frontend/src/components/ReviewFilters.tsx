import { useReviewStore } from '../store/reviewStore';
import { Search, X } from 'lucide-react';

export default function ReviewFilters() {
  const { filters, properties, updateFilter } = useReviewStore();
  const propertyList = properties();

  const categories = [
    'cleanliness',
    'communication',
    'location',
    'value',
    'amenities',
    'respect_house_rules',
  ];

  const channels = ['hostaway'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Search */}
      <div className="lg:col-span-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews, guests, or properties..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="input-field pl-10"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Property Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property
        </label>
        <select
          value={filters.propertyId || ''}
          onChange={(e) => updateFilter('propertyId', e.target.value || null)}
          className="input-field"
        >
          <option value="">All Properties</option>
          {propertyList.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating
        </label>
        <select
          value={filters.rating || ''}
          onChange={(e) => updateFilter('rating', e.target.value ? Number(e.target.value) : null)}
          className="input-field"
        >
          <option value="">All Ratings</option>
          <option value="9">9+ (Excellent)</option>
          <option value="8">8+ (Very Good)</option>
          <option value="7">7+ (Good)</option>
          <option value="6">6+ (Fair)</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value || null)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Channel Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel
        </label>
        <select
          value={filters.channel || ''}
          onChange={(e) => updateFilter('channel', e.target.value || null)}
          className="input-field"
        >
          <option value="">All Channels</option>
          {channels.map((channel) => (
            <option key={channel} value={channel}>
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Date From */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Date
        </label>
        <input
          type="date"
          value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value ? new Date(e.target.value) : null)}
          className="input-field"
        />
      </div>

      {/* Date To */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          To Date
        </label>
        <input
          type="date"
          value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
          onChange={(e) => updateFilter('dateTo', e.target.value ? new Date(e.target.value) : null)}
          className="input-field"
        />
      </div>
    </div>
  );
}

