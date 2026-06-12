import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Navbar() {

  const { cart } = useContext(CartContext);

  return (
    <nav>

      <h2>Subal Pharma</h2>

      <Link to="/">Home</Link>

      <Link to="/products">Products</Link>

      <Link to="/cart">
        Cart ({cart.length})
      </Link>

      <Link to="/orders">Orders</Link>

      <Link to="/about">About</Link>

    </nav>
  );
}

export default Navbar;