import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  ClipboardList,
  CircleUserRound,
  Home,
  Info,
  LogOut,
  PackagePlus,
  Pill,
  ShoppingCart,
  Sparkles,
  Stethoscope
} from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
  const { cartSummary } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  function linkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <nav className="site-nav">
      <Link to="/" className="brand" aria-label="Subal Pharma home">
        <span className="brand__mark">
          <Pill aria-hidden="true" />
        </span>
        <span className="brand__text">
          <span>Subal Pharma</span>
          <small>premium healthcare commerce</small>
        </span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          <Home aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          <Box aria-hidden="true" />
          <span>Products</span>
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          <Info aria-hidden="true" />
          <span>About</span>
        </NavLink>
        <NavLink to="/medical-assistant" className={linkClass}>
          <Stethoscope aria-hidden="true" />
          <span>Medical Assistant</span>
        </NavLink>
      </div>

      <div className="nav-actions">
        <NavLink to="/cart" className={linkClass}>
          <span className="nav-cart">
            <ShoppingCart aria-hidden="true" />
            <span>Cart</span>
            <span className="nav-cart__count">{cartSummary.itemCount}</span>
          </span>
        </NavLink>

        {user ? (
          <>
            {user.role === "admin" && (
              <NavLink to="/admin/products" className={linkClass}>
                <PackagePlus aria-hidden="true" />
                <span>Manage Products</span>
              </NavLink>
            )}
            <NavLink to="/orders" className={linkClass}>
              <ClipboardList aria-hidden="true" />
              <span>Orders</span>
            </NavLink>
            <span className="nav-pill">
              <CircleUserRound aria-hidden="true" />
              <span>Hi, {user.name}</span>
            </span>
            <button className="nav-button" onClick={logout}>
              <LogOut aria-hidden="true" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              <CircleUserRound aria-hidden="true" />
              <span>Login</span>
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              <Sparkles aria-hidden="true" />
              <span>Register</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
