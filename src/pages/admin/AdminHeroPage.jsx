import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { fetchOrdersAdmin } from '../../services/adminOrderService';
import { useBabies } from '../../hooks/useBabies';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatDuration, formatNumber } from '../../services/analyticsService';

export default function AdminHeroPage() {
  const token = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const { babies } = useBabies();
  
  // Hook do Google Analytics com auto-refresh a cada 1 minuto
  const { metrics, topPages, loading: analyticsLoading, lastUpdated } = useAnalytics({ 
    autoRefresh: true, 
    refreshInterval: 60000 
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const orders = await fetchOrdersAdmin(token);
        // Últimos 3 pedidos
        const recent = orders.slice(0, 3);
        setRecentOrders(recent);

        // Calcular estatísticas
        const pendingCount = orders.filter(o => o.paymentStatus === 'pagamento_pendente').length;
        const revenue = orders
          .filter(o => o.paymentStatus === 'pago')
          .reduce((sum, o) => sum + (o.total || 0), 0);

        setStats({
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          totalRevenue: revenue
        });
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
      setLoading(false);
    }
    if (token) loadData();
  }, [token]);

  const babiesBySlug = babies.reduce((acc, baby) => {
    acc[baby.slug] = baby;
    return acc;
  }, {});

  const getOrderThumbnail = (order) => {
    if (!order.items || order.items.length === 0) return null;
    const firstItem = order.items[0];
    const baby = babiesBySlug[firstItem.babySlug];
    return baby?.images?.[0] || null;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pago': 'bg-green-500',
      'pagamento_pendente': 'bg-yellow-500',
      'pagamento_rejeitado': 'bg-red-500',
      'cancelado': 'bg-gray-400'
    };
    return colors[status] || 'bg-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pago': 'Pago',
      'pagamento_pendente': 'Pendente',
      'pagamento_rejeitado': 'Rejeitado',
      'cancelado': 'Cancelado'
    };
    return labels[status] || 'Desconhecido';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Boas-vindas */}
      <section className="bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] rounded-xl p-5 sm:p-8 text-white shadow-lg">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide mb-2"
        >
          Bem-vindo, {user?.nome?.split(' ')[0] || 'Admin'}! 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base text-white/90"
        >
          Aqui está um resumo rápido do seu e-commerce
        </motion.p>
      </section>

      {/* Cards de Estatísticas Rápidas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-[#e0d6f7] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total de Pedidos</h3>
            <span className="text-xl sm:text-2xl">📦</span>
          </div>
          <p className="text-2xl sm:text-3xl font-light text-[#7a4fcf]">{stats.totalOrders}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-[#e0d6f7] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Pedidos Pendentes</h3>
            <span className="text-xl sm:text-2xl">⏳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-light text-orange-500">{stats.pendingOrders}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-[#e0d6f7] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Receita Total</h3>
            <span className="text-xl sm:text-2xl">💰</span>
          </div>
          <p className="text-2xl sm:text-3xl font-light text-green-600">
            R$ {stats.totalRevenue.toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Últimos Pedidos - Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-4 sm:p-6 border border-[#e0d6f7] shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-light text-gray-800">Últimos Pedidos</h2>
            <p className="text-xs sm:text-sm text-gray-500">Pedidos mais recentes do sistema</p>
          </div>
          <Link
            to="/admin/pedidos"
            className="px-3 py-2 sm:px-4 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap"
          >
            Ver Todos
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado</div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, idx) => {
              const thumbnail = getOrderThumbnail(order);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Pedido"
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7a4fcf] to-[#ae95d9] rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl flex-shrink-0">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                      Pedido #{order._id?.slice(-8)}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
                      {' • '}
                      R$ {order.total?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div 
                    className="relative group"
                    title={getStatusLabel(order.paymentStatus)}
                  >
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.paymentStatus)} ring-2 ring-white shadow-sm`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Google Analytics Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100 shadow-md"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                Google Analytics
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">Live</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">Métricas de desempenho em tempo real</p>
            </div>
          </div>
          <Link
            to="/admin/analytics"
            className="px-3 py-2 sm:px-4 bg-white hover:bg-gray-50 text-blue-600 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 flex items-center gap-2"
          >
            <span>Ver Painel</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Métricas em Grid */}
        {analyticsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600"></div>
              <p className="mt-2 text-xs text-gray-600">Carregando Analytics...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Visitantes</span>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatNumber(metrics?.visitors?.current || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <svg className={`w-3 h-3 ${(metrics?.visitors?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  {(metrics?.visitors?.change || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  )}
                </svg>
                <span className={`text-xs font-medium ${(metrics?.visitors?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(metrics?.visitors?.change || 0) >= 0 ? '+' : ''}{(metrics?.visitors?.change || 0).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs ontem</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.95 }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Sessões</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatNumber(metrics?.sessions?.current || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <svg className={`w-3 h-3 ${(metrics?.sessions?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  {(metrics?.sessions?.change || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  )}
                </svg>
                <span className={`text-xs font-medium ${(metrics?.sessions?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(metrics?.sessions?.change || 0) >= 0 ? '+' : ''}{(metrics?.sessions?.change || 0).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs ontem</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Taxa Conversão</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {(metrics?.conversionRate?.current || 0).toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <svg className={`w-3 h-3 ${(metrics?.conversionRate?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  {(metrics?.conversionRate?.change || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  )}
                </svg>
                <span className={`text-xs font-medium ${(metrics?.conversionRate?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(metrics?.conversionRate?.change || 0) >= 0 ? '+' : ''}{(metrics?.conversionRate?.change || 0).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs ontem</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.05 }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Tempo Médio</span>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatDuration(metrics?.avgSessionDuration?.current || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <svg className={`w-3 h-3 ${(metrics?.avgSessionDuration?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  {(metrics?.avgSessionDuration?.change || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  )}
                </svg>
                <span className={`text-xs font-medium ${(metrics?.avgSessionDuration?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(metrics?.avgSessionDuration?.change || 0) >= 0 ? '+' : ''}{(metrics?.avgSessionDuration?.change || 0).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs ontem</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mini Gráfico ou Info Adicional */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Página Mais Visitada</p>
                {topPages && topPages.length > 0 ? (
                  <p className="text-xs text-gray-600">
                    {topPages[0].path} • <span className="font-medium">{formatNumber(topPages[0].pageViews)} visualizações</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-600">Carregando dados...</p>
                )}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>
                  {lastUpdated 
                    ? `Atualizado ${new Date(lastUpdated).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Atualizado agora'
                  }
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Atalhos Rápidos */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-lg sm:text-xl font-light text-gray-800 mb-4">Acesso Rápido</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '👶', title: 'Produtos', desc: 'Gerencie o catálogo', link: '/admin/produtos', color: 'from-blue-400 to-blue-600' },
            { icon: '📚', title: 'Cursos', desc: 'Gerencie os cursos', link: '/admin/cursos', color: 'from-purple-400 to-purple-600' },
            { icon: '📊', title: 'Analytics', desc: 'Veja as estatísticas', link: '/admin/analytics', color: 'from-green-400 to-green-600' },
            { icon: '⭐', title: 'Avaliações', desc: 'Moderar comentários', link: '/admin/avaliacoes', color: 'from-yellow-400 to-yellow-600' },
            { icon: '🎠', title: 'Carrossel', desc: 'Editar slides', link: '/admin/carrossel', color: 'from-pink-400 to-pink-600' },
            { icon: '🎯', title: 'Destaques', desc: 'Produtos em destaque', link: '/admin/destaques', color: 'from-red-400 to-red-600' },
            { icon: '🖼️', title: 'Categorias', desc: 'Imagens das categorias', link: '/admin/categorias', color: 'from-indigo-400 to-indigo-600' },
            { icon: '🎟️', title: 'Cupons', desc: 'Gerenciar promoções', link: '/admin/cupons', color: 'from-teal-400 to-teal-600' },
          ].map((item, idx) => (
            <Link
              key={item.link}
              to={item.link}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + idx * 0.05 }}
                className="bg-white rounded-xl p-3 sm:p-4 border border-[#e0d6f7] shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
