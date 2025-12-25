import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useBabies } from "../hooks/useBabies"; // Importa o hook real

export default function OrdersPage() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os bebês reais do backend
  const { babies, loading: babiesLoading } = useBabies();

  // Cria um mapa para acesso rápido por slug
  const babiesBySlug = babies.reduce((acc, baby) => {
    acc[baby.slug] = baby;
    return acc;
  }, {});

  useEffect(() => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch("https://atelie-juliabrandao-backend-production.up.railway.app/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include'
        });
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token]);

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

      <h1 className="text-2xl font-light text-gray-800 mb-4">Meus Pedidos</h1>

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
                <div>
                  <p className="text-sm font-medium text-gray-800">Pedido #{order._id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
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
