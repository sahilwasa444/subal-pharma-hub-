import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", {
        email
      });

      const resetUrl = response.data?.resetUrl;
      if (resetUrl) {
        const pathname = new URL(resetUrl, window.location.origin).pathname;
        toast.success("Reset link ready. Opening the password reset screen.");
        navigate(pathname);
        return;
      }

      toast.success(
        response.data?.message ||
          "If the email exists, a password reset link has been sent."
      );
      setEmail("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not start the password reset flow."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page auth-page--single">
      <section className="auth-card card">
        <div>
          <p className="eyebrow">Forgot password</p>
          <h1 className="section-title">Send yourself a reset link</h1>
          <p className="auth-card__lead">
            Enter the email on your account and we&apos;ll send a secure link to
            reset your password.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              className="field"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-actions">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
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

export default ForgotPassword;
