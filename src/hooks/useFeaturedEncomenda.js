import { useState, useEffect } from 'react';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

export const useFeaturedEncomenda = () => {
  const [featuredData, setFeaturedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      
      // Usar fetchWithRetry para lidar com 429 e cache
      const data = await fetchWithRetry(
        `${API_BASE_URL}/featured-encomenda`,
        {
          credentials: 'include'
        },
        3, // 3 tentativas
        true // usar cache
      );
      
      if (data.success && data.data) {
        // Aplicar o mesmo mapeamento que useBabies faz para garantir compatibilidade
        const mappedProducts = data.data.products?.map(b => {
          const normId = b.id ?? b._id ?? b.slug;
          return {
            ...b,
            id: normId,
            img: b.img || b.images?.[0] || "",
            price: typeof b.price === "string" ? Number(b.price) : b.price,
            oldPrice: typeof b.oldPrice === "string" ? Number(b.oldPrice) : b.oldPrice,
          };
        }) || [];
        
        setFeaturedData({
          ...data.data,
          products: mappedProducts
        });
      } else {
        setFeaturedData(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar featured encomenda:', err);
      setError(err.message || 'Erro ao carregar dados');
      setFeaturedData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  return {
    featuredData,  // { title, subtitle, description, products: [...] }
    loading,       // boolean
    error,         // string | null
    refetch: fetchFeaturedData
  };
};
