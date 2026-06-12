import { useState } from "react";
import Hero from "./hero.jsx";
import Feature from "./featureproduct.jsx";
import Category from "./categories.jsx";

function Home() {
  const [companyName, setCompanyName] = useState("Subal Pharma");

  function handleChange(event) {
    setCompanyName(event.target.value);
  }

  return (
    <div className="page-component">
      <input
        type="text"
        value={companyName}
        onChange={handleChange}
      />

      <Hero company={companyName} />
      
      <Category />
      <Feature />
      
    </div>
  );
}

export default Home;