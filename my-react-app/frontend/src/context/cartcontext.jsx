import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  function getProductId(productOrId) {
    return productOrId?._id ?? productOrId?.id ?? productOrId;
  }

  function addToCart(product) {

    const id = getProductId(product);

    setCart((currentCart) => {

      const existingItem = currentCart.find(
        (item) => item.id === id
      );

      if (existingItem) {

        return currentCart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );

      }

      return [
        ...currentCart,
        {
          ...product,
          id,
          _id: product._id ?? id,
          quantity: 1
        }
      ];

    });
  }

  function increaseQuantity(id) {

    const itemId = getProductId(id);

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  }

  function decreaseQuantity(id) {

    const itemId = getProductId(id);

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === itemId
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

    const itemId = getProductId(id);

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== itemId
      )
    );

  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;