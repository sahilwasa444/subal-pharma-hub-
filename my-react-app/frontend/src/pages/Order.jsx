import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/pages/orders.css";

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

  return (
    <div className="page orders-page">
      <section className="section__header">
        <div>
          <p className="eyebrow">Orders</p>
          <h1 className="hero-title">My orders</h1>
          <p className="page-subtitle">
            Your recent purchases are shown here in a simple, easy-to-scan list.
          </p>
        </div>

        <span className="badge">{orders.length} order(s)</span>
      </section>

      {orders.length === 0 ? (
        <div className="card empty-state">
          <h2 className="section-title">No orders yet</h2>
          <p className="page-subtitle">
            Once you place an order, it will appear here for quick review.
          </p>
          <Link className="btn btn--primary" to="/products">
            Browse products
          </Link>
        </div>
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
