import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

export const useFeaturedEncomendaAdmin = () => {
  const token = useSelector(s => s.auth.token);
  const [featuredData, setFeaturedData] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Função para fazer requisições autenticadas
  const authFetch = async (url, options = {}) => {
    
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Mapear produtos do backend (babyId aninhado) para estrutura do frontend
        const mappedData = {
          ...data.data,
          products: data.data.products?.map(p => ({
            ...p.babyId, // Extrai dados do babyId
            _id: p._id, // ID do produto na lista (para remoção)
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            addedAt: p.addedAt
          })) || []
        };
        setFeaturedData(mappedData);
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
      // Buscar todos os bebês diretamente (sem filtros do backend)
      const allBabiesResponse = await authFetch(`${API_BASE_URL}/babies`);
      if (allBabiesResponse.ok) {
        const allBabiesData = await allBabiesResponse.json();
        
        // Filtrar apenas bebês da categoria "encomenda"
        const encomendaBabies = allBabiesData.filter(b => b.category === 'encomenda');
        
        // Mapear produtos para garantir compatibilidade
        const mappedProducts = encomendaBabies.map(b => {
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
        // Mapear produtos do backend para estrutura do frontend
        const mappedData = {
          ...data.data,
          products: data.data.products?.map(p => ({
            ...p.babyId,
            _id: p._id,
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            addedAt: p.addedAt
          })) || []
        };
        setFeaturedData(mappedData);
        setError(null);
        return { success: true, data: mappedData };
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
  const addProduct = async (babyId) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/products`, {
        method: 'POST',
        body: JSON.stringify({ babyId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || ''}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Mapear produtos do backend para estrutura do frontend
        const mappedData = {
          ...data.data,
          products: data.data.products?.map(p => ({
            ...p.babyId,
            _id: p._id,
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            addedAt: p.addedAt
          })) || []
        };
        setFeaturedData(mappedData);
        
        // Recarregar produtos disponíveis para atualizar a lista
        await fetchAvailableProducts();
        
        return { success: true, data: mappedData };
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
        // Mapear produtos do backend para estrutura do frontend
        const mappedData = {
          ...data.data,
          products: data.data.products?.map(p => ({
            ...p.babyId,
            _id: p._id,
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            addedAt: p.addedAt
          })) || []
        };
        setFeaturedData(mappedData);
        
        // Recarregar produtos disponíveis para atualizar as imagens
        await fetchAvailableProducts();
        
        return { success: true, data: mappedData };
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
  const reorderProducts = async (products) => {
    try {
      // Converter array de produtos para formato esperado pelo backend
      const productOrders = products.map((p, index) => ({
        productId: p._id, // ID do produto na lista
        displayOrder: index
      }));

      const response = await authFetch(`${API_BASE_URL}/admin/featured-encomenda/products/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ productOrders }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Mapear produtos do backend para estrutura do frontend
        const mappedData = {
          ...data.data,
          products: data.data.products?.map(p => ({
            ...p.babyId,
            _id: p._id,
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            addedAt: p.addedAt
          })) || []
        };
        setFeaturedData(mappedData);
        return { success: true, data: mappedData };
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
        // Mapear produtos do backend para estrutura do frontend
        const mappedData = {
          ...data.data,
          products: data.data.products?.map(p => ({
            ...p.babyId,
            _id: p._id,
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            addedAt: p.addedAt
          })) || []
        };
        setFeaturedData(mappedData);
        return { success: true, data: mappedData };
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
