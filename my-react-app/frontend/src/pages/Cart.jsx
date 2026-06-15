import { useContext } from "react";
import { CartContext } from "../context/cartcontext";

function Cart() {

  const {
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
} = useContext(CartContext);
  const totalPrice = cart.reduce(
  (total, item) =>
    total + item.price * item.quantity,
  0
  );

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

  <p>Price: ₹{item.price}</p>

  <p>Quantity: {item.quantity}</p>

  <button
    onClick={() => decreaseQuantity(item.id)}
  >
    -
  </button>

  <button
    onClick={() => increaseQuantity(item.id)}
  >
    +
  </button>

  <button
    onClick={() => removeFromCart(item.id)}>
        Remove
       </button>

       <hr />

      </div>
          ))}

          <h2>Total: ₹{totalPrice}</h2>

        </>
      )}

    </div>
  );
}

export default Cart;