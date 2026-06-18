import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Total: Rs.{order.totalPrice}</p>
            <p>Status: {order.status}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
