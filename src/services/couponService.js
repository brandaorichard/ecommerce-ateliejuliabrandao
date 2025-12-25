const API_BASE = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

/**
 * Valida um cupom de desconto e calcula o valor do desconto
 * @param {string} code - Código do cupom (será convertido para UPPERCASE e trim)
 * @param {number} orderValue - Valor do pedido para cálculo do desconto
 * @returns {Promise<{success: boolean, coupon?: object, message?: string, minOrderValue?: number}>}
 */
export async function validateCoupon(code, orderValue) {
  if (!code || !code.trim()) {
    return {
      success: false,
      message: "Código do cupom é obrigatório"
    };
  }

  // Normalizar código: UPPERCASE e trim
  const normalizedCode = code.toUpperCase().trim();

  try {
    const response = await fetch(`${API_BASE}/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
        code: normalizedCode,
        orderValue: orderValue || undefined
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Erro ao validar cupom",
        minOrderValue: data.minOrderValue
      };
    }

    return {
      success: true,
      coupon: data.coupon
    };
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return {
      success: false,
      message: "Erro de conexão. Tente novamente."
    };
  }
}

