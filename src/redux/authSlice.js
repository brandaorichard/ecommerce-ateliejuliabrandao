import { createSlice } from "@reduxjs/toolkit";
import { trackEvent } from "../utils/analytics";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isLoggedIn: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user; // { nome, email, role, ... }
      state.token = action.payload.token;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
      
      // Track user login
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('set', 'user_properties', {
          user_id: action.payload.user._id,
          user_role: action.payload.user.role
        });
        
        trackEvent('login', 'user', 'successful_login', action.payload.user._id);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Clear user properties
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('set', 'user_properties', {
          user_id: undefined
        });
      }
    },
    updateUser(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;