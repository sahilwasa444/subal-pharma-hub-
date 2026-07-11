import { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import StatCard from "../components/ui/StatCard";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";
import { toast } from "react-toastify";
import { Layers3, PackageSearch, ShoppingCart, Sparkles } from "lucide-react";
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
  const visibleCount = loading ? 0 : filteredMedicines.length;

  function handleAddToCart(medicine) {
    addToCart(medicine);
    toast.success(`${medicine.name} added to cart`);
  }

  return (
    <div className="page products-page">
      <section className="card products-hero">
        <div className="products-hero__copy">
          <p className="eyebrow">Catalog</p>
          <h1 className="hero-title">A polished medicine catalog built for fast decisions.</h1>
          <p className="page-subtitle">
            Search the saved products loaded from MongoDB, scan the key details,
            and move the right medicine into the cart without friction.
          </p>
        </div>

        <div className="stat-grid stat-grid--three products-hero__stats">
          <StatCard
            icon={ShoppingCart}
            label="Cart items"
            value={cart.length}
            description="Items ready for checkout."
            tone="blue"
          />
          <StatCard
            icon={PackageSearch}
            label="Visible results"
            value={loading ? "..." : visibleCount}
            description="Matches for your current search."
            tone="emerald"
          />
          <StatCard
            icon={Layers3}
            label="Catalog size"
            value={loading ? "..." : products.length}
            description="Saved product records in MongoDB."
            tone="amber"
          />
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
        <div className="products-skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="card product-card product-card--skeleton" key={index}>
              <div className="skeleton skeleton--line" style={{ width: "35%" }} />
              <div className="skeleton skeleton--line" style={{ width: "78%", height: "1.4rem" }} />
              <div className="stack" style={{ width: "100%" }}>
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line" />
              </div>
              <div className="skeleton skeleton--line" style={{ width: "100%", height: "2.8rem", marginTop: "auto" }} />
            </article>
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          icon={Sparkles}
          title="Could not load products"
          description={error}
          action={<button className="btn btn--primary" onClick={fetchProducts}>Try again</button>}
          className="products-state"
        />
      )}

      {!loading && !error && filteredMedicines.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title="No saved products match your search"
          description="Try a shorter medicine name or clear the search field to browse the full catalog."
          action={
            <button
              className="btn btn--primary"
              onClick={() => setSearch("")}
              type="button"
            >
              Clear search
            </button>
          }
          className="products-state"
        />
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
