import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://atelie-juliabrandao-backend-production.up.railway.app/api';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== 'all' ? `?status=${filter}` : '';
      const response = await axios.get(
        `${API_BASE_URL}/admin/reviews${statusParam}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setReviews(response.data.data.reviews);
      setStats(response.data.data.stats);
    } catch (err) {
      console.error('Erro ao buscar reviews:', err);
      alert(err.response?.data?.message || 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleApprove = async (reviewId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/admin/reviews/${reviewId}/approve`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao aprovar');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/admin/reviews/${reviewId}/reject`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao rejeitar');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Deletar avaliação permanentemente?')) return;
    
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/reviews/${reviewId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao deletar');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-center text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-6">Moderação de Avaliações</h1>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <span className="block text-3xl font-bold text-yellow-600">{stats.pending}</span>
              <span className="text-sm text-yellow-700">Pendentes</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <span className="block text-3xl font-bold text-green-600">{stats.approved}</span>
              <span className="text-sm text-green-700">Aprovadas</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <span className="block text-3xl font-bold text-blue-600">{stats.total}</span>
              <span className="text-sm text-blue-700">Total</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'all' 
                ? 'bg-[#7a4fcf] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'pending' 
                ? 'bg-[#7a4fcf] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'approved' 
                ? 'bg-[#7a4fcf] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('approved')}
          >
            Aprovadas
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Nenhuma avaliação encontrada.</p>
        ) : (
          reviews.map((review) => (
            <div 
              key={review._id} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                review.approved ? 'border-green-500' : 'border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <strong className="text-lg text-gray-800">
                      {review.babyId?.name || 'Produto removido'}
                    </strong>
                    <span className="text-sm text-gray-500">
                      /{review.babyId?.slug}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-gray-700">{review.userId?.nome}</span>
                    <span className="text-sm text-gray-500">{review.userId?.email}</span>
                  </div>
                  
                  {renderStars(review.rating)}
                  
                  {review.comment && (
                    <p className="text-gray-700 mt-3 italic">"{review.comment}"</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>
                      {new Date(review.createdAt).toLocaleString('pt-BR')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      review.approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.approved ? '✅ Aprovada' : '⏳ Pendente'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {!review.approved && (
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                      onClick={() => handleApprove(review._id)}
                    >
                      ✅ Aprovar
                    </button>
                  )}
                  {review.approved && (
                    <button 
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                      onClick={() => handleReject(review._id)}
                    >
                      ❌ Reprovar
                    </button>
                  )}
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    onClick={() => handleDelete(review._id)}
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;

