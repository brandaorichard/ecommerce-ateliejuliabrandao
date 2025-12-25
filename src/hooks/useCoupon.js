import { useState, useCallback } from "react";
import { validateCoupon } from "../services/couponService";

/**
 * Hook para gerenciar estado e validação de cupom
 * @param {number} orderValue - Valor do pedido para validação
 * @returns {object} Estado e funções do cupom
 */
export function useCoupon(orderValue) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coupon, setCoupon] = useState(null);

  /**
   * Valida e aplica um cupom
   * @returns {Promise<{success: boolean, coupon?: object}>}
   */
  const validate = useCallback(async (couponCode) => {
    if (!couponCode || !couponCode.trim()) {
      setError("Digite um código de cupom");
      setCoupon(null);
      return { success: false, coupon: null };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await validateCoupon(couponCode, orderValue);

      if (result.success) {
        setCoupon(result.coupon);
        setCode(couponCode.toUpperCase().trim());
        setError(null);
        return { success: true, coupon: result.coupon };
      } else {
        setCoupon(null);
        setError(result.message || "Cupom inválido");
        return { success: false, coupon: null };
      }
    } catch (err) {
      console.error("Erro ao validar cupom:", err);
      setCoupon(null);
      setError("Erro ao validar cupom. Tente novamente.");
      return { success: false, coupon: null };
    } finally {
      setLoading(false);
    }
  }, [orderValue]);

  /**
   * Remove o cupom aplicado
   */
  const remove = useCallback(() => {
    setCode("");
    setCoupon(null);
    setError(null);
  }, []);

  /**
   * Atualiza o código do cupom (para input controlado)
   */
  const updateCode = useCallback((newCode) => {
    setCode(newCode);
    // Limpar erro quando usuário começar a digitar novamente
    if (error) {
      setError(null);
    }
  }, [error]);

  return {
    code,
    loading,
    error,
    coupon,
    validate,
    remove,
    updateCode
  };
}

