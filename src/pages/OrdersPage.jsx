import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useBabies } from "../hooks/useBabies"; // Importa o hook real
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { FaStar, FaSync } from "react-icons/fa";

export default function OrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Rastrear se viemos da página de detalhes
  const [lastPath, setLastPath] = useState(location.pathname);

  // Busca os bebês reais do backend
  const { babies, loading: babiesLoading } = useBabies();

  // Cria um mapa para acesso rápido por slug
  const babiesBySlug = babies.reduce((acc, baby) => {
    acc[baby.slug] = baby;
    return acc;
  }, {});

  const fetchOrders = async (showRefreshing = false) => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Adicionar cache-busting para garantir dados atualizados
      const res = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/orders?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Erro ao buscar pedidos");
      const data = await res.json();
      
      // Debug: verificar dados recebidos
      console.log('📦 Orders recebidos:', data);
      if (data.length > 0) {
        console.log('📦 Primeiro pedido paymentStatus:', data[0].paymentStatus, 'ID:', data[0]._id);
      }
      
      setOrders(data);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para atualizar um pedido específico na lista
  const updateOrderInList = useCallback(async (orderId) => {
    if (!token || !orderId) return;
    
    try {
      const res = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (res.ok) {
        const updatedOrder = await res.json();
        console.log('🔄 Atualizando pedido na lista:', updatedOrder._id, 'Status:', updatedOrder.paymentStatus);
        
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido específico:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Detectar quando voltamos da página de detalhes e atualizar o pedido
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Se estávamos em /pedido/:id e agora estamos em /meus-pedidos
    if (lastPath.startsWith('/pedido/') && currentPath === '/meus-pedidos') {
      const orderId = lastPath.replace('/pedido/', '');
      if (orderId) {
        console.log('🔙 Voltando da página de detalhes, atualizando pedido:', orderId);
        updateOrderInList(orderId);
      }
    }
    
    setLastPath(currentPath);
  }, [location.pathname, lastPath, updateOrderInList]);

  if (loading || babiesLoading) return <p>Carregando pedidos...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex mb-4 text-sm mt-5 items-center gap-2 text-[#7a4fcf] cursor-pointer">
        <span
          className="cursor-pointer hover:underline underline"
          onClick={() => navigate("/")}
        >
          Início
        </span>{" "}
        &gt; <span className="font-light underline ">Meus Pedidos</span>
      </nav>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-light text-gray-800">Meus Pedidos</h1>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Atualizar lista de pedidos"
        >
          <FaSync className={`text-base ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {orders.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="shadow-md border border-gray-200 p-6 flex flex-col gap-4"
              style={{ borderRadius: 0 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800">Pedido #{order._id}</p>
                    {(order.paymentStatus === 'approved' || order.paymentStatus === 'completed') && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        <FaStar className="text-xs" />
                        Avaliar
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <PaymentStatusBadge 
                  paymentStatus={order.paymentStatus} 
                  size="small"
                />
              </div>

              <div className="flex gap-4 items-center">
                {order.items.slice(0, 3).map((item, i) => {
                  const baby = babiesBySlug[item.slug];
                  return (
                    <img
                      key={i}
                      src={baby ? baby.img : null}
                      alt={baby ? baby.name : "Imagem não disponível"}
                      className="w-16 h-16 object-cover"
                    />
                  );
                })}
                {order.items.length > 3 && (
                  <span className="text-sm text-gray-600">
                    +{order.items.length - 3} itens
                  </span>
                )}
              </div>

              <p>
                <strong>Total:</strong> R$ {order.total.toFixed(2)}
              </p>
              <p>
                <strong>Entrega:</strong> {order.deliveryAddress}
              </p>

              <button
                className="self-start text-purple-700 hover:underline"
                onClick={() => navigate(`/pedido/${order._id}`)}
              >
                Ver detalhes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
