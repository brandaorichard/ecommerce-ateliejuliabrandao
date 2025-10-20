import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';

const ForgotPasswordPage = () => {
  const [identificador, setIdentificador] = useState('');
  const { loading, error, success, requestPasswordReset } = usePasswordRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!identificador.trim()) {
      return;
    }

    try {
      await requestPasswordReset(identificador);
    } catch (error) {
      // Error já é tratado no hook
    }
  };

  if (success) {
    return (
      <div className="w-full min-h-screen bg-[#f9e7f6] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-light text-gray-800 mb-4">Email Enviado!</h2>
          <p className="text-gray-600 mb-4">
            Se o usuário existir, enviaremos um email com instruções para redefinir sua senha.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm">
              Verifique sua caixa de entrada e também a pasta de spam.
            </p>
          </div>
          <Link 
            to="/login" 
            className="w-full px-6 py-3 bg-[#7a4fcf] text-white rounded-lg font-medium hover:bg-[#ae95d9] transition"
          >
            Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f9e7f6] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">Esqueci Minha Senha</h1>
          <p className="text-gray-600">
            Digite seu email ou CPF para receber instruções de recuperação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identificador" className="block text-sm font-medium text-gray-700 mb-2">
              Email ou CPF
            </label>
            <input
              type="text"
              id="identificador"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              placeholder="Digite seu email ou CPF"
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a4fcf] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full px-6 py-3 bg-[#7a4fcf] text-white rounded-lg font-medium hover:bg-[#ae95d9] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={loading || !identificador.trim()}
          >
            {loading ? 'Enviando...' : 'Enviar Instruções'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-[#7a4fcf] hover:text-[#ae95d9] transition font-medium"
          >
            ← Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

