import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "../styles/Home.css";

function Home() {
  return (
    <div className="page home-page">
      <section className="home-hero card">
        <div className="hero-copy">
          <p className="eyebrow">Trusted pharmacy dashboard</p>
          <h1 className="hero-title">
            Care that feels modern, calm, and easy to navigate.
          </h1>
          <p className="hero-lead">
            Browse medicines, keep your cart organized, and track orders from
            one clean space built for everyday health purchases.
          </p>

          <div className="hero-actions">
            <Link className="btn btn--primary" to="/products">
              Browse Products
            </Link>
            <Link className="btn btn--ghost" to="/register">
              Create Account
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>Fast search</strong>
              <span>Find products in seconds</span>
            </div>
            <div className="hero-stat">
              <strong>Secure login</strong>
              <span>JWT-based account access</span>
            </div>
            <div className="hero-stat">
              <strong>Order history</strong>
              <span>Review your recent orders</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <span className="hero-glow hero-glow--one" />
          <span className="hero-glow hero-glow--two" />
          <img src={heroImage} alt="Medicine and wellness illustration" />
          <div className="hero-badge">24/7 digital pharmacy support</div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Why this works</p>
            <h2 className="section-title">Built for a better shopping flow</h2>
          </div>
          <p className="page-subtitle">
            The interface keeps the focus on clarity, speed, and trust for both
            desktop and mobile users.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card card">
            <p className="badge">01</p>
            <h3>Clear product browsing</h3>
            <p>
              Search quickly, skim the essentials, and add medicine to the cart
              without clutter.
            </p>
          </article>
          <article className="feature-card card">
            <p className="badge">02</p>
            <h3>Simple account access</h3>
            <p>
              Login and registration stay focused so customers can get back to
              the products they need.
            </p>
          </article>
          <article className="feature-card card">
            <p className="badge">03</p>
            <h3>Order tracking ready</h3>
            <p>
              Orders are displayed in a clean history view so the experience
              feels organized end to end.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
