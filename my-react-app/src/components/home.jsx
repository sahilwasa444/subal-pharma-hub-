import Hero from "./hero.jsx"
import Feature from "./featureproduct.jsx"
import Category from "./categories.jsx";
import { useState } from "react";
function Home() {
    const [companyname,setcompanyname] =useState("subal pharma");
    return (
        <div className="page-component">
            <Hero company={companyname}/>
            <Feature />
        </div>
    );
}

export default Home;