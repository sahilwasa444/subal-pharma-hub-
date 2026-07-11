import { Link } from "react-router-dom";
import pillBottleImage from "../assets/medicine-pill-bottle.jpg";
import pharmacyShelfImage from "../assets/pharmacy-shelf.jpg";
import pharmacyInteriorImage from "../assets/pharmacy-interior.jpg";
import StatCard from "../components/ui/StatCard";
import {
  ArrowRight,
  BarChart3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
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

  const chartPoints = [18, 24, 28, 26, 32, 35, 41, 38, 45, 48, 52, 58];
  const chartPath = chartPoints
    .map((value, index) => `${index * 24},${120 - value}`)
    .join(" ");

  return (
    <div className="page home-page">
      <section className="home-hero card">
        <div className="home-copy">
          <p className="eyebrow">Subal Pharma</p>
          <h1 className="hero-title">
            Medicine shopping that feels calm, clear, and enterprise ready.
          </h1>
          <p className="hero-lead">
            Subal Pharma brings trusted medicines, a visible cart flow, and a
            medical assistant into one polished workspace for everyday health
            needs.
          </p>

          <div className="hero-actions">
            <Link className="btn btn--primary" to="/products">
              Browse Products
            </Link>
            <Link className="btn btn--ghost" to="/about">
              About Subal
            </Link>
          </div>

          <div className="stat-grid stat-grid--three home-hero__stats">
            <StatCard
              icon={ShieldCheck}
              label="Secure access"
              value="Protected"
              description="Login, cart, and orders stay behind auth."
              tone="blue"
            />
            <StatCard
              icon={Stethoscope}
              label="Medical assistant"
              value="Ready"
              description="RAG-backed health answers with safety checks."
              tone="emerald"
            />
            <StatCard
              icon={HeartPulse}
              label="Mobile-ready"
              value="Responsive"
              description="Designed to work smoothly on any screen."
              tone="amber"
            />
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

      <section className="section home-dashboard card">
        <div className="section__header">
          <div>
            <p className="eyebrow">Dashboard snapshot</p>
            <h2 className="section-title">A premium overview for a modern healthcare storefront.</h2>
          </div>
          <span className="badge">
            <Sparkles size={14} aria-hidden="true" />
            Live design preview
          </span>
        </div>

        <div className="stat-grid stat-grid--four home-dashboard__stats">
          <StatCard
            icon={BarChart3}
            label="Catalog readiness"
            value="High"
            description="Inventory and product browsing stay easy to scan."
            tone="blue"
          />
          <StatCard
            icon={ArrowRight}
            label="Checkout flow"
            value="Smooth"
            description="Cart, review, and order steps remain clear."
            tone="emerald"
          />
          <StatCard
            icon={ShieldCheck}
            label="Safety layer"
            value="Enabled"
            description="The assistant keeps urgent cases clearly flagged."
            tone="amber"
          />
          <StatCard
            icon={HeartPulse}
            label="User trust"
            value="Premium"
            description="Glass surfaces and readable contrast reinforce quality."
            tone="slate"
          />
        </div>

        <div className="home-dashboard__grid">
          <article className="card home-chart">
            <div className="home-chart__header">
              <div>
                <p className="eyebrow">Performance trend</p>
                <h3 className="section-title">A simple analytics curve for pharmacy activity.</h3>
              </div>
              <span className="badge">Last 12 weeks</span>
            </div>

            <div className="home-chart__canvas">
              <svg viewBox="0 0 276 132" role="img" aria-label="Illustrative performance trend">
                <defs>
                  <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(37,99,235,0.34)" />
                    <stop offset="100%" stopColor="rgba(37,99,235,0.02)" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((row) => (
                  <line
                    key={row}
                    x1="0"
                    x2="276"
                    y1={row * 26}
                    y2={row * 26}
                    className="home-chart__grid"
                  />
                ))}
                <path
                  d={`M 0 120 ${chartPath.split(" ").map((point) => `L ${point}`).join(" ")} L 264 120 Z`}
                  fill="url(#trendFill)"
                />
                <polyline
                  points={`0,120 ${chartPath}`}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="home-chart__meta">
              <div>
                <strong>Assistant confidence</strong>
                <span>Consistency stays visible through the RAG layer.</span>
              </div>
              <div>
                <strong>Readable UI score</strong>
                <span>High contrast and spacing keep content legible.</span>
              </div>
            </div>
          </article>

          <article className="card home-focus">
            <p className="eyebrow">Platform focus</p>
            <h3 className="section-title">Designed for people who need clarity at a glance.</h3>
            <div className="home-focus__list">
              <div className="home-focus__item">
                <strong>Medicine-first visuals</strong>
                <span>Photos and cards use a clean healthcare style.</span>
              </div>
              <div className="home-focus__item">
                <strong>Premium navigation</strong>
                <span>The top bar keeps key destinations one click away.</span>
              </div>
              <div className="home-focus__item">
                <strong>Assistant confidence</strong>
                <span>Medical answers stay grounded and easy to inspect.</span>
              </div>
            </div>
          </article>
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
