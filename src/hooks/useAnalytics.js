import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { showToast } from '../redux/toastSlice';

const API_BASE = 'https://atelie-juliabrandao-backend-production.up.railway.app';

export function useAnalytics() {
  const token = useSelector(s => s.auth.token);
  const dispatch = useDispatch();

  const handleError = useCallback((error) => {
    if (error.response?.status === 401) {
      dispatch(logout());
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      dispatch(showToast({ message: 'Acesso restrito ao admin', iconType: 'error' }));
    } else {
      console.error('Erro na API:', error);
      dispatch(showToast({ message: 'Erro ao carregar dados de analytics', iconType: 'error' }));
    }
  }, [dispatch]);

  const getVisitorStats = useCallback(async (period = 'day', startDate = null, endDate = null) => {
    try {
      let url = `${API_BASE}/api/analytics/visitors?period=${period}`;
      
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [token, handleError]);

  const getConversionStats = useCallback(async (period = 'day') => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/conversions?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [token, handleError]);

  const getRealTimeStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/realtime`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [token, handleError]);

  return {
    getVisitorStats,
    getConversionStats,
    getRealTimeStats
  };
}
