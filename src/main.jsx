import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./redux/store";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import axios from "axios";
import { initGA } from "./utils/analytics";

// Configurar axios para incluir cookies
axios.defaults.withCredentials = true;

// Inicializar Google Analytics sempre (independente do consentimento)
initGA('G-HVR2YHYHKZ');

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Provider>
);