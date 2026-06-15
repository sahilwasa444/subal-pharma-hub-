import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  function addToCart(product) {

  const existingItem = cart.find(
    (item) => item.id === product.id
  );

  if (existingItem) {

    setCart(
      cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  } else {

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1
      }
    ]);

  }
}

 function increaseQuantity(id) {

  setCart(
    cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    )
  );

}
  function decreaseQuantity(id) {

  setCart(
    cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
      .filter((item) => item.quantity > 0)
  );

}

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  return (
    <CartContext.Provider
      value={{
           cart,
           addToCart,
           removeFromCart,
           increaseQuantity,
             decreaseQuantity
           }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;