import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BreadcrumbItensAdmin from '../../components/BreadcrumbItensAdmin';
import { useAnalytics } from '../../hooks/useAnalytics';
import OverviewCards from '../../components/admin/analytics/OverviewCards';
import PeriodSelector from '../../components/admin/analytics/PeriodSelector';
import DeviceChart from '../../components/admin/analytics/DeviceChart';
import TopPagesList from '../../components/admin/analytics/TopPagesList';
import RealTimeStats from '../../components/admin/analytics/RealTimeStats';

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getVisitorStats } = useAnalytics();

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getVisitorStats(period);
      setData(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  if (loading && !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <BreadcrumbItensAdmin
          items={[
            { label: "Admin", to: "/admin" },
            { label: "Analytics" }
          ]}
        />
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded w-20"></div>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <BreadcrumbItensAdmin
          items={[
            { label: "Admin", to: "/admin" },
            { label: "Analytics" }
          ]}
        />
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Admin", to: "/admin" },
          { label: "Analytics" }
        ]}
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
            📊 Dashboard Analytics
          </h1>
          <p className="text-sm text-gray-600">
            Acompanhe o desempenho do seu site em tempo real
          </p>
        </div>

        <PeriodSelector period={period} onPeriodChange={setPeriod} />

        <OverviewCards data={data?.overview} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceChart data={data?.deviceStats} />
          <TopPagesList data={data?.topPages} />
        </div>

        <RealTimeStats />
      </div>
    </motion.div>
  );
}
