import { useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";
import { toast } from "react-toastify";
import EmptyState from "../components/ui/EmptyState";
import StatCard from "../components/ui/StatCard";
import {
  ArrowRight,
  Minus,
  PackageX,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2
} from "lucide-react";
import "../styles/Cart.css";

function Cart() {
  const {
    cart,
    cartSummary,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useContext(CartContext);

  const totalPrice = cartSummary.totalPrice;
  const itemCount = cartSummary.itemCount;

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
      <section className="card cart-hero">
        <div className="cart-hero__copy">
          <p className="eyebrow">Cart</p>
          <h1 className="hero-title">A calm checkout flow for the medicines you already trust.</h1>
          <p className="page-subtitle">
            Review the items in your basket, adjust quantities, and place the
            order when everything looks right.
          </p>
        </div>

        <div className="stat-grid stat-grid--three cart-hero__stats">
          <StatCard
            icon={ShoppingBag}
            label="Items in cart"
            value={itemCount}
            description="Medicines selected for checkout."
            tone="blue"
          />
          <StatCard
            icon={ArrowRight}
            label="Estimated total"
            value={`Rs. ${totalPrice}`}
            description="Updated automatically as you edit quantities."
            tone="emerald"
          />
          <StatCard
            icon={ShieldCheck}
            label="Protected order"
            value="Secure"
            description="Checkout stays behind authenticated routes."
            tone="amber"
          />
        </div>
      </section>

      {cart.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title="Your cart is empty"
          description="Start by browsing products and adding the medicine you need."
          action={
            <Link className="btn btn--primary" to="/products">
              Browse products
            </Link>
          }
          className="cart-empty"
        />
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
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label={`Decrease quantity for ${item.name}`}
                        type="button"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        aria-label={`Increase quantity for ${item.name}`}
                        type="button"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      className="btn btn--ghost"
                      onClick={() => removeFromCart(item.id)}
                      type="button"
                    >
                      <Trash2 size={14} aria-hidden="true" />
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
              {cartSummary.itemCount} item(s) ready to be checked out.
            </p>

            <div className="cart-summary__actions">
              <button className="btn btn--primary" onClick={placeOrder} type="button">
                Place Order
              </button>
              <button className="btn btn--ghost" onClick={clearCart} type="button">
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
