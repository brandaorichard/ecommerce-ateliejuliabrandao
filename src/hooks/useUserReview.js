import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://atelie-juliabrandao-backend-production.up.railway.app/api';

/**
 * Hook para verificar se o usuário já avaliou um produto específico
 * @param {string} babyId - ID do produto
 * @param {string} orderId - ID do pedido (opcional, para validação adicional)
 * @param {string} token - Token de autenticação
 * @returns {object} { hasReviewed, review, loading, error }
 */
export function useUserReview(babyId, orderId = null, token = null) {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!babyId || !token) {
      setLoading(false);
      return;
    }

    const checkReview = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar avaliações do usuário para este produto
        const response = await axios.get(
          `${API_BASE_URL}/babies/${babyId}/reviews`,
          {
            params: { myReviews: true },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Verificar se há avaliação do usuário atual
        const userReviews = response.data?.data?.reviews || [];
        const userReview = userReviews.find(r => {
          // Se orderId foi fornecido, verificar se a avaliação é deste pedido
          if (orderId && r.orderId) {
            return r.orderId === orderId || r.orderId._id === orderId;
          }
          return true; // Se não há orderId, retornar primeira avaliação do usuário
        });

        if (userReview) {
          setHasReviewed(true);
          setReview(userReview);
        } else {
          setHasReviewed(false);
          setReview(null);
        }
      } catch (err) {
        // Se o endpoint não existir ou retornar erro, assumir que não foi avaliado
        // Isso permite que o sistema funcione mesmo se o backend não tiver essa funcionalidade ainda
        console.log('Não foi possível verificar avaliação:', err);
        setHasReviewed(false);
        setReview(null);
        setError(null); // Não tratar como erro crítico
      } finally {
        setLoading(false);
      }
    };

    checkReview();
  }, [babyId, orderId, token]);

  return { hasReviewed, review, loading, error };
}

