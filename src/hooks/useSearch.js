import { useState, useEffect, useCallback } from 'react';
import { normalizeString } from '../utils/stringUtils';

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allBabies, setAllBabies] = useState([]);
  const [error, setError] = useState(null);
  
  // Carregar todos os bebês uma vez
  useEffect(() => {
    async function fetchBabies() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/babies`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Erro ao buscar bebês');
        }
        
        const data = await response.json();
        
        // Mapear e normalizar dados dos bebês
        const mappedBabies = data.map(baby => {
          const normId = baby.id ?? baby._id ?? baby.slug;
          return {
            ...baby,
            id: normId,
            img: baby.img || baby.images?.[0] || "",
            price: typeof baby.price === "string" ? Number(baby.price) : baby.price,
            oldPrice: typeof baby.oldPrice === "string" ? Number(baby.oldPrice) : baby.oldPrice,
            normalizedName: normalizeString(baby.name || '')
          };
        });
        
        setAllBabies(mappedBabies);
      } catch (err) {
        console.error('Erro ao carregar bebês para pesquisa:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBabies();
  }, []);
  
  // Debounce e filtro
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      const normalizedSearchTerm = normalizeString(searchTerm);
      
      if (normalizedSearchTerm.length < 2) {
        setResults([]);
        return;
      }
      
      const filtered = allBabies.filter(baby => {
        // Buscar no nome do bebê
        const nameMatch = baby.normalizedName.includes(normalizedSearchTerm);
        
        // Buscar também na categoria (opcional)
        const categoryMatch = normalizeString(baby.category || '').includes(normalizedSearchTerm);
        
        return nameMatch || categoryMatch;
      })
      // Ordenar por relevância (nome primeiro, depois categoria)
      .sort((a, b) => {
        const aNameMatch = a.normalizedName.includes(normalizedSearchTerm);
        const bNameMatch = b.normalizedName.includes(normalizedSearchTerm);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      })
      .slice(0, 8); // Limitar a 8 resultados
      
      setResults(filtered);
    }, 300); // Debounce de 300ms
    
    return () => clearTimeout(timer);
  }, [searchTerm, allBabies]);
  
  // Função para limpar pesquisa
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
  }, []);
  
  return { 
    searchTerm, 
    setSearchTerm, 
    results, 
    loading, 
    error, 
    clearSearch,
    hasResults: results.length > 0,
    isSearching: searchTerm.length > 0
  };
}
