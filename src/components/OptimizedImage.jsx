import React from 'react';

/**
 * Componente de imagem otimizada com suporte a WebP/AVIF e lazy loading
 * @param {string} src - URL da imagem original
 * @param {string} alt - Texto alternativo
 * @param {number} width - Largura da imagem
 * @param {number} height - Altura da imagem
 * @param {string} className - Classes CSS
 * @param {boolean} priority - Se true, carrega com eager loading (para LCP)
 * @param {string} sizes - Atributo sizes para srcset responsivo
 * @param {boolean} usePicture - Se true, usa <picture> com WebP/AVIF
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false,
  sizes,
  usePicture = false
}) {
  // Gera URLs de WebP e AVIF se a imagem for do Google Cloud Storage
  const getOptimizedUrls = (originalSrc) => {
    if (!originalSrc || !originalSrc.includes('storage.googleapis.com')) {
      return { webp: null, avif: null };
    }
    
    // Para Google Cloud Storage, podemos tentar adicionar parâmetros de transformação
    // ou simplesmente retornar null para usar a imagem original
    // Nota: Isso funcionará melhor quando o backend implementar geração de WebP/AVIF
    return { webp: null, avif: null };
  };

  const { webp, avif } = getOptimizedUrls(src);

  // Se usePicture está habilitado e temos formatos otimizados, usa <picture>
  if (usePicture && (webp || avif)) {
    return (
      <picture>
        {avif && <source srcSet={avif} type="image/avif" sizes={sizes} />}
        {webp && <source srcSet={webp} type="image/webp" sizes={sizes} />}
        <img 
          src={src} 
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

  // Fallback: imagem simples com otimizações
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
