import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthProvider from "./context/AuthContext.jsx";
import CartProvider from "./context/cartcontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
