import { useState,useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { CartContext } from "../context/cartcontext";
function Product() {

  const [search, setsearch]=useState("");
  const [products,setproducts] = useState([]);
  const {cart,addToCart} =useContext(CartContext);

  async function fetchProducts(){
    try{
      const response=await api.get("/products");
      setproducts(response.data);
    } catch(error){
      console.log(error);
    }
  }
   
  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(event) {
    setSearch(event.target.value);
  }

  const filteredMedicines = products.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <h1>Products Page</h1>

      <h2>Cart Items : {cart.length}</h2>

      <input
        type="text"
        placeholder="Search Medicine"
        value={search}
        onChange={handleChange}
      />

      <hr />

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