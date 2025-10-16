import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function CarouselFormModal({ 
  open, 
  onClose, 
  onSubmit, 
  editing = null, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    title: editing?.title || '',
    description: editing?.description || '',
    imageAlt: editing?.imageAlt || '',
    link: editing?.link || '',
    linkText: editing?.linkText || 'Saiba mais',
    order: editing?.order || 0,
    isActive: editing?.isActive ?? true
  });

  const [images, setImages] = useState(editing?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (editing) {
      setFormData({
        title: editing.title || '',
        description: editing.description || '',
        imageAlt: editing.imageAlt || '',
        link: editing.link || '',
        linkText: editing.linkText || 'Saiba mais',
        order: editing.order || 0,
        isActive: editing.isActive ?? true
      });
      setImages(editing.images || []);
    } else {
      setFormData({
        title: '',
        description: '',
        imageAlt: '',
        link: '',
        linkText: 'Saiba mais',
        order: 0,
        isActive: true
      });
      setImages([]);
    }
    setNewImages([]);
    setImagesToDelete([]);
    setErrors({});
  }, [editing, open]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setErrors(prev => ({ ...prev, images: 'Apenas arquivos de imagem são permitidos' }));
      return;
    }

    if (images.length + newImages.length + validFiles.length > 10) {
      setErrors(prev => ({ ...prev, images: 'Máximo de 10 imagens por item' }));
      return;
    }

    setNewImages(prev => [...prev, ...validFiles]);
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Para imagens existentes, adicionar à lista de remoção
      const imageToRemove = images[index];
      setImagesToDelete(prev => [...prev, imageToRemove]);
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (images.length === 0 && newImages.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create FormData
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('imageAlt', formData.imageAlt);
    submitData.append('link', formData.link);
    submitData.append('linkText', formData.linkText);
    submitData.append('order', formData.order);
    submitData.append('isActive', formData.isActive);

    // Add images to delete (only for editing)
    if (editing && imagesToDelete.length > 0) {
      submitData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    // Add new images
    newImages.forEach(file => {
      submitData.append('images', file);
    });

    onSubmit(submitData);
  };

  const allImages = [...images, ...newImages];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editing ? 'Editar Item do Carrossel' : 'Novo Item do Carrossel'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Nova Coleção 2024"
                  disabled={loading}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Descrição do slide..."
                  disabled={loading}
                />
              </div>

              {/* Texto Alternativo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto Alternativo da Imagem
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Texto para acessibilidade..."
                  disabled={loading}
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://exemplo.com"
                  disabled={loading}
                />
              </div>

              {/* Texto do Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  name="linkText"
                  value={formData.linkText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Saiba mais"
                  disabled={loading}
                />
              </div>

              {/* Ordem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  disabled={loading}
                />
              </div>

              {/* Status Ativo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label className="text-sm font-medium text-gray-700">
                  Item ativo (aparece no carrossel)
                </label>
              </div>

              {/* Upload de Imagens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagens *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <FaPlus />
                  Adicionar Imagens
                </button>
                {errors.images && (
                  <p className="text-red-500 text-xs mt-1">{errors.images}</p>
                )}
              </div>

              {/* Preview das Imagens */}
              {allImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens ({allImages.length}/10)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={image}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          disabled={loading}
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                    {newImages.map((file, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nova imagem ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          disabled={loading}
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7a4fcf] text-white rounded-md hover:bg-[#ae95d9] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (editing ? 'Atualizar' : 'Criar')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
