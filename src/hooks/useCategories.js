import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWithRetry } from '../utils/fetchWithRetry';

export function useCategories(options = {}) {
  const { enabled = true } = options;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchCategories = useCallback(async () => {
    if (!enabled) return;
    
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWithRetry(
        'https://atelie-juliabrandao-backend-production.up.railway.app/api/categories',
        {
          signal: ctrl.signal,
          credentials: 'include'
        },
        1,
        true
      );
      
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        throw new Error('Dados inválidos');
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        
        // Fallback para categorias padrão
        setCategories([
          {
            categoryNumber: 1,
            title: "Sob Encomenda",
            route: "/categoria1",
            imageUrl: null,
            isActive: true
          },
          {
            categoryNumber: 2,
            title: "A Pronta Entrega",
            route: "/categoria2",
            imageUrl: null,
            isActive: true
          },
          {
            categoryNumber: 3,
            title: "Por Semelhança",
            route: "/categoria3",
            imageUrl: null,
            isActive: true
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchCategories();
    return () => controllerRef.current?.abort();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}
