import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useSearch } from "../hooks/useSearch";

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    clearSearch,
    hasResults,
    isSearching,
  } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  // Focus no input quando modal abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Limpar pesquisa quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      clearSearch();
      setSelectedIndex(-1);
    }
  }, [isOpen, clearSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!hasResults || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleResultClick = (baby) => {
    navigate(`/produto/${baby.slug}`);
    onClose();
  };

  const handleClear = () => {
    clearSearch();
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 z-[9999]"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pesquisar Bebês</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fechar pesquisa"
                >
                  <FaTimes className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Input de Pesquisa */}
              <div className="p-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Digite o nome do bebê que você procura..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg
                               bg-white text-gray-900 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-[#7a4fcf] focus:border-transparent
                               transition-all duration-200"
                    aria-label="Buscar bebê reborn"
                  />

                  {/* Ícone de lupa */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-[#7a4fcf]" />
                  </div>

                  {/* Botão de limpar */}
                  {searchTerm && (
                    <button
                      onClick={handleClear}
                      className="absolute inset-y-0 right-10 pr-1 flex items-center
                                 text-gray-400 hover:text-gray-600 transition-colors duration-200
                                 hover:bg-gray-100 rounded-full p-1"
                      aria-label="Limpar pesquisa"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Resultados */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a4fcf] mx-auto"></div>
                    <p className="mt-3 text-sm">Buscando bebês...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {results.map((baby, index) => (
                      <motion.div
                        key={baby.id || baby._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(baby)}
                        className={`flex items-center gap-4 p-4 cursor-pointer transition-colors
                                   hover:bg-[#f7f3fa] ${
                                     index === selectedIndex ? "bg-[#f7f3fa]" : ""
                                   }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleResultClick(baby);
                          }
                        }}
                      >
                        {/* Imagem do produto */}
                        <div
                          className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 
                                     flex items-center justify-center overflow-hidden"
                        >
                          {baby.images?.[0] ? (
                            <img
                              src={baby.images[0]}
                              alt={baby.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-gray-400 text-lg">📷</div>
                          )}
                        </div>

                        {/* Informações do produto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {baby.name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize truncate">
                            {baby.category === "encomenda"
                              ? "Sob Encomenda"
                              : baby.category === "pronta_entrega"
                              ? "Pronta Entrega"
                              : baby.category === "semelhanca"
                              ? "Por Semelhança"
                              : baby.category}
                          </p>
                          {baby.price && (
                            <p className="text-base font-semibold text-[#7a4fcf]">
                              R$ {baby.price.toFixed(2).replace(".", ",")}
                            </p>
                          )}
                        </div>

                        {/* Ícone de seta */}
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : isSearching ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-base">Nenhum bebê encontrado</p>
                    <p className="text-sm mt-1">Tente buscar por outro termo</p>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <FaSearch className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base">Digite para pesquisar bebês</p>
                    <p className="text-sm mt-1">Encontre o bebê perfeito para você</p>
                  </div>
                )}
              </div>

              {/* Footer do Modal */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Use as setas ↑↓ para navegar, Enter para selecionar, ESC para fechar
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
