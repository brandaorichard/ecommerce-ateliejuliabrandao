import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar consentimento do localStorage
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
      } catch (error) {
        console.error('Erro ao carregar consentimento de cookies:', error);
        setConsent(null);
      }
    }
    setIsLoading(false);
  }, []);

  const updateConsent = (newConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    
    // Google Analytics continua funcionando independente do consentimento
    console.log('Consentimento atualizado - Google Analytics continua ativo');
  };

  const hasConsent = () => {
    return consent !== null;
  };

  const canUseAnalytics = () => {
    return consent?.analytics === true;
  };

  const canUseMarketing = () => {
    return consent?.marketing === true;
  };

  const canUsePreferences = () => {
    return consent?.preferences === true;
  };

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent');
    setConsent(null);
  };

  return {
    consent,
    isLoading,
    hasConsent,
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences,
    updateConsent,
    resetConsent
  };
};
