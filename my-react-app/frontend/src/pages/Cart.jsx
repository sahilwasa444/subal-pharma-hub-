import { useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";
import { toast } from "react-toastify";
import "../styles/Cart.css";

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

      toast.success("Order placed successfully");
      clearCart();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Could not place the order right now."
      );
    }
  }

  return (
    <div className="page cart-page">
      <section className="section__header">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="hero-title">Review your items</h1>
          <p className="page-subtitle">
            Keep the checkout flow simple, then place your order when you are
            ready.
          </p>
        </div>

        <span className="badge">{cart.length} item(s)</span>
      </section>

      {cart.length === 0 ? (
        <div className="card cart-empty">
          <h2 className="section-title">Your cart is empty</h2>
          <p className="page-subtitle">
            Start by browsing products and adding the medicine you need.
          </p>
          <Link className="btn btn--primary" to="/products">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="card cart-items">
            <div className="section__header">
              <div>
                <p className="eyebrow">Items</p>
                <h2 className="section-title">Selected products</h2>
              </div>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div>
                    <h3 className="cart-item__name">{item.name}</h3>
                    <div className="cart-item__meta">
                      <span>Price: Rs. {item.price}</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>

                  <div className="cart-item__actions">
                    <div className="quantity-controls">
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                    <button
                      className="btn btn--ghost"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="card cart-summary">
            <p className="eyebrow">Summary</p>
            <div className="cart-summary__total">Rs. {totalPrice}</div>
            <p className="page-subtitle">
              {cart.length} item(s) ready to be checked out.
            </p>

            <div className="cart-summary__actions">
              <button className="btn btn--primary" onClick={placeOrder}>
                Place Order
              </button>
              <button className="btn btn--ghost" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
