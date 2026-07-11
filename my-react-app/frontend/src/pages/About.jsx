import { Link } from "react-router-dom";
import pharmacyInteriorImage from "../assets/pharmacy-interior.jpg";
import pharmacyShelfImage from "../assets/pharmacy-shelf.jpg";
import pillBottleImage from "../assets/medicine-pill-bottle.jpg";
import "../styles/About.css";

function About() {
  return (
    <div className="page about-page">
      <section className="about-layout">
        <article className="about-panel card">
          <p className="eyebrow">About Subal Pharma</p>
          <h1 className="hero-title">
            Reliable medicine shopping, designed with care and enterprise polish.
          </h1>
          <p>
            This project brings together product browsing, secure login,
            protected cart actions, order history, and a medical assistant into
            one modern healthcare experience.
          </p>
          <p>
            The goal is to keep the interface calm, premium, and easy to scan
            on desktop and mobile devices alike.
          </p>

          <div className="about-actions">
            <Link className="btn btn--primary" to="/products">
              Explore Products
            </Link>
            <Link className="btn btn--ghost" to="/medical-assistant">
              Open Assistant
            </Link>
          </div>
        </article>

        <aside className="about-panel about-panel--visual card">
          <div className="about-visual-grid">
            <div className="media-frame about-visual about-visual--large">
              <img
                src={pharmacyInteriorImage}
                alt="A modern pharmacy interior with stocked medicine shelves"
              />
            </div>
            <div className="about-visual-stack">
              <div className="media-frame about-visual about-visual--small">
                <img
                  src={pillBottleImage}
                  alt="Medicine capsules spilling from a white bottle"
                />
              </div>
              <div className="media-frame about-visual about-visual--small">
                <img
                  src={pharmacyShelfImage}
                  alt="Pharmacy shelves stocked with medicine boxes"
                />
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="section about-grid-shell card">
        <div className="section__header">
          <div>
            <p className="eyebrow">What you get</p>
            <h2 className="section-title">A small app with a polished flow</h2>
          </div>
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
      </section>
    </div>
  );
}

export default About;
