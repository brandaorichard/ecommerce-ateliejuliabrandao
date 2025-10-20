import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  fetchOrdersAdmin
} from "../../services/adminOrderService";
import { useBabies } from "../../hooks/useBabies"; // Importa os bebês para buscar imagens
import { fetchUserById } from "../../services/adminUserService"; // novo import
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";
import PaymentStatusBadge from "../../components/PaymentStatusBadge";

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "pagamento_pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
  { value: "pagamento_rejeitado", label: "Rejeitado" },
  { value: "cancelado", label: "Cancelado" },
];

export default function AdminOrdersPage() {
  const token = useSelector(s => s.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [usersById, setUsersById] = useState({}); // novo estado
  const [statusTab, setStatusTab] = useState("todos");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Busca todos os bebês para mapear slug -> imagem
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

        // Buscar dados dos usuários
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

  const breadcrumbItems = [
    { label: "Início", to: "/admin" },
    { label: "Pedidos" }
  ];

  // Filtra os pedidos pelo status selecionado
  const filteredOrders = statusTab === "todos"
    ? orders
    : orders.filter(o => o.paymentStatus === statusTab);

  // Contagem de pedidos por status
  const statusCounts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f.value] = f.value === "todos"
      ? orders.length
      : orders.filter(o => o.paymentStatus === f.value).length;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 max-w-lg w-full mx-auto px-2"
    >
      <BreadcrumbItensAdmin items={breadcrumbItems} />
      <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">Pedidos</h1>

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusTab(f.value)}
            className={`px-2.5 py-1 rounded text-[11px] border border-[#e0d6f7] ${
              statusTab === f.value ? "bg-[#7a4fcf] text-white" : "bg-white text-neutral-900"
            }`}
          >
            {f.label} <span className="ml-1 text-[11px] font-semibold">({String(statusCounts[f.value]).padStart(2, "0")})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : filteredOrders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map(order => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="border border-[#e0d6f7] rounded-xl bg-white shadow-sm p-4 flex flex-col gap-2 w-full"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base break-all">
                  Cliente: {usersById[order.userId]?.nome || "Cliente"}
                </span>
                <span className="text-sm text-neutral-600">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs text-neutral-500 mb-1 break-all">
                Pedido #{order._id}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <PaymentStatusBadge 
                  paymentStatus={order.paymentStatus} 
                  size="small"
                />
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-xs text-[#7a4fcf] underline font-medium ml-2"
                >
                  Ver detalhes
                </button>
              </div>
              <div className="flex gap-3 items-center mt-2">
                {order.items.slice(0, 1).map((item, i) => (
                  <div key={i} className="flex flex-col items-center w-20">
                    <img
                      src={babiesBySlug[item.slug]?.images?.[0] || ""}
                      alt={item.slug}
                      className="w-16 h-16 object-cover rounded border border-[#e0d6f7] mb-1"
                    />
                    <span className="text-[11px] text-neutral-700 text-center truncate w-full">{item.slug}</span>
                  </div>
                ))}
                {order.items.length > 1 && (
                  <span className="text-sm text-neutral-600 self-center">
                    +{order.items.length - 1} itens
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div>
                  <span className="font-medium">Entrega:</span>{" "}
                  <span className="text-neutral-700 break-all">{order.deliveryAddress}</span>
                </div>
                {order.shippingValue && (
                  <div>
                    <span className="font-medium">Frete:</span>{" "}
                    <span className="text-neutral-700">
                      {Number(order.shippingValue).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Total:</span>{" "}
                  <span className="text-neutral-900 font-semibold">
                    {Number(order.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de detalhes do pedido */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white border border-[#e0d6f7] rounded-xl p-6 w-full max-w-xl shadow-lg overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-neutral-900">
              Pedido #{selectedOrder._id}
            </h2>
            <p className="text-sm text-neutral-600 mb-2">
              Data: {new Date(selectedOrder.date).toLocaleDateString()}
            </p>
            <div className="mb-4">
              <span className="font-medium">Cliente:</span>{" "}
              <span className="text-neutral-700 break-all">
                {usersById[selectedOrder.userId]?.nome || selectedOrder.userId}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Email:</span>{" "}
              <span className="text-neutral-700 break-all">
                {usersById[selectedOrder.userId]?.email || "-"}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">CPF:</span>{" "}
              <span className="text-neutral-700 break-all">
                {usersById[selectedOrder.userId]?.cpf || "-"}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-medium">Telefone:</span>{" "}
              <span className="text-neutral-700 break-all">
                {usersById[selectedOrder.userId]?.telefone || "-"}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-medium">Endereço de entrega:</span>{" "}
              <span className="text-neutral-700 break-all">{selectedOrder.deliveryAddress}</span>
            </div>
            <div className="mb-4">
              <span className="font-medium">Pagamento:</span>{" "}
              <span className="text-neutral-700">{selectedOrder.paymentMethod}</span>
            </div>
            <div className="mb-4">
              <span className="font-medium">Status de Pagamento:</span>{" "}
              <PaymentStatusBadge 
                paymentStatus={selectedOrder.paymentStatus} 
                size="normal"
              />
            </div>
            <div className="mb-4">
              <span className="font-medium">Itens do pedido:</span>
              <div className="flex flex-col gap-3 mt-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 border border-[#e0d6f7] rounded p-2 bg-[#f7f3fa]">
                    <img
                      src={babiesBySlug[item.slug]?.images?.[0] || ""}
                      alt={item.slug}
                      className="w-16 h-16 object-cover rounded border border-[#e0d6f7]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.slug}</div>
                      <div className="text-sm text-neutral-600">
                        Valor unitário: R${item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-neutral-600">Quantidade: {item.quantity}</div>
                      <div className="text-sm font-semibold mt-1">
                        Subtotal: R${(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selectedOrder.shippingValue && (
              <div className="mb-4">
                <span className="font-medium">Frete:</span>{" "}
                <span className="text-neutral-700">
                  {Number(selectedOrder.shippingValue).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            )}
            <div className="mb-4">
              <span className="font-medium">Total:</span>{" "}
              <span className="text-neutral-900 font-semibold">
                {Number(selectedOrder.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="flex gap-2 mt-4 justify-start">
              <button
                className="px-4 py-2 rounded border border-[#e0d6f7] text-[#7a4fcf] text-sm"
                onClick={() => setSelectedOrder(null)}
              >
                Fechar
              </button>
              <button
                className="px-3 py-2  text-red-500 flex items-center"
                onClick={() => setConfirmDelete(selectedOrder)}
                title="Remover pedido"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white border border-[#e0d6f7] rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-base font-semibold mb-3 text-neutral-900">Remover pedido</h3>
            <p className="text-sm text-neutral-700 mb-4">
              Tem certeza que deseja remover o pedido <span className="font-bold">#{confirmDelete._id}</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded border border-[#e0d6f7] text-neutral-900 text-sm"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                onClick={() => handleDeleteOrder(confirmDelete._id)}
              >
                Remover
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}