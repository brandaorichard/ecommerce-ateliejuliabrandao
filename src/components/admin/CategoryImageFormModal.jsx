import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage, FaTrash } from 'react-icons/fa';

export default function CategoryImageFormModal({ 
  open, 
  onClose, 
  onSubmit, 
  category, 
  loading 
}) {
  const [formData, setFormData] = useState({
    title: '',
    imageAlt: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && category) {
      setFormData({
        title: category.title || '',
        imageAlt: category.imageAlt || ''
      });
      setNewImage(null);
      setPreviewUrl(null);
      setErrors({});
    }
  }, [open, category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Apenas arquivos de imagem são permitidos' }));
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Arquivo muito grande. Máximo 5MB' }));
      return;
    }

    setNewImage(file);
    setErrors(prev => ({ ...prev, image: '' }));

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setNewImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!newImage && !category?.imageUrl) {
      newErrors.image = 'Imagem é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create FormData
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('imageAlt', formData.imageAlt);

    if (newImage) {
      submitData.append('image', newImage);
    }

    onSubmit(submitData);
  };

  const currentImageUrl = previewUrl || category?.imageUrl;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Editar Imagem - {category?.title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preview da imagem */}
              {currentImageUrl && (
                <div className="relative">
                  <img
                    src={currentImageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded border"
                  />
                  {newImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              )}

              {/* Upload de nova imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Imagem
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7a4fcf] file:text-white hover:file:bg-[#ae95d9]"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título (opcional)
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a4fcf]"
                  placeholder="Ex: Sob Encomenda"
                />
              </div>

              {/* Alt text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Alternativo (opcional)
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a4fcf]"
                  placeholder="Descrição da imagem para acessibilidade"
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#7a4fcf] text-white rounded-md hover:bg-[#ae95d9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
