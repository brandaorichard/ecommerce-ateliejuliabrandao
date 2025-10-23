import React from 'react';

/**
 * Componente de imagem otimizada com suporte a WebP/AVIF e lazy loading
 * Suporta formato antigo (string) e novo (object com múltiplos formatos)
 * 
 * @param {string|object} image - URL da imagem (string) ou objeto com múltiplos formatos
 * @param {string} alt - Texto alternativo
 * @param {number} width - Largura da imagem
 * @param {number} height - Altura da imagem
 * @param {string} className - Classes CSS
 * @param {boolean} priority - Se true, carrega com eager loading (para LCP)
 * @param {string} sizes - Atributo sizes para srcset responsivo
 * @param {boolean} useThumbnail - Se true, usa versão thumbnail (para listagens)
 */
export default function OptimizedImage({ 
  image, 
  alt, 
  width, 
  height, 
  className,
  priority = false,
  sizes,
}) {
  const src = typeof image === 'string' ? image : '';

  if (!src) {
    return null;
  }

  return (
    <img 
      src={src} 
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : "auto"}
      sizes={sizes}
    />
  );
}
