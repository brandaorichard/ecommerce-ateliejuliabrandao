import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import toastReducer from "./toastSlice";
import authReducer from "./authSlice";
import freteReducer from "./freteSlice"; // Import the freteSlice
import adminBabiesReducer from "./adminBabiesSlice";
import adminCarouselReducer from "./adminCarouselSlice";
import adminCategoriesReducer from "./adminCategoriesSlice";
import adminCoursesReducer from "./adminCoursesSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    toast: toastReducer,
    auth: authReducer,
    frete: freteReducer, // Add the freteSlice reducer
    adminBabies: adminBabiesReducer,
    adminCarousel: adminCarouselReducer,
    adminCategories: adminCategoriesReducer,
    adminCourses: adminCoursesReducer,
  },
});

export default store;