import { useState, useEffect } from 'react';

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

export const useFeaturedEncomenda = () => {
  const [featuredData, setFeaturedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/featured-encomenda`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Aplicar o mesmo mapeamento que useBabies faz para garantir compatibilidade
        // Filtrar apenas produtos válidos (com nome, preço e imagem)
        const mappedProducts = data.data.products?.map(b => {
          const normId = b.id ?? b._id ?? b.slug;
          return {
            ...b,
            id: normId,
            img: b.img || b.images?.[0] || "",
            price: typeof b.price === "string" ? Number(b.price) : b.price,
            oldPrice: typeof b.oldPrice === "string" ? Number(b.oldPrice) : b.oldPrice,
          };
        }).filter(b => b.name && b.price && b.img) || [];
        
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
