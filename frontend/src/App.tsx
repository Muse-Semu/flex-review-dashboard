import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useReviewStore } from './store/reviewStore';
import { fetchHostawayReviews } from './services/api';
import Dashboard from './pages/Dashboard';
import PropertyPage from './pages/PropertyPage';
import Layout from './components/Layout';

function App() {
  const { setReviews, setLoading, setError } = useReviewStore();

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const reviews = await fetchHostawayReviews();
        setReviews(reviews);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load reviews');
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [setReviews, setLoading, setError]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/property/:propertyId" element={<PropertyPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

