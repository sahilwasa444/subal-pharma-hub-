import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/pages/auth.css";
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
      alert(response.data.message);
    } catch (error) {
      alert(error?.response?.data?.message || error.message || error);
    }
  }

  return (
    <div className="page auth-page">
      <aside className="auth-hero card">
        <div>
          <p className="eyebrow">Create account</p>
          <h1 className="hero-title">
            Join Subal Pharma and keep your orders tidy.
          </h1>
        </div>
        <p>
          Register once to save your cart, place protected orders, and return
          to the products you need without starting over.
        </p>
        <div className="auth-points">
          <div className="auth-point">Fast checkout</div>
          <div className="auth-point">Saved order history</div>
          <div className="auth-point">A clear shopping experience</div>
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
