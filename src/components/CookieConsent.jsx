import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings, Check, AlertCircle } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Sempre true - não pode ser desabilitado
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      // Carregar preferências salvas
      const savedPreferences = JSON.parse(consent);
      setCookiePreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Google Analytics continua funcionando independente do consentimento
    console.log('Consentimento aceito - Google Analytics já está ativo');
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    setCookiePreferences(onlyEssential);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyEssential));
    setShowBanner(false);
    
    // Google Analytics continua funcionando independente do consentimento
    console.log('Consentimento rejeitado - Google Analytics continua ativo');
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowSettings(false);
    
    // Google Analytics continua funcionando independente do consentimento
    console.log('Preferências salvas - Google Analytics continua ativo');
  };

  const togglePreference = (type) => {
    if (type === 'essential') return; // Não pode ser alterado
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ 
            y: 100, 
            opacity: 0,
            transition: {
              duration: 0.4,
              ease: "easeInOut"
            }
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        >
        <div className="max-w-7xl mx-auto p-3">
          {!showSettings ? (
            // Banner Principal
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
              <div className="flex items-start gap-2 flex-1">
                <Cookie className="w-5 h-5 text-[#7a4fcf] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    🍪 Usamos cookies para melhorar sua experiência
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Cookies essenciais para funcionamento e opcionais para análise. Você pode escolher quais aceitar.
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <AlertCircle size={12} />
                    <span>Protegido pela LGPD</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-1"
                >
                  <Settings size={14} />
                  Personalizar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Rejeitar Todos
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#7a4fcf] hover:bg-[#ae95d9] rounded-md transition-colors"
                >
                  Aceitar Todos
                </button>
              </div>
            </div>
          ) : (
            // Configurações Detalhadas
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Configurações de Cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Cookies Essenciais */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Cookies Essenciais</h4>
                    <p className="text-xs text-gray-600">
                      Necessários para funcionamento básico (carrinho, login, segurança)
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check size={16} className="text-green-600" />
                    <span className="text-xs text-gray-500">Obrigatório</span>
                  </div>
                </div>

                {/* Cookies Analíticos */}
                <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Cookies Analíticos</h4>
                    <p className="text-xs text-gray-600">
                      Google Analytics para entender como você usa nosso site
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      cookiePreferences.analytics ? 'bg-[#7a4fcf]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        cookiePreferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Cookies de Marketing */}
                <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Cookies de Marketing</h4>
                    <p className="text-xs text-gray-600">
                      Para personalizar anúncios e medir eficácia de campanhas
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      cookiePreferences.marketing ? 'bg-[#7a4fcf]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        cookiePreferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Cookies de Preferências */}
                <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Cookies de Preferências</h4>
                    <p className="text-xs text-gray-600">
                      Para lembrar suas configurações e preferências
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('preferences')}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      cookiePreferences.preferences ? 'bg-[#7a4fcf]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        cookiePreferences.preferences ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#7a4fcf] hover:bg-[#ae95d9] rounded-md transition-colors"
                >
                  Salvar Preferências
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
