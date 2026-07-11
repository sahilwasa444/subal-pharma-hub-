import { Link, useParams } from "react-router-dom";
import pharmacyShelfImage from "../assets/pharmacy-shelf.jpg";
import { ArrowLeft, Package, ShieldCheck } from "lucide-react";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="page product-details-page">
      <section className="product-details-layout">
        <div className="product-details-visual card">
          <div className="media-frame product-details-visual__image">
            <img
              src={pharmacyShelfImage}
              alt="Pharmacy shelves with medicines and products"
            />
          </div>
          <div className="product-details-visual__badge">
            <ShieldCheck size={16} aria-hidden="true" />
            Trusted medical details
          </div>
        </div>

        <article className="product-details-content card">
          <p className="eyebrow">Product details</p>
          <h1 className="hero-title">Medicine information</h1>
          <p className="page-subtitle">
            This page is ready for a full product lookup by id. For now it keeps
            the experience polished and gives a clear path back to browsing.
          </p>

          <div className="product-details-meta">
            <div className="product-details-id">
              <Package size={16} aria-hidden="true" />
              <span>Product ID: {id}</span>
            </div>
          </div>

          <div className="product-details-actions">
            <Link className="btn btn--primary" to="/products">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to products
            </Link>
            <Link className="btn btn--ghost" to="/cart">
              View cart
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ProductDetails;
