/**
 * Normaliza uma string removendo acentos e convertendo para lowercase
 * para permitir comparações tolerantes a acentuação
 * 
 * @param {string} str - String a ser normalizada
 * @returns {string} - String normalizada
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Verifica se uma string contém outra string (case-insensitive e sem acentos)
 * 
 * @param {string} text - Texto onde buscar
 * @param {string} searchTerm - Termo a ser buscado
 * @returns {boolean} - True se o texto contém o termo
 */
export function containsNormalized(text, searchTerm) {
  const normalizedText = normalizeString(text);
  const normalizedSearchTerm = normalizeString(searchTerm);
  
  return normalizedText.includes(normalizedSearchTerm);
}
