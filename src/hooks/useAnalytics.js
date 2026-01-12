import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchGAMetrics, fetchTopPages } from '../services/analyticsService';

/**
 * Hook para buscar e gerenciar dados do Google Analytics
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.autoRefresh - Atualizar automaticamente (default: false)
 * @param {number} options.refreshInterval - Intervalo de atualização em ms (default: 60000 - 1 min)
 * @returns {Object} Estado e dados do Analytics
 */
export function useAnalytics({ autoRefresh = false, refreshInterval = 60000 } = {}) {
  const token = useSelector(s => s.auth.token);
  const [metrics, setMetrics] = useState(null);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Função para carregar dados
  const loadAnalyticsData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar métricas e top pages em paralelo
      const [metricsData, pagesData] = await Promise.all([
        fetchGAMetrics(token),
        fetchTopPages(token, 5)
      ]);

      setMetrics(metricsData);
      setTopPages(pagesData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Erro ao carregar dados do Analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados inicialmente
  useEffect(() => {
    loadAnalyticsData();
  }, [token]);

  // Auto refresh se habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAnalyticsData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, token]);

  // Função manual de refresh
  const refresh = () => {
    loadAnalyticsData();
  };

  return {
    metrics,
    topPages,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

/**
 * Hook simplificado que retorna apenas as métricas principais
 */
export function useAnalyticsMetrics() {
  const { metrics, loading, error } = useAnalytics();
  
  return {
    visitors: metrics?.visitors?.current || 0,
    visitorsChange: metrics?.visitors?.change || 0,
    sessions: metrics?.sessions?.current || 0,
    sessionsChange: metrics?.sessions?.change || 0,
    conversionRate: metrics?.conversionRate?.current || 0,
    conversionChange: metrics?.conversionRate?.change || 0,
    avgDuration: metrics?.avgSessionDuration?.current || 0,
    durationChange: metrics?.avgSessionDuration?.change || 0,
    loading,
    error
  };
}

/**
 * Hook para buscar apenas as top pages
 */
export function useTopPages(limit = 5) {
  const token = useSelector(s => s.auth.token);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchTopPages(token, limit);
        setPages(data);
      } catch (err) {
        console.error('Erro ao buscar top pages:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, limit]);

  return { pages, loading };
}
