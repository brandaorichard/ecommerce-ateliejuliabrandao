import React from 'react';
import { getAllImageFormats } from '../utils/imageUtils';

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
  useThumbnail = false
}) {
  // Extrai todos os formatos disponíveis
  const { original, webp, avif, thumb } = getAllImageFormats(image);
  
  // Se useThumbnail = true e thumbnail existe, usa ele como padrão
  const defaultSrc = useThumbnail && thumb ? thumb : original;
  
  // Se não tem nenhuma URL, não renderiza
  if (!defaultSrc) {
    return null;
  }

  // Se tem formatos modernos (WebP ou AVIF), usa <picture> para suporte progressivo
  if (webp || avif) {
    return (
      <picture>
        {/* AVIF - Melhor compressão (browsers modernos) */}
        {avif && <source srcSet={avif} type="image/avif" sizes={sizes} />}
        
        {/* WebP - Boa compressão (97% dos browsers) */}
        {webp && <source srcSet={webp} type="image/webp" sizes={sizes} />}
        
        {/* JPEG/PNG - Fallback universal */}
        <img 
          src={defaultSrc} 
          alt={alt}
          width={width}
          height={height}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "auto"}
        />
      </picture>
    );
  }

  // Fallback: imagem simples (formato antigo ou sem WebP/AVIF)
  return (
    <img 
      src={defaultSrc} 
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
