import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";
import CarouselFormModal from "../../components/admin/CarouselFormModal";
import { 
  loadCarouselItems, 
  createCarouselItem, 
  updateCarouselItem, 
  deleteCarouselItem, 
  toggleCarouselItemStatus,
  removeCarouselImage,
  setItemLoading 
} from "../../redux/adminCarouselSlice";
import { showToast } from "../../redux/toastSlice";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage } from "react-icons/fa";

export default function AdminCarouselPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.adminCarousel);
  const token = useSelector(s => s.auth.token);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (token) dispatch(loadCarouselItems());
  }, [token, dispatch]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editing) {
        await dispatch(updateCarouselItem({ 
          id: editing._id, 
          formData, 
          token 
        })).unwrap();
        dispatch(showToast({ 
          type: "success", 
          message: "Item do carrossel atualizado com sucesso!" 
        }));
      } else {
        await dispatch(createCarouselItem({ 
          formData, 
          token 
        })).unwrap();
        dispatch(showToast({ 
          type: "success", 
          message: "Item do carrossel criado com sucesso!" 
        }));
      }
      setModalOpen(false);
    } catch (error) {
      dispatch(showToast({ 
        type: "error", 
        message: error || "Erro ao salvar item do carrossel" 
      }));
    }
  };

  const confirmRemove = (item) => {
    setConfirmDelete(item);
  };

  const doRemove = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteCarouselItem({ 
          id: confirmDelete._id, 
          token 
        })).unwrap();
        dispatch(showToast({ 
          type: "success", 
          message: "Item do carrossel removido com sucesso!" 
        }));
      } catch (error) {
        dispatch(showToast({ 
          type: "error", 
          message: error || "Erro ao remover item do carrossel" 
        }));
      }
    }
    setConfirmDelete(null);
  };

  const toggleStatus = async (item) => {
    dispatch(setItemLoading({ id: item._id, loading: true }));
    try {
      await dispatch(toggleCarouselItemStatus({ 
        id: item._id, 
        token 
      })).unwrap();
      dispatch(showToast({ 
        type: "success", 
        message: `Item ${item.isActive ? 'desativado' : 'ativado'} com sucesso!` 
      }));
    } catch (error) {
      dispatch(showToast({ 
        type: "error", 
        message: error || "Erro ao alterar status do item" 
      }));
    }
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <BreadcrumbItensAdmin 
        items={[
          { label: "Admin", to: "/admin" },
          { label: "Carrossel" }
        ]} 
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Gerenciar Carrossel</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Gerencie os slides do carrossel da página inicial
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#7a4fcf] text-white rounded-lg hover:bg-[#ae95d9] transition-colors"
        >
          <FaPlus />
          Novo Slide
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando itens do carrossel...</p>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-8">
          <FaImage className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500 mb-4">Nenhum slide encontrado</p>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#7a4fcf] text-white rounded-lg hover:bg-[#ae95d9] transition-colors"
          >
            Criar Primeiro Slide
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg border ${
                item.isActive 
                  ? 'bg-white border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Preview da primeira imagem */}
              {item.images && item.images.length > 0 && (
                <div className="mb-3">
                  <img
                    src={item.images[0]}
                    alt={item.imageAlt || item.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      +{item.images.length - 1}
                    </div>
                  )}
                </div>
              )}

              {/* Informações do item */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    {item.isActive ? (
                      <FaEye className="text-green-500 text-xs" />
                    ) : (
                      <FaEyeSlash className="text-gray-400 text-xs" />
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="text-xs text-gray-500">
                  <p>Ordem: {item.order}</p>
                  <p>Imagens: {item.images?.length || 0}</p>
                  {item.link && (
                    <p className="truncate">Link: {item.link}</p>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex gap-1 mt-3">
                  <button
                    onClick={() => toggleStatus(item)}
                    disabled={item.loading}
                    className={`text-[10px] px-2 py-1 border rounded flex-1 ${
                      item.isActive 
                        ? 'border-orange-200 text-orange-600 hover:bg-orange-50' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    } ${item.loading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {item.loading ? '...' : item.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 text-[10px] px-2 py-1 border border-[#e0d6f7] rounded hover:bg-[#f7f3fa] text-neutral-900 bg-transparent"
                  >
                    Editar
                  </button>
                  
                  <button
                    onClick={() => confirmRemove(item)}
                    className="w-8 flex items-center justify-center text-red-500 hover:text-red-700"
                    title="Remover"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja remover o slide "{confirmDelete.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={doRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remover
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal do formulário */}
      <CarouselFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editing={editing}
        loading={loading}
      />
    </motion.div>
  );
}
