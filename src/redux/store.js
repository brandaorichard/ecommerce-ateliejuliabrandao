import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import toastReducer from "./toastSlice";
import authReducer from "./authSlice";
import freteReducer from "./freteSlice"; // Import the freteSlice
import adminBabiesReducer from "./adminBabiesSlice";
import adminCarouselReducer from "./adminCarouselSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    toast: toastReducer,
    auth: authReducer,
    frete: freteReducer, // Add the freteSlice reducer
    adminBabies: adminBabiesReducer,
    adminCarousel: adminCarouselReducer,
  },
});

export default store;