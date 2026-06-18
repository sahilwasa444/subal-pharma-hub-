import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/global.css";

import AuthProvider from "./context/AuthContext.jsx";
import CartProvider from "./context/cartcontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
