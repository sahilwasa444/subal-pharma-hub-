import { motion } from "framer-motion";
import { Building2, CalendarClock, CircleDollarSign, ShoppingCart } from "lucide-react";
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
        <p className="product-card__price">
          <CircleDollarSign size={16} aria-hidden="true" />
          <span>Rs. {price}</span>
        </p>
        <p>
          <Building2 size={14} aria-hidden="true" />
          <span>{company}</span>
        </p>
        <p>
          <CalendarClock size={14} aria-hidden="true" />
          <span>Expiry {expiry}</span>
        </p>
      </div>

      <button className="btn btn--primary product-card__button" onClick={onAddToCart}>
        <ShoppingCart size={16} aria-hidden="true" />
        Add to cart
      </button>
    </motion.article>
  );
}

export default ProductCard;
