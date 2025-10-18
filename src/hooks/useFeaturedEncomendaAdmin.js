import { useState, useEffect } from 'react';

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

export const useFeaturedEncomendaAdmin = () => {
  const [featuredData, setFeaturedData] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Função para fazer requisições autenticadas
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    return fetch(url, defaultOptions);
  };

  // Buscar configuração atual
  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setFeaturedData(data.data);
      } else {
        setFeaturedData(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar featured encomenda admin:', err);
      setError(err.message || 'Erro ao carregar dados');
      setFeaturedData(null);
    } finally {
      setLoading(false);
    }
  };

  // Buscar produtos disponíveis
  const fetchAvailableProducts = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/available-products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Mapear produtos para garantir compatibilidade
        const mappedProducts = data.data.map(b => {
          const normId = b.id ?? b._id ?? b.slug;
          return {
            ...b,
            id: normId,
            img: b.img || b.images?.[0] || "",
            price: typeof b.price === "string" ? Number(b.price) : b.price,
            oldPrice: typeof b.oldPrice === "string" ? Number(b.oldPrice) : b.oldPrice,
          };
        });
        setAvailableProducts(mappedProducts);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos disponíveis:', err);
    }
  };

  // Salvar configuração
  const saveConfiguration = async (config) => {
    try {
      setSaving(true);
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda`, {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeaturedData(data.data);
        setError(null);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Erro ao salvar');
      }
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
      setError(err.message || 'Erro ao salvar configuração');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  // Adicionar produto
  const addProduct = async (productId) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/products`, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeaturedData(data.data);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Erro ao adicionar produto');
      }
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      setError(err.message || 'Erro ao adicionar produto');
      return { success: false, error: err.message };
    }
  };

  // Remover produto
  const removeProduct = async (productId) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeaturedData(data.data);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Erro ao remover produto');
      }
    } catch (err) {
      console.error('Erro ao remover produto:', err);
      setError(err.message || 'Erro ao remover produto');
      return { success: false, error: err.message };
    }
  };

  // Reordenar produtos
  const reorderProducts = async (productIds) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/products/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ productIds }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeaturedData(data.data);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Erro ao reordenar produtos');
      }
    } catch (err) {
      console.error('Erro ao reordenar produtos:', err);
      setError(err.message || 'Erro ao reordenar produtos');
      return { success: false, error: err.message };
    }
  };

  // Toggle ativo/inativo
  const toggleActive = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/toggle`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeaturedData(data.data);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Erro ao alterar status');
      }
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      setError(err.message || 'Erro ao alterar status');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchFeaturedData();
    fetchAvailableProducts();
  }, []);

  return {
    featuredData,
    availableProducts,
    loading,
    error,
    saving,
    saveConfiguration,
    addProduct,
    removeProduct,
    reorderProducts,
    toggleActive,
    refetch: fetchFeaturedData,
    refetchAvailable: fetchAvailableProducts,
  };
};
