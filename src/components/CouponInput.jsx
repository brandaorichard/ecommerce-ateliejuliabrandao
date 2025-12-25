import { useState } from "react";
import { motion } from "framer-motion";
import { useCoupon } from "../hooks/useCoupon";

/**
 * Componente para input e validação de cupom de desconto
 * @param {object} props
 * @param {number} props.orderValue - Valor do pedido para validação
 * @param {function} props.onCouponValid - Callback quando cupom é validado (recebe coupon ou null)
 */
export default function CouponInput({ orderValue, onCouponValid }) {
  const [inputCode, setInputCode] = useState("");
  const { code, loading, error, coupon, validate, remove, updateCode } = useCoupon(orderValue);

  const handleApply = async () => {
    const result = await validate(inputCode);
    if (result.success && result.coupon) {
      onCouponValid?.(result.coupon);
    } else {
      onCouponValid?.(null);
    }
  };

  const handleRemove = () => {
    remove();
    setInputCode("");
    onCouponValid?.(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputCode(value);
    updateCode(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && !coupon) {
      handleApply();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <h3 className="text-sm font-semibold mb-2">Cupom de Desconto</h3>
      
      {!coupon ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite o código do cupom"
              disabled={loading}
              className={`flex-1 border rounded px-3 py-2 text-sm transition-all ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#7a4fcf] focus:ring-1 focus:ring-[#7a4fcf]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <button
              onClick={handleApply}
              disabled={loading || !inputCode.trim()}
              className="px-4 py-2 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Validando..." : "Aplicar"}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-600"
            >
              {error}
            </motion.p>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-green-500 bg-green-50 rounded px-3 py-2 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-800">
              Cupom {coupon.code} aplicado!
            </div>
            <div className="text-xs text-green-700">
              Desconto de {coupon.discountPercentage}% 
              {coupon.discountAmount && (
                <> - R$ {coupon.discountAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
              )}
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="ml-2 text-xs text-green-700 hover:text-green-900 underline"
          >
            Remover
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

