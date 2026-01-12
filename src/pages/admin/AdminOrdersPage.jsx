import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchOrdersAdmin
} from "../../services/adminOrderService";
import { useBabies } from "../../hooks/useBabies";
import { fetchUserById } from "../../services/adminUserService";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";

const STATUS_FILTERS = [
  { value: "todos", label: "Todos", icon: "📦", color: "gray" },
  { value: "pagamento_pendente", label: "Pendente", icon: "⏳", color: "yellow" },
  { value: "pago", label: "Pago", icon: "✅", color: "green" },
  { value: "pagamento_rejeitado", label: "Rejeitado", icon: "❌", color: "red" },
  { value: "cancelado", label: "Cancelado", icon: "🚫", color: "gray" },
];

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
    'pagamento_pendente': 'Pagamento Pendente',
    'pagamento_rejeitado': 'Pagamento Rejeitado',
    'cancelado': 'Cancelado'
  };
  return labels[status] || 'Desconhecido';
};

export default function AdminOrdersPage() {
  const token = useSelector(s => s.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [usersById, setUsersById] = useState({});
  const [statusTab, setStatusTab] = useState("todos");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { babies } = useBabies();
  const babiesBySlug = babies.reduce((acc, baby) => {
    acc[baby.slug] = baby;
    return acc;
  }, {});

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await fetchOrdersAdmin(token);
        setOrders(data);

        const uniqueUserIds = [...new Set(data.map(o => o.userId))];
        const userMap = {};
        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const user = await fetchUserById(token, id);
              userMap[id] = user;
            } catch {
              userMap[id] = { nome: "Desconhecido", email: "" };
            }
          })
        );
        setUsersById(userMap);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
        setOrders([]);
      }
      setLoading(false);
    }
    if (token) loadOrders();
  }, [token]);

  async function handleDeleteOrder(id) {
    try {
      await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setConfirmDelete(null);
      setSelectedOrder(null);
      const data = await fetchOrdersAdmin(token);
      setOrders(data);
    } catch (err) {
      alert("Erro ao remover pedido.");
    }
  }

  const filteredOrders = statusTab === "todos"
    ? orders
    : orders.filter(o => o.paymentStatus === statusTab);

  const statusCounts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f.value] = f.value === "todos"
      ? orders.length
      : orders.filter(o => o.paymentStatus === f.value).length;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Início", to: "/admin" },
          { label: "Pedidos" }
        ]}
      />

      {/* Header Premium */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0d6f7] shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-800">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie todos os pedidos do sistema
          </p>
        </div>

        {/* Filtros de Status */}
        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-3 block">
            Filtrar por Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusTab(f.value)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  statusTab === f.value 
                    ? "bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {statusCounts[f.value]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#7a4fcf]"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando pedidos...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-12 border border-[#e0d6f7] shadow-sm text-center"
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-sm text-gray-500">
            {statusTab === "todos" 
              ? "Ainda não há pedidos no sistema" 
              : `Não há pedidos com status "${STATUS_FILTERS.find(f => f.value === statusTab)?.label}"`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {usersById[order.userId]?.nome || "Cliente"}
                      </h3>
                      <div 
                        className="relative group cursor-help"
                        title={getStatusLabel(order.paymentStatus)}
                      >
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.paymentStatus)} ring-2 ring-white shadow-sm`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      #{order._id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-lg font-semibold text-[#7a4fcf] mt-1">
                      {Number(order.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex-shrink-0">
                      <img
                        src={babiesBySlug[item.slug]?.images?.[0] || ""}
                        alt={item.slug}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info e Ações */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{order.items.length}</span> {order.items.length === 1 ? 'item' : 'itens'}
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    Ver Detalhes
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setSelectedOrder(null)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Detalhes do Pedido
                  </h2>
                  <p className="text-sm text-gray-500 font-mono">#{selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cliente Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Nome:</span>
                    <p className="font-medium text-gray-800">{usersById[selectedOrder.userId]?.nome || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium text-gray-800 break-all">{usersById[selectedOrder.userId]?.email || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">CPF:</span>
                    <p className="font-medium text-gray-800">{usersById[selectedOrder.userId]?.cpf || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Telefone:</span>
                    <p className="font-medium text-gray-800">{usersById[selectedOrder.userId]?.telefone || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Pedido Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Data do Pedido</label>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {new Date(selectedOrder.date).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Endereço de Entrega</label>
                  <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Método de Pagamento</label>
                    <p className="text-sm font-medium text-gray-800 mt-1">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedOrder.paymentStatus)}`} />
                      <span className="text-sm font-medium text-gray-800">{getStatusLabel(selectedOrder.paymentStatus)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <img
                        src={babiesBySlug[item.slug]?.images?.[0] || ""}
                        alt={item.slug}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.slug}</p>
                        <p className="text-sm text-gray-600">
                          R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                <div className="space-y-2">
                  {selectedOrder.shippingValue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete:</span>
                      <span className="font-medium text-gray-800">
                        {Number(selectedOrder.shippingValue).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-[#7a4fcf]">
                      {Number(selectedOrder.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => setConfirmDelete(selectedOrder)}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setConfirmDelete(null)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">Confirmar Remoção</h4>
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja remover permanentemente o pedido <strong className="text-gray-800">#{confirmDelete._id}</strong>?
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteOrder(confirmDelete._id)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors shadow-md"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
