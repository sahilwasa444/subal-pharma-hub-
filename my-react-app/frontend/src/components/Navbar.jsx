import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/AuthContext";
import "../css/components/Navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  function linkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <nav className="site-nav">
      <Link to="/" className="brand" aria-label="Subal Pharma home">
        <span className="brand__mark">P</span>
        <span className="brand__text">
          <span>Subal Pharma</span>
          <small>care that feels calm</small>
        </span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
      </div>

      <div className="nav-actions">
        <NavLink to="/cart" className={linkClass}>
          <span className="nav-cart">
            Cart
            <span className="nav-cart__count">{cart.length}</span>
          </span>
        </NavLink>

        {user ? (
          <>
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
            <span className="nav-pill">Hi, {user.name}</span>
            <button className="nav-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
