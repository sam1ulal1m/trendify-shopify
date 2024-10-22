import { useState, useEffect } from 'react';

const useRecommendations = (productId, intent = 'related') => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/recommendations/products.json?product_id=${productId}&intent=${intent}`);
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId, intent]);

  return { recommendations, loading };
};

export default useRecommendations;