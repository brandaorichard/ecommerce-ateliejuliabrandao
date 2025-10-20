import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://atelie-juliabrandao-backend-production.up.railway.app/api';

export const useReviews = (babyId, page = 1, limit = 10) => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/babies/${babyId}/reviews?page=${page}&limit=${limit}`
        );
        
        setReviews(response.data.data.reviews);
        setPagination(response.data.data.pagination);
        setAverageRating(response.data.data.averageRating);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    };

    if (babyId) {
      fetchReviews();
    }
  }, [babyId, page, limit]);

  return { reviews, pagination, averageRating, loading, error };
};

export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createReview = async (reviewData, token) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/reviews`,
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar avaliação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createReview, loading, error, success };
};

