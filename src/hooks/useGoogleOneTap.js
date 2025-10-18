import { useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://atelie-juliabrandao-backend-production.up.railway.app';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '443535322074-7pp5innr18a230n59n255r48v5s5k6d5.apps.googleusercontent.com';

export const useGoogleOneTap = ({ onSuccess, onError, disabled = false }) => {
  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/google`, {
        credential: response.credential
      }, {
        withCredentials: true
      });
      
      // Salvar token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error('Erro no Google One Tap:', error);
      
      if (error.response?.data?.action === 'login_required') {
        // Email já cadastrado, redirecionar para login
        if (onError) {
          onError(error.response.data);
        }
      } else {
        if (onError) {
          onError({ message: 'Erro ao fazer login com Google' });
        }
      }
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (disabled || !window.google) return;

    // Inicializar Google One Tap
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Renderizar botão One Tap
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log('One Tap não exibido:', notification.getNotDisplayedReason());
      }
    });
  }, [handleCredentialResponse, disabled]);
};
