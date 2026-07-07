import { useState } from "react";
import { Link } from "react-router-dom";
import pharmacyInteriorImage from "../assets/pharmacy-interior.jpg";
import pillBottleImage from "../assets/medicine-pill-bottle.jpg";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/Auth.css";
function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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
      const response = await api.post(
        "/auth/register",
        formData
      );
      toast.success(response.data.message || "Registration successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Registration failed");
    }
  }

  return (
    <div className="page auth-page">
      <aside className="auth-hero">
        <div className="auth-copy">
          <p className="eyebrow">Create account</p>
          <h1 className="hero-title">
            Join Subal Pharma and keep every order easy to revisit.
          </h1>
          <p className="auth-lead">
            Register once to save your cart, place protected orders, and return
            to the medicines you rely on without starting over.
          </p>
        </div>

        <div className="auth-visual">
          <div className="media-frame auth-visual__main">
            <img
              src={pharmacyInteriorImage}
              alt="A modern pharmacy interior with stocked medicine shelves"
            />
            <div className="auth-visual__badge">
              Your account, cart, and orders in one place
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
              <strong>Why register?</strong>
              <ul>
                <li>Save cart items without losing your place.</li>
                <li>Return to your recent orders quickly.</li>
                <li>Keep the checkout flow smooth and secure.</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <section className="auth-card card">
        <div>
          <p className="eyebrow">Register</p>
          <h2 className="section-title">Create your account</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              className="field"
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="field"
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="field"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirmPassword">Confirm Password</label>
            <input
              id="register-confirmPassword"
              className="field"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="auth-actions">
            <button className="btn btn--primary" type="submit">
              Register
            </button>
            <Link className="auth-link" to="/login">
              Already have an account?
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;
