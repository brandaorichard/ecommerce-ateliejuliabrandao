import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../hooks/useAnalytics';
import OverviewCards from '../../components/admin/analytics/OverviewCards';

export default function AdminHeroPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getVisitorStats } = useAnalytics();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await getVisitorStats('day');
        setAnalyticsData(result.data);
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-light tracking-wide">Painel Administrativo</h1>
        <p className="text-sm text-neutral-600 mt-2">
          Bem-vindo. Selecione uma área no menu: produtos, pedidos, usuários, carrossel ou analytics.
        </p>
      </section>

      {/* Analytics Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f7f3fa] border border-[#e0d6f7] rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📊 Resumo de Hoje</h2>
          <a
            href="/admin/analytics"
            className="text-sm text-[#7a4fcf] hover:text-[#ae95d9] font-medium"
          >
            Ver detalhes →
          </a>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-white border border-[#e0d6f7] rounded-lg p-4 h-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <OverviewCards data={analyticsData?.overview} />
        )}
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Produtos</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie o catálogo (bebês) por categoria.</p>
          <a
            href="/admin/produtos"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Pedidos</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie o catálogo (pedidos) por categoria.</p>
          <a
            href="/admin/pedidos"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Usuários</h2>
          <p className="text-xs text-neutral-600 mb-3">Visualize dados completos dos usuários.</p>
          <a
            href="/admin/usuarios"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-[#f7f3fa] border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Carrossel</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie os slides da página inicial.</p>
          <a
            href="/admin/carrossel"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Analytics</h2>
          <p className="text-xs text-neutral-600 mb-3">Visualize estatísticas e métricas do site.</p>
          <a
            href="/admin/analytics"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
      </div>
    </div>
  );
}