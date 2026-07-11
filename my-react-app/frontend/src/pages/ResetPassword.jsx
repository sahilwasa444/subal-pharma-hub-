import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, formData);
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not reset the password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page auth-page--single">
      <section className="auth-card card">
        <div>
          <p className="eyebrow">Reset password</p>
          <h1 className="section-title">Choose a new password</h1>
          <p className="auth-card__lead">
            Create a new password below. Once saved, you can sign back in right
            away.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="reset-password">New password</label>
            <input
              id="reset-password"
              className="field"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reset-confirmPassword">Confirm password</label>
            <input
              id="reset-confirmPassword"
              className="field"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-actions">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Reset password"}
            </button>
            <Link className="auth-link" to="/login">
              Back to login
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ResetPassword;
