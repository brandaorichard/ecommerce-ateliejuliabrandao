/**
 * Utility para fazer fetch com retry e exponential backoff
 * Especialmente útil para lidar com erros 429 (Too Many Requests)
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const cache = new Map();
const pendingRequests = new Map(); // Para request deduplication

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
 * @param {number} maxRetries - Número máximo de tentativas (padrão: 2)
 * @param {boolean} useCache - Usar cache local (padrão: true)
 * @returns {Promise} Response ou dados em cache
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 2, useCache = true) {
  // Verificar cache primeiro
  if (useCache) {
    const cached = getCachedData(url);
    if (cached) {
      console.log(`[Cache] Usando dados em cache para: ${url}`);
      return cached;
    }
  }
  
  // REQUEST DEDUPLICATION: Se já há uma requisição em andamento para esta URL,
  // retornar a mesma Promise ao invés de fazer uma nova requisição
  const requestKey = url + JSON.stringify(options);
  if (pendingRequests.has(requestKey)) {
    console.log(`[Dedup] Aguardando requisição em andamento para: ${url}`);
    return pendingRequests.get(requestKey);
  }
  
  // Criar a Promise da requisição
  const requestPromise = (async () => {
    let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Verificar se foi abortado ANTES de fazer request
    if (options.signal?.aborted) {
      throw new DOMException('Request aborted', 'AbortError');
    }
    
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
      
      // Se for 429 (Too Many Requests), NÃO fazer retry - usar fallback
      if (response.status === 429) {
        console.error(`[429] Backend bloqueou requisição para: ${url}`);
        // Se tem cache antigo (mesmo expirado), usar
        const expired = cache.get(url);
        if (expired?.data) {
          console.warn('[Cache] Usando cache expirado devido a 429');
          return expired.data;
        }
        // Lançar erro específico para 429
        const error = new Error('Backend bloqueou requisições (429). Tente novamente em instantes.');
        error.status = 429;
        throw error;
      }
      
      // Outros erros HTTP
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      // Se foi abortado, não fazer retry
      if (error.name === 'AbortError') {
        console.log('[Abort] Request cancelado');
        throw error;
      }
      
      lastError = error;
      
      // Se for erro 429, não fazer retry
      if (error.status === 429) {
        throw error;
      }
      
      // Se for erro de rede e ainda tem tentativas, tentar novamente
      if (attempt < maxRetries && error.name === 'TypeError') {
        const delay = 1000 * (attempt + 1); // 1s, 2s
        console.warn(`[Retry] Erro de rede. Tentativa ${attempt + 1}/${maxRetries}. Aguardando ${delay}ms...`);
        
        // Aguardar com possibilidade de abortar
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, delay);
          if (options.signal) {
            options.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new DOMException('Request aborted', 'AbortError'));
            });
          }
        });
        continue;
      }
      
      // Se chegou ao limite de retries ou erro não recuperável, lançar
      throw lastError;
    }
    }
    
    throw lastError || new Error('Erro desconhecido ao fazer requisição');
  })();
  
  // Armazenar a Promise para deduplicação
  pendingRequests.set(requestKey, requestPromise);
  
  // Limpar da lista de pending quando terminar (sucesso ou erro)
  requestPromise.finally(() => {
    pendingRequests.delete(requestKey);
  });
  
  return requestPromise;
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

