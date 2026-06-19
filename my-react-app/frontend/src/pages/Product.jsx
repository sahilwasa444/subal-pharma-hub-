import { useState,useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";
import { toast } from "react-toastify";
import "../styles/Products.css";
function Product() {

  const [search, setSearch] = useState("");
  const [products,setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {cart,addToCart} =useContext(CartContext);

  async function fetchProducts(){
    try{
      setError("");
      const response=await api.get("/products");
      setproducts(response.data);
    } catch(error){
      console.error(error);
      setError("Could not load saved products from MongoDB.");
    } finally {
      setLoading(false);
    }
  }
   
  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(event) {
    setSearch(event.target.value);
  }

  const filteredMedicines = products.filter((medicine) =>
    (medicine.name || "").toLowerCase().includes(search.toLowerCase())
  );

  function handleAddToCart(medicine) {
    addToCart(medicine);
    toast.success(`${medicine.name} added to cart`);
  }

  return (
    <div className="page products-page">
      <section className="section__header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="hero-title">Products</h1>
          <p className="page-subtitle">
            Search the saved products loaded from MongoDB and add the items you
            need to the cart.
          </p>
        </div>

        <div className="products-meta">
          <span className="badge">Cart items: {cart.length}</span>
          <span className="badge">
            Visible: {loading ? "..." : filteredMedicines.length}
          </span>
        </div>
      </section>

      <div className="card products-toolbar">
        <div className="products-search">
          <input
            className="field"
            type="text"
            placeholder="Type to filter saved products"
            value={search}
            onChange={handleChange}
          />
        </div>
        <p className="page-subtitle">
          Keep the page focused by filtering only the medicines you want.
        </p>
      </div>

      {loading && (
        <div className="card empty-state products-state">
          Loading saved products...
        </div>
      )}

      {error && <div className="card empty-state products-state">{error}</div>}

      {!loading && !error && filteredMedicines.length === 0 && (
        <div className="card empty-state products-state">
          No saved products match your search.
        </div>
      )}

      <div className="product-grid">
        {filteredMedicines.map((medicine) => (
          <ProductCard
            key={medicine._id}
            name={medicine.name}
            price={medicine.price}
            company={medicine.company}
            expiry={medicine.expiry}
            onAddToCart={() => handleAddToCart(medicine)}
          />
        ))}
      </div>
    </div>
  );
}

export default Product;
