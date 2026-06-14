import ProductCard from "./productcaart"

function Featureproduct(){
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
    }
  ];

  return (
    <div>
      <h1>Featured Products</h1>

      {medicines.map((medicine) => (
        <ProductCard
          key={medicine.id}
          name={medicine.name}
          price={medicine.price}
          company={medicine.company}
          expiry={medicine.expiry}
        />
      ))}
    </div>
  );
}

export default FeaturedProducts;