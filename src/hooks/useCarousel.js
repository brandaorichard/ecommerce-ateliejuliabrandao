import { useEffect, useState, useCallback, useRef } from 'react';

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
      
      const response = await fetch('https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel', { 
        signal: ctrl.signal 
      });
      
      if (!response.ok) {
        throw new Error('Falha ao carregar itens do carrossel');
      }

      const data = await response.json();
      
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
        
        // Em caso de erro, usar imagens estáticas como fallback
        setCarouselItems([
          {
            _id: 'fallback-1',
            title: 'Bebês Reborn Artesanais',
            description: 'Descubra nossa coleção exclusiva de bebês reborn feitos à mão com amor e cuidado.',
            images: ['/src/assets/hero1.jpeg'],
            link: '/categoria1',
            linkText: 'Ver Coleção',
            order: 1,
            isActive: true
          },
          {
            _id: 'fallback-2', 
            title: 'Qualidade Premium',
            description: 'Cada bebê é único, feito com materiais de alta qualidade e atenção aos detalhes.',
            images: ['/src/assets/hero2.jpeg'],
            link: '/categoria2',
            linkText: 'Saiba Mais',
            order: 2,
            isActive: true
          },
          {
            _id: 'fallback-3',
            title: 'Encomendas Personalizadas',
            description: 'Trabalhamos com encomendas especiais para criar o bebê dos seus sonhos.',
            images: ['/src/assets/hero3.jpeg'],
            link: '/categoria3',
            linkText: 'Fazer Encomenda',
            order: 3,
            isActive: true
          }
        ]);
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
