import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  function handleChange(event) {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.user);
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Check your input and try again."
      );
    }
  }

  return (
    <div className="page auth-page">
      <aside className="auth-hero card">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="hero-title">
            Sign in to manage your cart and orders.
          </h1>
        </div>
        <p>
          Use your account to keep products, orders, and checkout in one place
          with a clean and secure experience.
        </p>
        <div className="auth-points">
          <div className="auth-point">Protected routes for cart and orders</div>
          <div className="auth-point">JWT session support</div>
          <div className="auth-point">A smoother checkout journey</div>
        </div>
      </aside>

      <section className="auth-card card">
        <div>
          <p className="eyebrow">Login</p>
          <h2 className="section-title">Welcome back</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="field"
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="field"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-actions">
            <button className="btn btn--primary" type="submit">
              Login
            </button>
            <Link className="auth-link" to="/register">
              Need an account?
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
