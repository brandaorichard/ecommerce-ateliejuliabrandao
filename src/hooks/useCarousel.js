import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchWithRetry } from '../utils/fetchWithRetry';

export function useCarousel(options = {}) {
  const { enabled = true } = options;
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchCarouselItems = useCallback(async () => {
    if (!enabled) return;
    
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    
    try {
      setLoading(true);
      setError(null);
      
      // Usar fetchWithRetry ao invés de fetch direto
      const data = await fetchWithRetry(
        'https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel',
        {
          signal: ctrl.signal,
          credentials: 'include'
        },
        1, // Apenas 1 retry (2 tentativas total)
        true // usar cache
      );
      
      if (data.success && data.data) {
        // Filtrar apenas itens ativos (se o campo existir) e ordenar por ordem
        const activeItems = data.data
          .filter(item => item.isActive !== false) // Se não existir isActive, assume true
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        
        setCarouselItems(activeItems);
      } else {
        throw new Error('Dados inválidos recebidos do servidor');
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        
        // Em caso de erro, não usar fallback - deixar vazio para mostrar apenas imagens do admin
        setCarouselItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchCarouselItems();
    return () => controllerRef.current?.abort();
  }, [fetchCarouselItems]);

  return { carouselItems, loading, error, refetch: fetchCarouselItems };
}
