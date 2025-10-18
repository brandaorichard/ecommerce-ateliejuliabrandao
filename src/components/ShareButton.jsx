import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, MessageCircle, Facebook, Twitter, Link, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/toastSlice';
import { trackShare } from '../utils/analytics';

export default function ShareButton({ productUrl, productName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const shareText = `Confira este lindo bebê reborn: ${productName}`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50',
      action: () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + productUrl)}`;
        window.open(whatsappUrl, '_blank');
        trackShare(productName, 'whatsapp');
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        window.open(facebookUrl, '_blank');
        trackShare(productName, 'facebook');
      }
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-sky-600',
      bgColor: 'hover:bg-sky-50',
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
        window.open(twitterUrl, '_blank');
        trackShare(productName, 'twitter');
      }
    },
    {
      name: 'Copiar Link',
      icon: copied ? Check : Link,
      color: copied ? 'text-green-600' : 'text-gray-600',
      bgColor: 'hover:bg-gray-50',
      action: async () => {
        try {
          await navigator.clipboard.writeText(productUrl);
          setCopied(true);
          dispatch(showToast({
            message: 'Link copiado com sucesso!',
            type: 'success'
          }));
          trackShare(productName, 'copy');
          
          // Reset copied state after 2 seconds
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Erro ao copiar link:', err);
          dispatch(showToast({
            message: 'Erro ao copiar link',
            type: 'error'
          }));
        }
      }
    }
  ];


  return (
    <div className="relative" ref={dropdownRef}>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-[#7a4fcf] hover:text-[#ae95d9] transition-colors duration-200"
        aria-label="Compartilhar produto"
      >
        <Share2 size={16} />
        <span>Compartilhar</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="py-2">
              {shareOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => {
                      option.action();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 ${option.bgColor}`}
                  >
                    <IconComponent 
                      size={16} 
                      className={option.color}
                    />
                    <span className="text-gray-700">
                      {option.name === 'Copiar Link' && copied ? 'Copiado!' : option.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
