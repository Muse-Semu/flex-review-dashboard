import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface NormalizedReview {
  id: number;
  propertyId: string;
  propertyName: string;
  type: string;
  status: string;
  rating: number | null;
  averageCategoryRating: number;
  publicReview: string;
  reviewCategories: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  channel: string;
  selectedForWebsite: boolean;
  date: Date;
}

interface ReviewFilters {
  propertyId: string | null;
  rating: number | null;
  category: string | null;
  channel: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  searchQuery: string;
}

interface ReviewStore {
  reviews: NormalizedReview[];
  filters: ReviewFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  setReviews: (reviews: NormalizedReview[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilter: <K extends keyof ReviewFilters>(key: K, value: ReviewFilters[K]) => void;
  resetFilters: () => void;
  toggleReviewSelection: (reviewId: number) => void;
  selectAllReviews: () => void;
  deselectAllReviews: () => void;
  
  // Computed
  filteredReviews: () => NormalizedReview[];
  selectedReviews: () => NormalizedReview[];
  properties: () => Array<{ id: string; name: string }>;
  propertyStats: (propertyId: string) => {
    total: number;
    averageRating: number;
    selectedCount: number;
  };
}

const defaultFilters: ReviewFilters = {
  propertyId: null,
  rating: null,
  category: null,
  channel: null,
  dateFrom: null,
  dateTo: null,
  searchQuery: '',
};

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      filters: defaultFilters,
      loading: false,
      error: null,

      setReviews: (reviews) => set({ 
        reviews: reviews.map(r => {
          let date: Date;
          if (r.date instanceof Date) {
            date = r.date;
          } else if (typeof r.date === 'string') {
            date = new Date(r.date);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date for review ${r.id}, using current date`);
              date = new Date();
            }
          } else {
            date = new Date();
          }
          return {
            ...r,
            date
          };
        })
      }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: defaultFilters }),

      toggleReviewSelection: (reviewId) =>
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, selectedForWebsite: !review.selectedForWebsite }
              : review
          ),
        })),

      selectAllReviews: () =>
        set((state) => ({
          reviews: state.reviews.map((review) => ({
            ...review,
            selectedForWebsite: true,
          })),
        })),

      deselectAllReviews: () =>
        set((state) => ({
          reviews: state.reviews.map((review) => ({
            ...review,
            selectedForWebsite: false,
          })),
        })),

      filteredReviews: () => {
        const { reviews, filters } = get();
        return reviews.filter((review) => {
          if (filters.propertyId && review.propertyId !== filters.propertyId) return false;
          if (filters.rating && (review.rating || review.averageCategoryRating) < filters.rating) return false;
          if (filters.category && !review.reviewCategories.some(cat => cat.category === filters.category)) return false;
          if (filters.channel && review.channel !== filters.channel) return false;
          if (filters.dateFrom && review.date < filters.dateFrom) return false;
          if (filters.dateTo && review.date > filters.dateTo) return false;
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            if (
              !review.publicReview.toLowerCase().includes(query) &&
              !review.guestName.toLowerCase().includes(query) &&
              !review.propertyName.toLowerCase().includes(query)
            ) return false;
          }
          return true;
        });
      },

      selectedReviews: () => {
        const { reviews } = get();
        return reviews.filter((review) => review.selectedForWebsite);
      },

      properties: () => {
        const { reviews } = get();
        const unique = new Map<string, string>();
        reviews.forEach((review) => {
          if (!unique.has(review.propertyId)) {
            unique.set(review.propertyId, review.propertyName);
          }
        });
        return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
      },

      propertyStats: (propertyId) => {
        const { reviews } = get();
        const propertyReviews = reviews.filter((r) => r.propertyId === propertyId);
        const total = propertyReviews.length;
        const ratings = propertyReviews
          .map((r) => r.rating || r.averageCategoryRating)
          .filter((r): r is number => r !== null);
        const averageRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
        const selectedCount = propertyReviews.filter((r) => r.selectedForWebsite).length;
        return { total, averageRating, selectedCount };
      },
    }),
    {
      name: 'flex-reviews-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reviews: state.reviews.map((r) => {
          // Safely convert date to ISO string
          let dateStr: string;
          if (r.date instanceof Date) {
            dateStr = r.date.toISOString();
          } else if (typeof r.date === 'string') {
            dateStr = r.date;
          } else {
            dateStr = new Date().toISOString();
          }
          return {
            ...r,
            date: dateStr,
          };
        }),
        filters: {
          ...state.filters,
          dateFrom: state.filters.dateFrom instanceof Date 
            ? state.filters.dateFrom.toISOString() 
            : state.filters.dateFrom,
          dateTo: state.filters.dateTo instanceof Date 
            ? state.filters.dateTo.toISOString() 
            : state.filters.dateTo,
        },
      }),
      onRehydrateStorage: () => (state) => {
        // Restore dates when loading from storage
        if (state) {
          // Restore review dates
          if (state.reviews) {
            state.reviews = state.reviews.map((r: any) => {
              let date: Date;
              if (r.date instanceof Date) {
                date = r.date;
              } else if (typeof r.date === 'string') {
                date = new Date(r.date);
                if (isNaN(date.getTime())) {
                  date = new Date();
                }
              } else {
                date = new Date();
              }
              return {
                ...r,
                date,
              };
            });
          }
          
          // Restore filter dates
          if (state.filters) {
            if (state.filters.dateFrom && typeof state.filters.dateFrom === 'string') {
              state.filters.dateFrom = new Date(state.filters.dateFrom);
            }
            if (state.filters.dateTo && typeof state.filters.dateTo === 'string') {
              state.filters.dateTo = new Date(state.filters.dateTo);
            }
          }
        }
      },
    }
  )
);


