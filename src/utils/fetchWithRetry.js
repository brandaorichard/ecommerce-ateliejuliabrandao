/**
 * Utility para fazer fetch com retry e exponential backoff
 * Especialmente útil para lidar com erros 429 (Too Many Requests)
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const cache = new Map();

/**
 * Verifica se há cache válido para uma URL
 */
function getCachedData(url) {
  const cached = cache.get(url);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(url);
    return null;
  }
  
  return cached.data;
}

/**
 * Salva dados no cache
 */
function setCachedData(url, data) {
  cache.set(url, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Faz fetch com retry automático e cache
 * @param {string} url - URL para fazer fetch
 * @param {object} options - Opções do fetch
 * @param {number} maxRetries - Número máximo de tentativas (padrão: 3)
 * @param {boolean} useCache - Usar cache local (padrão: true)
 * @returns {Promise} Response ou dados em cache
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3, useCache = true) {
  // Verificar cache primeiro
  if (useCache) {
    const cached = getCachedData(url);
    if (cached) {
      console.log(`[Cache] Usando dados em cache para: ${url}`);
      return cached;
    }
  }
  
  let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Se deu certo, cachear e retornar
      if (response.ok) {
        const data = await response.json();
        if (useCache) {
          setCachedData(url, data);
        }
        return data;
      }
      
      // Se for 429 (Too Many Requests), fazer retry com backoff
      if (response.status === 429) {
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10s
          console.warn(`[Retry] 429 detectado. Tentativa ${attempt + 1}/${maxRetries}. Aguardando ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw new Error('Muitas requisições. Tente novamente em alguns instantes.');
        }
      }
      
      // Outros erros HTTP
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error;
      
      // Se for erro de rede ou timeout, tentar novamente
      if (attempt < maxRetries && (error.name === 'TypeError' || error.name === 'AbortError')) {
        const delay = Math.min(500 * Math.pow(2, attempt), 5000);
        console.warn(`[Retry] Erro de rede. Tentativa ${attempt + 1}/${maxRetries}. Aguardando ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Se chegou ao limite de retries, lançar erro
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }
  
  throw lastError || new Error('Erro desconhecido ao fazer requisição');
}

/**
 * Limpa todo o cache
 */
export function clearCache() {
  cache.clear();
  console.log('[Cache] Cache limpo');
}

/**
 * Limpa cache de uma URL específica
 */
export function clearCacheForUrl(url) {
  cache.delete(url);
  console.log(`[Cache] Cache removido para: ${url}`);
}

