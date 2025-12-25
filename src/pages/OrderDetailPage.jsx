import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useBabies } from "../hooks/useBabies"; // Use o hook real
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { FaWhatsapp, FaStar, FaCheckCircle } from "react-icons/fa";
import { useUserReview } from "../hooks/useUserReview";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os bebês reais do backend
  const { babies, loading: babiesLoading } = useBabies();

  // Cria um mapa para acesso rápido por slug
  const babiesBySlug = babies.reduce((acc, baby) => {
    acc[baby.slug] = baby;
    return acc;
  }, {});

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          credentials: 'include',
          cache: 'no-store'
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Erro ao buscar pedido");
        }
        const data = await res.json();
        
        // Debug: verificar dados recebidos
        console.log('📄 Order detalhes recebido:', data);
        console.log('📄 Order paymentStatus:', data.paymentStatus, 'ID:', data._id);
        
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, token, navigate]);

  if (loading || babiesLoading) return <p>Carregando detalhes do pedido...</p>;
  if (error)
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-red-600">
        <p>{error}</p>
        <button
          className="mt-4 text-purple-700 hover:underline"
          onClick={() => navigate("/meus-pedidos")}
        >
          Voltar para Meus Pedidos
        </button>
      </div>
    );

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
        &gt;{" "}
        <span
          className="cursor-pointer hover:underline underline"
          onClick={() => navigate("/meus-pedidos")}
        >
          Meus Pedidos
        </span>{" "}
        &gt; <span className="font-light underline ">Pedido #{order._id}</span>
      </nav>

      <h1 className="text-2xl font-light text-gray-800 mb-4">Detalhes do Pedido</h1>

      <div className="shadow-md border border-gray-200 p-6 flex flex-col gap-6" style={{ borderRadius: 0 }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Pedido #{order._id}</p>
            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <PaymentStatusBadge 
            paymentStatus={order.paymentStatus} 
            size="normal"
          />
        </div>

        {/* WhatsApp Contact Section - Only for custom orders */}
        {order.items.some(item => {
          const baby = babiesBySlug[item.slug];
          return baby && baby.category !== 'pronta_entrega';
        }) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <FaWhatsapp className="text-green-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800 mb-1">
                  Personalize seu pedido
                </h3>
                <p className="text-xs text-green-700 mb-2">
                  Entre em contato com a artista para personalizar detalhes como cor do enxoval e características do seu bebê reborn.
                </p>
                <a
                  href={`https://wa.me/5567992654151?text=${encodeURIComponent(
                    `Olá! Meu nome é ${user?.nome || 'Cliente'} e gostaria de personalizar os detalhes do meu pedido #${order._id}. ` +
                    `Pedido realizado em ${new Date(order.date).toLocaleDateString()}. ` +
                    `Itens: ${order.items.map(item => `${item.quantity}x ${item.name || item.slug}`).join(', ')}. ` +
                    `Total: R$ ${order.total.toFixed(2)}. ` +
                    `Gostaria de conversar sobre personalizações específicas. Obrigado!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <FaWhatsapp className="text-base" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="font-semibold mb-2">Itens do Pedido</h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item, i) => {
              const baby = babiesBySlug[item.slug];
              const babyId = baby?._id || baby?.id;
              const canReview = order.paymentStatus === 'approved' || order.paymentStatus === 'completed';
              
              return (
                <OrderItemWithReview
                  key={i}
                  item={item}
                  baby={baby}
                  babyId={babyId}
                  orderId={order._id}
                  canReview={canReview}
                  token={token}
                  paymentStatus={order.paymentStatus}
                />
              );
            })}
          </div>
        </div>

        {order.couponCode && (
          <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm">
              <strong>Cupom aplicado:</strong> {order.couponCode}
              {order.discountAmount && (
                <span className="text-green-700">
                  {" "}- Desconto de R$ {order.discountAmount.toFixed(2)}
                </span>
              )}
            </p>
          </div>
        )}
        <div className="space-y-1 mb-2">
          {order.subtotal && (
            <p>
              <strong>Subtotal:</strong> R$ {order.subtotal.toFixed(2)}
            </p>
          )}
          {order.discountAmount && order.discountAmount > 0 && (
            <p className="text-green-600">
              <strong>Desconto:</strong> - R$ {order.discountAmount.toFixed(2)}
            </p>
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
          onClick={() => navigate("/meus-pedidos")}
        >
          Voltar para Meus Pedidos
        </button>
      </div>
    </div>
  );
}

// Componente para item do pedido com opção de avaliação
function OrderItemWithReview({ item, baby, babyId, orderId, canReview, token }) {
  const navigate = useNavigate();
  const { hasReviewed, review, loading: reviewLoading } = useUserReview(babyId, orderId, token);
  
  const handleReviewClick = () => {
    if (babyId) {
      navigate(`/avaliar/${orderId}/${babyId}`);
    }
  };

  const handleViewReview = () => {
    if (baby?.slug) {
      navigate(`/produto/${baby.slug}`);
    }
  };

  return (
    <div className="flex items-center gap-4 border border-neutral-300 rounded-lg p-3 bg-[#f9e7f6]">
      <img
        src={baby ? baby.img : ""}
        alt={baby ? baby.name : item.slug}
        className="w-20 h-22 rounded object-cover border border-neutral-300"
      />
      <div className="flex-1">
        <div className="font-medium">{baby ? baby.name : item.slug}</div>
        <div className="text-sm text-gray-600">
          Valor unitário: R${item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-gray-600">Quantidade: {item.quantity}</div>
        <div className="text-sm font-semibold mt-1">
          Subtotal: R${(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
        
        {/* Seção de Avaliação */}
        {babyId && canReview && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            {reviewLoading ? (
              <p className="text-xs text-gray-500">Verificando avaliação...</p>
            ) : hasReviewed ? (
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm text-green-700 font-medium">Produto já avaliado</span>
                {review?.rating && (
                  <div className="flex items-center gap-1 ml-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xs ${
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={handleViewReview}
                  className="ml-auto text-xs text-[#7a4fcf] hover:underline"
                >
                  Ver avaliação
                </button>
              </div>
            ) : (
              <button
                onClick={handleReviewClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FaStar className="text-base" />
                Avaliar Produto
              </button>
            )}
          </div>
        )}
        
        {babyId && !canReview && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              Avaliação disponível após confirmação do pagamento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}