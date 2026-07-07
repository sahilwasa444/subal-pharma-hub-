import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import pharmacyInteriorImage from "../assets/pharmacy-interior.jpg";
import pillBottleImage from "../assets/medicine-pill-bottle.jpg";
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
        <div className="auth-copy">
          <p className="eyebrow">Welcome back</p>
          <h1 className="hero-title">
            Sign in to keep your medicine routine organized.
          </h1>
          <p className="auth-lead">
            Subal Pharma keeps your cart, orders, and account access in one
            calm place so the important details stay easy to see.
          </p>

          <div className="auth-points">
            <div className="auth-point">Protected routes for cart and orders</div>
            <div className="auth-point">Visible text and stronger contrast</div>
            <div className="auth-point">A smoother checkout journey</div>
          </div>
        </div>

        <div className="auth-visual">
          <div className="media-frame auth-visual__main">
            <img
              src={pharmacyInteriorImage}
              alt="A modern pharmacy interior with stocked medicine shelves"
            />
            <div className="auth-visual__badge">
              Safe, simple access to your orders
            </div>
          </div>

          <div className="auth-visual__stack">
            <div className="media-frame auth-visual__thumb">
              <img
                src={pillBottleImage}
                alt="Medicine capsules spilling from a white bottle"
              />
            </div>
            <div className="auth-trust card card--soft">
              <strong>Why log in?</strong>
              <ul>
                <li>Revisit saved medicines quickly.</li>
                <li>Keep checkout and order history together.</li>
                <li>Move between pages without losing progress.</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <section className="auth-card card">
        <div>
          <p className="eyebrow">Login</p>
          <h2 className="section-title">Welcome back</h2>
          <p className="auth-card__lead">
            Enter your account details to continue shopping and manage your
            orders.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="field"
              type="email"
              name="email"
              autoComplete="email"
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
              autoComplete="current-password"
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
