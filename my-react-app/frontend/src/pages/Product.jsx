import { useState,useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";
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

  return (
    <div>

      <h1>Products Page</h1>

      <h2>Cart Items : {cart.length}</h2>

      <p>Saved products found: {loading ? "loading..." : filteredMedicines.length}</p>

      <input
        type="text"
        placeholder="Type to filter saved products"
        value={search}
        onChange={handleChange}
      />

      <hr />

      {loading && <p>Loading saved products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && filteredMedicines.length === 0 && (
        <p>No saved products match your search.</p>
      )}

      {filteredMedicines.map((medicine) => (
        <ProductCard
          key={medicine._id}
          name={medicine.name}
          price={medicine.price}
          company={medicine.company}
          expiry={medicine.expiry}
          onAddToCart={() => addToCart(medicine)}
        />
      ))}

    </div>
  );
}

export default Product;
