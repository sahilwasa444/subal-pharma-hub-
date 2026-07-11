import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import EmptyState from "../components/ui/EmptyState";
import StatCard from "../components/ui/StatCard";
import { CalendarClock, ClipboardList, PackageCheck, ShoppingBag } from "lucide-react";
import "../styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setOrders(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const latestOrderDate = orders.length
    ? new Date(
        Math.max(...orders.map((order) => new Date(order.createdAt).getTime()))
      ).toLocaleDateString()
    : "—";

  return (
    <div className="page orders-page">
      <section className="card orders-hero">
        <div className="orders-hero__copy">
          <p className="eyebrow">Orders</p>
          <h1 className="hero-title">A crisp order history that feels easy to review.</h1>
          <p className="page-subtitle">
            Your recent purchases are shown here in a simple, easy-to-scan view
            with the most important details surfaced first.
          </p>
        </div>

        <div className="stat-grid stat-grid--three orders-hero__stats">
          <StatCard
            icon={ClipboardList}
            label="Total orders"
            value={orders.length}
            description="Purchase history recorded in the account."
            tone="blue"
          />
          <StatCard
            icon={PackageCheck}
            label="Placed orders"
            value={orders.length}
            description="Ready for delivery or fulfillment."
            tone="emerald"
          />
          <StatCard
            icon={CalendarClock}
            label="Latest order"
            value={latestOrderDate}
            description="Most recent checkout date."
            tone="amber"
          />
        </div>
      </section>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Once you place an order, it will appear here for quick review."
          action={
            <Link className="btn btn--primary" to="/products">
              Browse products
            </Link>
          }
        />
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <article className="card order-card" key={order._id}>
              <div className="order-card__top">
                <div className="order-card__id">Order ID: {order._id}</div>
                <span className="order-status">{order.status}</span>
              </div>

              <div className="order-card__meta">
                <span>Total: Rs. {order.totalPrice}</span>
                <span>
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
