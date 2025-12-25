import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import { useUserReview } from '../hooks/useUserReview';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const API_BASE_URL = 'https://atelie-juliabrandao-backend-production.up.railway.app/api';

const EvaluateOrderPage = () => {
  const { orderId, babyId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [baby, setBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');
  const { hasReviewed, review, loading: reviewLoading } = useUserReview(babyId, orderId, token);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Buscar produto
        const babyResponse = await axios.get(
          `${API_BASE_URL}/babies/${babyId}`
        );
        setBaby(babyResponse.data);

        // Buscar pedido (opcional - pode ser usado para validação)
        try {
          const orderResponse = await axios.get(
            `${API_BASE_URL}/orders/${orderId}`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          setOrder(orderResponse.data);
        } catch (err) {
          console.log('Pedido não encontrado, mas produto existe:', err);
        }

      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar informações. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, babyId, token, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f9e7f6] flex items-center justify-center">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (error || !baby) {
    return (
      <div className="w-full min-h-screen bg-[#f9e7f6] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Erro</h2>
          <p className="text-gray-600 mb-6">{error || 'Produto não encontrado'}</p>
            <button
              onClick={() => navigate('/meus-pedidos')}
              className="px-6 py-2 bg-[#7a4fcf] text-white rounded-lg hover:bg-[#ae95d9] transition"
            >
              Voltar para Meus Pedidos
            </button>
        </div>
      </div>
    );
  }

  // Verificar se o pedido permite avaliação (só verificar se order foi carregado)
  const canReview = order ? (
    order.paymentStatus === 'approved' || 
    order.paymentStatus === 'completed'
  ) : true;
  
  // Se já foi avaliado, mostrar mensagem (só depois que reviewLoading terminar)
  if (!reviewLoading && hasReviewed && review && !loading) {
    return (
      <div className="w-full min-h-screen bg-[#f9e7f6] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-light text-gray-800 mb-4">Produto já avaliado</h1>
            <p className="text-gray-600 mb-6">
              Você já avaliou este produto. Obrigado pelo seu feedback!
            </p>
            {review.rating && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Sua avaliação:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/pedido/${orderId}`)}
                className="px-6 py-2 bg-[#7a4fcf] text-white rounded-lg hover:bg-[#ae95d9] transition"
              >
                Voltar para o Pedido
              </button>
              {baby.slug && (
                <button
                  onClick={() => navigate(`/produto/${baby.slug}`)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Ver Produto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se o pedido não permite avaliação ainda
  if (order && !canReview) {
    return (
      <div className="w-full min-h-screen bg-[#f9e7f6] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaExclamationTriangle className="text-yellow-600 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-light text-gray-800 mb-4">Avaliação não disponível</h1>
            <p className="text-gray-600 mb-6">
              A avaliação estará disponível após a confirmação do pagamento do pedido.
            </p>
            <button
              onClick={() => navigate(`/pedido/${orderId}`)}
              className="px-6 py-2 bg-[#7a4fcf] text-white rounded-lg hover:bg-[#ae95d9] transition"
            >
              Voltar para o Pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f9e7f6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light text-gray-800 mb-8 text-center">Avaliar Produto</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-6 items-center">
            {baby.images && baby.images[0] && (
              <img 
                src={baby.images[0]} 
                alt={baby.name} 
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-2">{baby.name}</h2>
              <p className="text-gray-600">Pedido #{orderId}</p>
              {baby.price && (
                <p className="text-[#7a4fcf] font-medium mt-2">
                  R$ {baby.price.toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>
          </div>
        </div>

        <ReviewForm 
          babyId={babyId} 
          orderId={orderId}
          onSuccess={() => {
            setTimeout(() => {
              navigate(`/pedido/${orderId}`);
            }, 3000);
          }}
        />
      </div>
    </div>
  );
};

export default EvaluateOrderPage;

