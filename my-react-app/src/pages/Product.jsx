import { useState } from "react";
import ProductCard from "../components/ProductCard";

function Product() {

  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);

  const medicines = [
    {
      id: 1,
      name: "Dolo 650",
      price: 30,
      company: "Micro Labs",
      expiry: "12/2027"
    },
    {
      id: 2,
      name: "Paracetamol",
      price: 50,
      company: "Cipla",
      expiry: "10/2028"
    },
    {
      id: 3,
      name: "Vitamin C",
      price: 120,
      company: "HealthCare",
      expiry: "05/2029"
    },
    {
      id: 4,
      name: "Crocin",
      price: 40,
      company: "GSK",
      expiry: "11/2028"
    }
  ];

  function handleChange(event) {
    setSearch(event.target.value);
  }

  function addToCart(medicine) {
    setCart([...cart, medicine]);
  }

  const filteredMedicines = medicines.filter((medicine) =>
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
          key={medicine.id}
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