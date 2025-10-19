import { useState, useEffect } from 'react';

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";
const STORAGE_KEY = 'related_products_history';

export function useRelatedProducts(currentBabyId, count = 6) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true);
        
        // Buscar todos os bebês "encomenda"
        const response = await fetch(`${API_BASE_URL}/babies`, {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        
        const allBabies = await response.json();
        const encomendaBabies = allBabies.filter(b => b.category === 'encomenda' && b.id !== currentBabyId);
        
        if (encomendaBabies.length === 0) {
          setRelatedProducts([]);
          return;
        }
        
        // Obter histórico do localStorage
        let history = [];
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          history = stored ? JSON.parse(stored) : [];
        } catch (e) {
          console.error('Erro ao ler histórico:', e);
        }
        
        // Filtrar bebês que não estão no histórico recente
        let availableBabies = encomendaBabies.filter(b => !history.includes(b.id));
        
        // Se não houver bebês disponíveis suficientes, resetar histórico
        if (availableBabies.length < count) {
          history = [];
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          availableBabies = encomendaBabies;
        }
        
        // Selecionar bebês aleatórios
        const shuffled = [...availableBabies].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        
        // Atualizar histórico
        const newHistory = [...history, ...selected.map(b => b.id)];
        // Manter apenas os últimos 20 IDs no histórico
        const trimmedHistory = newHistory.slice(-20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
        
        setRelatedProducts(selected);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produtos relacionados:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (currentBabyId) {
      fetchRelatedProducts();
    }
  }, [currentBabyId, count]);

  return { relatedProducts, loading, error };
}
