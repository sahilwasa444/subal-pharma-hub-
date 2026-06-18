import { Link } from "react-router-dom";
import "../css/pages/about.css";

function About() {
  return (
    <div className="page about-page">
      <section className="about-layout">
        <article className="about-panel card">
          <p className="eyebrow">About Subal Pharma</p>
          <h1 className="hero-title">
            Reliable medicine shopping, designed with care.
          </h1>
          <p>
            This project brings together product browsing, secure login,
            protected cart actions, and order history into one clean experience.
          </p>
          <p>
            The goal is to keep the interface calm and useful, especially on
            mobile screens where clarity matters most.
          </p>

          <div className="about-actions">
            <Link className="btn btn--primary" to="/products">
              Explore Products
            </Link>
            <Link className="btn btn--ghost" to="/cart">
              View Cart
            </Link>
          </div>
        </article>

        <aside className="about-panel card">
          <div>
            <p className="eyebrow">What you get</p>
            <h2 className="section-title">A small app with a polished flow</h2>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <strong>Fast browsing</strong>
              <span>Product search, cards, and category-ready layouts.</span>
            </div>
            <div className="about-card">
              <strong>Secure actions</strong>
              <span>Protected cart and order routes tied to the user.</span>
            </div>
            <div className="about-card">
              <strong>Responsive UI</strong>
              <span>Works smoothly on larger screens and mobile devices.</span>
            </div>
            <div className="about-card">
              <strong>Organized content</strong>
              <span>Shared styles keep the project readable and maintainable.</span>
            </div>
          </div>

          <ul className="about-list">
            <li>Separate CSS files for pages and shared components.</li>
            <li>A consistent visual system across the app.</li>
            <li>Prepared for future data-rich views.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}

export default About;
