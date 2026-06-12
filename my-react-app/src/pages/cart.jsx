import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {

  const { cart, removeFromCart } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
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

              <button
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
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