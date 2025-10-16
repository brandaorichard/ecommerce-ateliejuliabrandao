import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { addToCart } from "../redux/cartSlice";
import { showToast } from "../redux/toastSlice";
import CartButton from "./CartButton";

export default function QuantityBuy({ product, onOpenCart }) {
  const [quantity, setQuantity] = React.useState(1);
  const [showCartIcon, setShowCartIcon] = React.useState(false);
  const dispatch = useDispatch();
  
  // Get cart items and count for the animated icon
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Show cart icon if there are items in cart
  React.useEffect(() => {
    setShowCartIcon(cartCount > 0);
  }, [cartCount]);
  
  // Verifica se é um produto de pronta entrega indisponível
  const isProntaEntrega = product.category === "pronta_entrega";
  const isIndisponivel = product.status === "indisponivel";

  const handleBuy = () => {
    // Não faz nada se o produto estiver indisponível
    if (isIndisponivel) return;
    
    dispatch(addToCart({ product, quantity }));

    dispatch(showToast({
      product: {
        name: product.name,
        img: product.img,
        price: product.price,
      },
      quantity,
    }));

    // The cart icon visibility is now controlled by cartCount via useEffect
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 mb-2">
        <div className={`flex items-center border border-[#616161] rounded-full px-3 py-1 ${isIndisponivel ? 'opacity-50' : ''}`}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f3e6f3] text-[#616161] text-lg font-bold opacity-60"
            aria-label="Diminuir"
            disabled={quantity === 1 || isIndisponivel}
          >
            –
          </button>
          <span className="mx-3 w-4 text-center text-[#616161] font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f3e6f3] text-[#616161] text-lg font-bold opacity-60"
            aria-label="Aumentar"
            disabled={isIndisponivel}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`
              text-white text-lg font-medium rounded-full px-10 py-2 transition
              ${isIndisponivel 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#7a4fcf] hover:bg-[#ae95d9] cursor-pointer'}
            `}
            onClick={handleBuy}
            disabled={isIndisponivel}
          >
            {isIndisponivel ? "Indisponível" : "Comprar"}
          </button>
          
          {/* Animated Cart Icon */}
          <motion.div
            initial={false}
            animate={{ 
              scale: showCartIcon ? 1 : 0, 
              opacity: showCartIcon ? 1 : 0 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className="flex items-center"
          >
            {showCartIcon && (
              <CartButton
                size={24}
                className="text-[#7a4fcf] cursor-pointer"
                badge={cartCount}
                onClick={onOpenCart}
              />
            )}
          </motion.div>
        </div>
      </div>
      
      {isProntaEntrega && isIndisponivel && (
        <div className="text-sm text-red-600 font-medium mb-4">
          Este bebê não está mais disponível para compra.
        </div>
      )}
    </div>
  );
}