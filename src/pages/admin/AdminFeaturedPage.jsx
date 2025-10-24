import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";
import { useFeaturedEncomendaAdmin } from "../../hooks/useFeaturedEncomendaAdmin";
import { showToast } from "../../redux/toastSlice";
import { useDispatch } from "react-redux";

export default function AdminFeaturedPage() {
  const dispatch = useDispatch();
  const {
    featuredData,
    availableProducts,
    loading,
    error,
    saving,
    saveConfiguration,
    addProduct,
    removeProduct,
    reorderProducts,
    toggleActive,
    refetch
  } = useFeaturedEncomendaAdmin();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    isActive: false
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Atualizar form quando dados carregam
  useEffect(() => {
    if (featuredData) {
      console.log('Featured data loaded:', featuredData);
      setFormData({
        title: featuredData.title || "",
        subtitle: featuredData.subtitle || "",
        description: featuredData.description || "",
        isActive: featuredData.isActive || false
      });
      setSelectedProducts(featuredData.products || []);
    }
  }, [featuredData]);

  // Resetar página quando produtos disponíveis mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [availableProducts.length]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveConfiguration = async () => {
    const result = await saveConfiguration({
      ...formData,
      products: selectedProducts.map(p => p._id || p.id)
    });

    if (result.success) {
      dispatch(showToast({ message: "Configuração salva com sucesso!", type: "success" }));
    } else {
      dispatch(showToast({ message: result.error || "Erro ao salvar configuração", type: "error" }));
    }
  };

  const handleToggleActive = async () => {
    const result = await toggleActive();
    if (result.success) {
      dispatch(showToast({ 
        message: `Preview ${result.data.isActive ? 'ativado' : 'desativado'} com sucesso!`, 
        type: "success" 
      }));
    } else {
      dispatch(showToast({ message: result.error || "Erro ao alterar status", type: "error" }));
    }
  };

  const handleAddProduct = async (product) => {
    const result = await addProduct(product._id || product.id);
    if (result.success) {
      dispatch(showToast({ message: "Produto adicionado com sucesso!", type: "success" }));
    } else {
      dispatch(showToast({ message: result.error || "Erro ao adicionar produto", type: "error" }));
    }
  };

  const handleRemoveProduct = async (product) => {
    const result = await removeProduct(product._id || product.id);
    if (result.success) {
      dispatch(showToast({ message: "Produto removido com sucesso!", type: "success" }));
    } else {
      dispatch(showToast({ message: result.error || "Erro ao remover produto", type: "error" }));
    }
  };

  const moveProduct = async (product, direction) => {
    const currentIndex = selectedProducts.findIndex(p => (p._id || p.id) === (product._id || product.id));
    if (currentIndex === -1) return;

    const newProducts = [...selectedProducts];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= newProducts.length) return;

    // Trocar posições
    [newProducts[currentIndex], newProducts[newIndex]] = [newProducts[newIndex], newProducts[currentIndex]];

    // Passar array de produtos (não só IDs) para a função reorderProducts
    const result = await reorderProducts(newProducts);

    if (result.success) {
      dispatch(showToast({ message: "Ordem atualizada com sucesso!", type: "success" }));
    } else {
      dispatch(showToast({ message: result.error || "Erro ao reordenar produtos", type: "error" }));
    }
  };

  const getAvailableProducts = () => {
    const selectedIds = selectedProducts.map(p => p._id || p.id);
    return availableProducts.filter(p => !selectedIds.includes(p._id || p.id));
  };

  const getPaginatedProducts = () => {
    const available = getAvailableProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return available.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getAvailableProducts().length / productsPerPage);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <BreadcrumbItensAdmin
          items={[
            { label: "Início", to: "/admin" },
            { label: "Destaques", to: "/admin/destaques" }
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a4fcf] mx-auto mb-4"></div>
            <p className="text-sm text-neutral-600">Carregando configurações...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Início", to: "/admin" },
          { label: "Destaques", to: "/admin/destaques" }
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">
          Produtos em Destaque
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleToggleActive}
            disabled={saving}
            className={`px-3 py-1 text-xs font-medium rounded ${
              featuredData?.isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? '...' : featuredData?.isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="mt-2 text-xs text-red-600 underline hover:text-red-800"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Configurações do Preview */}
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h2 className="text-base font-semibold mb-4 text-neutral-900">📝 Configurações do Preview</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Sob encomenda - Mais vendidos"
              className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-3 py-2 rounded text-sm text-neutral-900"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Subtítulo</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Ex: Produtos mais procurados"
              className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-3 py-2 rounded text-sm text-neutral-900"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-xs font-medium text-neutral-700 mb-1">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Ex: Confira nossos produtos em destaque"
            rows={3}
            className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-3 py-2 rounded text-sm text-neutral-900"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-[#e0d6f7]"
            />
            <span className="text-xs font-medium text-neutral-700">Sistema ativo</span>
          </label>
        </div>
      </div>

      {/* Produtos em Destaque */}
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h2 className="text-base font-semibold mb-4 text-neutral-900">
          🎯 Produtos em Destaque ({selectedProducts.length}/10)
        </h2>
        
        {selectedProducts.some(p => !p.name || !p.price) && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Alguns produtos não têm dados completos. Tente removê-los e adicioná-los novamente.
          </div>
        )}
        
        {selectedProducts.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm">Nenhum produto em destaque ainda.</p>
            <p className="text-xs mt-1">Adicione produtos abaixo para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedProducts.map((product, index) => (
              <div key={product._id || product.id} className="flex items-center justify-between p-3 bg-[#f7f3fa] rounded-lg border border-[#e0d6f7]">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveProduct(product, 'up')}
                      disabled={index === 0}
                      className="p-1 text-[#7a4fcf] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveProduct(product, 'down')}
                      disabled={index === selectedProducts.length - 1}
                      className="p-1 text-[#7a4fcf] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                  
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded border border-[#e0d6f7]"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded border border-[#e0d6f7] flex items-center justify-center">
                      <span className="text-xs text-gray-500">Sem imagem</span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900">{product.name}</h3>
                    <p className="text-xs text-neutral-600">R$ {product.price?.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveProduct(product)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remover produto"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adicionar Produtos */}
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-neutral-900">
            ➕ Adicionar Produtos
          </h2>
        </div>
        
        {getAvailableProducts().length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm">Todos os produtos já estão em destaque ou não há produtos disponíveis.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {getPaginatedProducts().map((product) => (
                <div key={product._id || product.id} className="flex items-center justify-between p-3 bg-[#f7f3fa] rounded-lg border border-[#e0d6f7]">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded border border-[#e0d6f7]"
                      />
                    )}
                    
                    <div>
                      <h3 className="text-xs font-medium text-neutral-900">{product.name}</h3>
                      <p className="text-xs text-neutral-600">R$ {product.price?.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAddProduct(product)}
                    disabled={selectedProducts.length >= 10}
                    className="px-2 py-1 text-xs bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title={selectedProducts.length >= 10 ? "Máximo de 10 produtos" : "Adicionar produto"}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-[#e0d6f7] rounded text-neutral-900 bg-white hover:bg-[#f7f3fa] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-[#7a4fcf] text-white'
                            : 'border border-[#e0d6f7] text-neutral-900 bg-white hover:bg-[#f7f3fa]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-[#e0d6f7] rounded text-neutral-900 bg-white hover:bg-[#f7f3fa] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={refetch}
          className="px-4 py-2 text-sm border border-[#e0d6f7] rounded text-neutral-900 bg-white hover:bg-[#f7f3fa]"
        >
          🔄 Atualizar
        </button>
        <button
          onClick={handleSaveConfiguration}
          disabled={saving}
          className="px-4 py-2 text-sm bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '💾 Salvando...' : '💾 Salvar Configurações'}
        </button>
      </div>
    </motion.div>
  );
}
