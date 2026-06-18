import { Link, useParams } from "react-router-dom";
import "../css/pages/productDetails.css";

function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="page product-details-page">
      <section className="product-details-layout">
        <div className="product-details-visual card">
          <strong>Product preview</strong>
        </div>

        <article className="product-details-content card">
          <p className="eyebrow">Product details</p>
          <h1 className="hero-title">Medicine information</h1>
          <p className="page-subtitle">
            This page is ready for a full product lookup by id. For now it keeps
            the experience polished and gives a clear path back to browsing.
          </p>

          <div className="product-details-id">Product ID: {id}</div>

          <div className="product-details-actions">
            <Link className="btn btn--primary" to="/products">
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
