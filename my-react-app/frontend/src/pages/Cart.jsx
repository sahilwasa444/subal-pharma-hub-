import { useContext } from "react";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function placeOrder() {
    try {
      await api.post(
        "/orders",
        {
          items: cart,
          totalPrice
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Order Placed");
      clearCart();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Cart Page</h1>

      {cart.length === 0 ? (
        <h2>Cart is Empty</h2>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>Price: Rs.{item.price}</p>
              <p>Quantity: {item.quantity}</p>

              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>

              <hr />
            </div>
          ))}

          <h2>Total: Rs.{totalPrice}</h2>
          <button onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}

export default Cart;
