import React, { useState } from 'react';
import { useCreateReview } from '../hooks/useReviews';

const ReviewForm = ({ babyId, orderId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { createReview, loading, error, success } = useCreateReview();

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Por favor, selecione uma nota');
      return;
    }

    try {
      await createReview({
        babyId,
        orderId,
        rating,
        comment: comment.trim() || undefined
      }, token);

      // Limpar formulário
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-medium text-green-700 mb-3">✅ Avaliação enviada com sucesso!</h3>
        <p className="text-green-600">Obrigado pelo seu feedback! Sua avaliação será publicada após moderação.</p>
      </div>
    );
  }

  const getRatingText = (rating) => {
    const texts = {
      1: 'Péssimo',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    return texts[rating] || '';
  };

  return (
    <div className="bg-[#f7f3fa] rounded-lg p-8 border border-[#e0d6f7]">
      <h3 className="text-2xl font-light text-gray-800 mb-6">Avaliar Produto</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sua avaliação *
          </label>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-5xl transition-transform ${
                  star <= (hoverRating || rating) 
                    ? 'text-yellow-400 scale-110' 
                    : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="text-[#7a4fcf] font-medium">
              {getRatingText(rating)}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte-nos sobre sua experiência..."
            maxLength={1000}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a4fcf] resize-vertical"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/1000 caracteres
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full px-6 py-3 bg-[#7a4fcf] text-white rounded-lg font-medium text-lg hover:bg-[#ae95d9] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={loading || rating === 0}
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

