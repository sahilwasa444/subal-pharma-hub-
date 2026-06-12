import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prevCart) => [...prevCart, product]);
  }

  function removeFromCart(id) {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;