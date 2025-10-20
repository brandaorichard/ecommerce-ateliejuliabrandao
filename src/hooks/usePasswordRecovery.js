import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://atelie-juliabrandao-backend-production.up.railway.app/api';

export const usePasswordRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const requestPasswordReset = async (identificador) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { identificador },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao solicitar recuperação';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, senha, confirmarSenha) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        { senha, confirmarSenha },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao redefinir senha';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    requestPasswordReset,
    resetPassword
  };
};

