import { Link } from "react-router-dom";
import pillBottleImage from "../assets/medicine-pill-bottle.jpg";
import pharmacyShelfImage from "../assets/pharmacy-shelf.jpg";
import pharmacyInteriorImage from "../assets/pharmacy-interior.jpg";
import "../styles/Home.css";

function Home() {
  const promiseCards = [
    {
      title: "Readable first",
      text:
        "Clear spacing, stronger contrast, and larger text make every medicine detail easier to scan."
    },
    {
      title: "Medicine-focused",
      text:
        "Photos, cards, and product sections keep the experience grounded in real pharmacy shopping."
    },
    {
      title: "Secure by design",
      text:
        "Login, cart, and order history stay protected so repeat purchases feel simple and safe."
    }
  ];

  const galleryCards = [
    {
      title: "Stocked shelves",
      text:
        "A clean pharmacy shelf view makes browsing feel familiar and trustworthy.",
      image: pharmacyShelfImage,
      alt: "Pharmacy shelf stocked with medicine bottles"
    },
    {
      title: "Everyday medicine",
      text:
        "Capsules and bottles help the page feel grounded in everyday health needs.",
      image: pillBottleImage,
      alt: "Medicine capsules spilling from a white bottle"
    },
    {
      title: "Pharmacy support",
      text:
        "Real storefront photography gives Subal Pharma a calm, dependable feel.",
      image: pharmacyInteriorImage,
      alt: "A modern pharmacy interior with stocked medicine shelves"
    }
  ];

  return (
    <div className="page home-page">
      <section className="home-hero card">
        <div className="home-copy">
          <p className="eyebrow">Subal Pharma</p>
          <h1 className="hero-title">
            Medicine shopping that feels calm, clear, and easy to trust.
          </h1>
          <p className="hero-lead">
            Subal Pharma brings trusted medicines, a visible cart flow, and a
            welcoming login experience into one polished space for everyday
            health needs.
          </p>

          <div className="hero-actions">
            <Link className="btn btn--primary" to="/products">
              Browse Products
            </Link>
            <Link className="btn btn--ghost" to="/about">
              About Subal
            </Link>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric">
              <strong>Clear visibility</strong>
              <span>High-contrast text and breathable spacing.</span>
            </div>
            <div className="hero-metric">
              <strong>Fast reordering</strong>
              <span>Jump back to medicines you already trust.</span>
            </div>
            <div className="hero-metric">
              <strong>Secure access</strong>
              <span>Login, cart, and orders stay protected.</span>
            </div>
          </div>
        </div>

        <div className="home-visual">
          <div className="home-visual__main media-frame">
            <img
              src={pharmacyInteriorImage}
              alt="A modern pharmacy interior with stocked medicine shelves"
            />
            <div className="home-visual__badge">Subal care made simple</div>
          </div>

          <div className="home-visual__stack">
            <div className="media-frame home-visual__thumb">
              <img
                src={pillBottleImage}
                alt="Medicine capsules spilling from a white bottle"
              />
            </div>
            <div className="home-note card card--soft">
              <p className="eyebrow">About Subal</p>
              <h2>Built for families who want medicine shopping to feel easy.</h2>
              <p>
                Subal Pharma is designed around trust, readability, and quick
                access to the medicines people reach for every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-section card">
        <div className="home-section__intro">
          <p className="eyebrow">Why Subal works</p>
          <h2 className="section-title">
            A pharmacy experience with calm colors and clear decisions.
          </h2>
          <p>
            The interface keeps the focus on visible text, dependable
            medicine-related imagery, and a warm brand story so customers can
            move from browsing to checkout without friction.
          </p>
        </div>

        <div className="promise-grid">
          {promiseCards.map((card, index) => (
            <article className="promise-card" key={card.title}>
              <p className="badge">0{index + 1}</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Medicine photos</p>
            <h2 className="section-title">A visual style that feels grounded</h2>
          </div>
          <p className="page-subtitle">
            Real pharmacy imagery gives Subal Pharma a clearer, more reassuring
            look across desktop and mobile.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryCards.map((card) => (
            <article className="gallery-card card" key={card.title}>
              <div className="gallery-card__media media-frame">
                <img src={card.image} alt={card.alt} />
              </div>
              <div className="gallery-card__body">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
