/**
 * Utilitários para trabalhar com imagens em formato antigo (string) e novo (object)
 */

/**
 * Retorna a URL da imagem no formato correto
 * @param {string|object} image - Imagem no formato antigo (string) ou novo (object)
 * @param {string} format - 'original', 'webp', 'avif', 'thumb'
 * @returns {string} URL da imagem
 */
export function getImageUrl(image, format = 'original') {
  // Formato antigo (string)
  if (typeof image === 'string') {
    return image;
  }
  
  // Formato novo (object)
  if (typeof image === 'object' && image !== null) {
    // Retorna o formato solicitado, com fallback para original
    return image[format] || image.original || image.webp || image.avif || '';
  }
  
  return '';
}

/**
 * Retorna URLs de todos os formatos disponíveis
 * @param {string|object} image - Imagem no formato antigo ou novo
 * @returns {object} { original, webp, avif, thumb }
 */
export function getAllImageFormats(image) {
  // Formato antigo (string)
  if (typeof image === 'string') {
    return {
      original: image,
      webp: null,
      avif: null,
      thumb: null
    };
  }
  
  // Formato novo (object)
  if (typeof image === 'object' && image !== null) {
    return {
      original: image.original || null,
      webp: image.webp || null,
      avif: image.avif || null,
      thumb: image.thumb || null
    };
  }
  
  return {
    original: null,
    webp: null,
    avif: null,
    thumb: null
  };
}

/**
 * Verifica se a imagem tem formatos modernos disponíveis
 * @param {string|object} image - Imagem no formato antigo ou novo
 * @returns {boolean}
 */
export function hasModernFormats(image) {
  if (typeof image !== 'object' || image === null) {
    return false;
  }
  
  return !!(image.webp || image.avif);
}

