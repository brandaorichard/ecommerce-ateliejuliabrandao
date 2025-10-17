import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../../hooks/useAnalytics';

export default function RealTimeStats() {
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getRealTimeStats } = useAnalytics();

  const fetchRealTime = async () => {
    try {
      setLoading(true);
      const result = await getRealTimeStats();
      setRealTimeData(result.data);
    } catch (error) {
      console.error('Erro ao buscar dados em tempo real:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTime();
    const interval = setInterval(fetchRealTime, 30000); // Atualizar a cada 30s

    return () => clearInterval(interval);
  }, []);

  if (loading && !realTimeData) {
    return (
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⏰ Tempo Real</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!realTimeData) {
    return (
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⏰ Tempo Real</h3>
        <p className="text-gray-500">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⏰ Tempo Real</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Visitantes ativos na última hora:</span>
          <span className="font-bold text-[#7a4fcf] text-lg">
            {realTimeData.activeVisitors}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Última atualização:</span>
          <span className="text-sm text-gray-500">
            {new Date(realTimeData.lastUpdated).toLocaleString('pt-BR')}
          </span>
        </div>
        
        {realTimeData.topPages && realTimeData.topPages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Páginas ativas agora:</h4>
            <div className="space-y-1">
              {realTimeData.topPages.slice(0, 3).map((page, index) => (
                <div key={page._id} className="flex justify-between text-xs">
                  <span className="font-mono text-gray-600 truncate">{page._id}</span>
                  <span className="text-[#7a4fcf]">{page.views} views</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
