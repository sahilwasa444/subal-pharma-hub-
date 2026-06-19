import { motion } from "framer-motion";
import "../styles/ProductCard.css";

function ProductCard({ name, price, company, expiry, onAddToCart }) {
  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <span className="product-card__tag">Medicine</span>
      <h2 className="product-card__title">{name}</h2>

      <div className="product-card__details">
        <p className="product-card__price">Rs. {price}</p>
        <p>Company: {company}</p>
        <p>Expiry: {expiry}</p>
      </div>

      <button className="btn btn--primary product-card__button" onClick={onAddToCart}>
        Add To Cart
      </button>
    </motion.article>
  );
}

export default ProductCard;
