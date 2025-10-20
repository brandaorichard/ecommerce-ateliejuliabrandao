import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaError, setSenhaError] = useState('');
  
  const { loading, error, success, resetPassword } = usePasswordRecovery();

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    return '';
  };

  const handleSenhaChange = (e) => {
    const newSenha = e.target.value;
    setSenha(newSenha);
    setSenhaError(validatePassword(newSenha));
  };

  const handleConfirmarSenhaChange = (e) => {
    setConfirmarSenha(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (senhaError) return;
    
    if (senha !== confirmarSenha) {
      return;
    }

    try {
      await resetPassword(token, senha, confirmarSenha);
    } catch (error) {
      // Error já é tratado no hook
    }
  };

  if (success) {
    return (
      <div className="w-full min-h-screen bg-[#f9e7f6] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-light text-gray-800 mb-4">Senha Redefinida!</h2>
          <p className="text-gray-600 mb-4">Sua senha foi alterada com sucesso.</p>
          <p className="text-gray-600 mb-6">Faça login com sua nova senha.</p>
          <Link 
            to="/login" 
            className="w-full px-6 py-3 bg-[#7a4fcf] text-white rounded-lg font-medium hover:bg-[#ae95d9] transition"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f9e7f6] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">Redefinir Senha</h1>
          <p className="text-gray-600">
            Crie uma nova senha para sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={handleSenhaChange}
              placeholder="Digite sua nova senha"
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a4fcf] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {senhaError && (
              <span className="text-red-600 text-sm mt-1 block">{senhaError}</span>
            )}
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={handleConfirmarSenhaChange}
              placeholder="Confirme sua nova senha"
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a4fcf] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {senha !== confirmarSenha && confirmarSenha && (
              <span className="text-red-600 text-sm mt-1 block">As senhas não coincidem</span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full px-6 py-3 bg-[#7a4fcf] text-white rounded-lg font-medium hover:bg-[#ae95d9] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={
              loading || 
              !senha || 
              !confirmarSenha || 
              senhaError || 
              senha !== confirmarSenha
            }
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
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

export default ResetPasswordPage;

