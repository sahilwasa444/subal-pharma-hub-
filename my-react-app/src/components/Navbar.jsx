import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>

      <h2>Subal Pharma</h2>

      <Link to="/">Home</Link>

      <Link to="/products">Products</Link>

      <Link to="/cart">Cart</Link>

      <Link to="/orders">Orders</Link>

      <Link to="/about">About</Link>

    </nav>
  );
}

export default Navbar;