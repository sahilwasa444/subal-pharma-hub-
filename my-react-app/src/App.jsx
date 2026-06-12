import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import About from "./pages/About";
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Product />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/orders" element={<Order />} />

        <Route path="/about" element={<About />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;