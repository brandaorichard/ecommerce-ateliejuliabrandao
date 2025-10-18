import { useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from './Auth/GoogleLoginButton';

const API_URL = import.meta.env.VITE_API_URL || 'https://atelie-juliabrandao-backend-production.up.railway.app';

export default function GoogleAccountLink({ user }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLinkGoogle = async (response) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const { data } = await axios.post(
        `${API_URL}/api/auth/google/link`,
        { credential: response.credential },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setMessage(data.message);
      setError('');
      
      // Atualizar dados do usuário
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao vincular conta');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    if (!confirm('Deseja realmente desvincular sua conta Google?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const { data } = await axios.delete(
        `${API_URL}/api/auth/google/unlink`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setMessage(data.message);
      setError('');
      
      // Atualizar dados do usuário
      const updatedUser = { ...user, googleId: null, profilePicture: null };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao desvincular conta');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🔐 Conta Google</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!user.googleId ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Vincule sua conta Google para fazer login mais rapidamente.
          </p>
          <div className="flex justify-center">
            <GoogleLoginButton 
              onSuccess={handleLinkGoogle}
              text="continue_with"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-green-600 text-lg">✅</span>
            <span className="text-gray-700">Conta Google vinculada</span>
          </div>
          
          {user.profilePicture && (
            <div className="flex items-center gap-3">
              <img 
                src={user.profilePicture} 
                alt="Foto de perfil" 
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
              <span className="text-sm text-gray-600">Foto de perfil do Google</span>
            </div>
          )}
          
          <button 
            onClick={handleUnlinkGoogle}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Desvinculando...' : 'Desvincular Conta Google'}
          </button>
        </div>
      )}
    </div>
  );
}
