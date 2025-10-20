import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';

const ProductReviews = ({ babyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { reviews, pagination, averageRating, loading, error } = useReviews(babyId, currentPage, 10);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Carregando avaliações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Avaliações dos Clientes</h2>
          <p className="text-gray-600">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="border-b-2 border-gray-200 pb-6 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Avaliações dos Clientes</h2>
          {averageRating && (
            <div className="flex items-center gap-4">
              {renderStars(Math.round(averageRating))}
              <span className="text-3xl font-bold text-[#7a4fcf]">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({pagination.total} {pagination.total === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <strong className="text-gray-800">{review.userId.nome}</strong>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
              </div>
              {review.comment && (
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 rounded-lg bg-[#7a4fcf] text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#ae95d9] transition"
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {currentPage} de {pagination.pages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
              className="px-6 py-2 rounded-lg bg-[#7a4fcf] text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#ae95d9] transition"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

