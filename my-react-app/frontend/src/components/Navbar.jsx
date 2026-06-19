import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/AuthContext";
import {
  FaBox,
  FaClipboardList,
  FaHome,
  FaInfoCircle,
  FaPills,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  function linkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <nav className="site-nav">
      <Link to="/" className="brand" aria-label="Subal Pharma home">
        <span className="brand__mark">
          <FaPills aria-hidden="true" />
        </span>
        <span className="brand__text">
          <span>Subal Pharma</span>
          <small>care that feels calm</small>
        </span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          <FaHome aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          <FaBox aria-hidden="true" />
          <span>Products</span>
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          <FaInfoCircle aria-hidden="true" />
          <span>About</span>
        </NavLink>
      </div>

      <div className="nav-actions">
        <NavLink to="/cart" className={linkClass}>
          <span className="nav-cart">
            <FaShoppingCart aria-hidden="true" />
            <span>Cart</span>
            <span className="nav-cart__count">{cart.length}</span>
          </span>
        </NavLink>

        {user ? (
          <>
            <NavLink to="/orders" className={linkClass}>
              <FaClipboardList aria-hidden="true" />
              <span>Orders</span>
            </NavLink>
            <span className="nav-pill">
              <FaUser aria-hidden="true" />
              <span>Hi, {user.name}</span>
            </span>
            <button className="nav-button" onClick={logout}>
              <FaSignOutAlt aria-hidden="true" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              <FaUser aria-hidden="true" />
              <span>Login</span>
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              <FaUser aria-hidden="true" />
              <span>Register</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
