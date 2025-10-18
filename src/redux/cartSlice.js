import { createSlice } from "@reduxjs/toolkit";
import { trackAddToCart, trackRemoveFromCart } from "../utils/analytics";

function getUniqueKey(product) {
  return [
    product.slug,
    product.name,
    product.boxType,
    product.category,
    product.isConfirmed ? "confirmed" : "notconfirmed"
  ].join("_");
}

// Recupera o carrinho do localStorage ao iniciar
function getInitialCart() {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: getInitialCart() },
  reducers: {
    addToCart(state, action) {
      const { product, quantity } = action.payload;
      const uniqueKey = getUniqueKey(product);

      const idx = state.items.findIndex(item => item.uniqueKey === uniqueKey);
      if (idx !== -1) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({ ...product, quantity, uniqueKey });
      }
      
      // Track add to cart event
      trackAddToCart(
        product.slug,
        product.name,
        product.category,
        quantity,
        product.price
      );
      
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      const item = state.items.find(i => i.uniqueKey === action.payload);
      if (item) {
        // Track remove from cart event
        trackRemoveFromCart(
          item.slug,
          item.name,
          item.category,
          item.quantity,
          item.price
        );
      }
      
      state.items = state.items.filter(item => item.uniqueKey !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
    setQuantity(state, action) {
      const { uniqueKey, quantity } = action.payload;
      const idx = state.items.findIndex(item => item.uniqueKey === uniqueKey);
      if (idx !== -1) {
        state.items[idx].quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }
});

export const { addToCart, removeFromCart, clearCart, setQuantity } = cartSlice.actions;
export default cartSlice.reducer;