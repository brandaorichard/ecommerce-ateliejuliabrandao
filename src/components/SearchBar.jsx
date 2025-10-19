import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '../hooks/useSearch';

export default function SearchBar({ autoFocus = false, onClose, className = "" }) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, results, loading, clearSearch, hasResults, isSearching } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Focus automático se solicitado
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Detectar clique fora para fechar dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Abrir dropdown quando há resultados
  useEffect(() => {
    setIsOpen(hasResults);
    setSelectedIndex(-1);
  }, [hasResults]);
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };
  
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        clearSearch();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };
  
  const handleResultClick = (baby) => {
    navigate(`/produto/${baby.slug}`);
    clearSearch();
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onClose) onClose();
  };
  
  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input de pesquisa */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Campo de pesquisa"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => hasResults && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 border border-[#e0d6f7] rounded-lg 
                     bg-white text-gray-900 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-[#7a4fcf] focus:border-transparent
                     transition-colors duration-200"
          aria-label="Buscar bebê reborn"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        
        {/* Botão de limpar */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                       text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpar pesquisa"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Dropdown de resultados */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e0d6f7] 
                       rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            role="listbox"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7a4fcf] mx-auto"></div>
                <p className="mt-2 text-sm">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((baby, index) => (
                  <motion.div
                    key={baby.id || baby._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleResultClick(baby)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                               hover:bg-[#f7f3fa] ${
                                 index === selectedIndex ? 'bg-[#f7f3fa]' : ''
                               }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    {/* Imagem do produto */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded border border-[#e0d6f7] 
                                    flex items-center justify-center overflow-hidden">
                      {baby.images?.[0] ? (
                        <img
                          src={baby.images[0]}
                          alt={baby.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs">📷</div>
                      )}
                    </div>
                    
                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {baby.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {baby.category === 'encomenda' ? 'Sob Encomenda' : 
                         baby.category === 'pronta_entrega' ? 'Pronta Entrega' : 
                         baby.category === 'semelhanca' ? 'Por Semelhança' : 
                         baby.category}
                      </p>
                      {baby.price && (
                        <p className="text-sm font-semibold text-[#7a4fcf] mt-1">
                          R$ {baby.price.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : isSearching ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Nenhum bebê encontrado</p>
                <p className="text-xs mt-1">Tente buscar por outro termo</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
