import { useState } from "react";

const [product,setProduct] = useState({
    name:"",
    price:"",
    company:"",
    expiry:"",
    description:"",
    stock:""
});
function HandleChange(event) {
    const {name, value} = event.target;
    setProduct({
        ...product,[name]:value
    });
async function handlesubmit(event){
    event.preventDefault();
    try {
        await api.post("/products",product);
        alert("product added");
    } catch (error) {
        alert(error.message);
    }
}
   return (
    <div>
        <input
  type="text"
  name="name"
  placeholder="Medicine Name"
  value={product.name}
  onChange={handleChange}
/>

<input
  type="number"
  name="price"
  placeholder="Price"
  value={product.price}
  onChange={handleChange}
/>

<input
  type="text"
  name="company"
  placeholder="Company"
  value={product.company}
  onChange={handleChange}
/>

<input
  type="text"
  name="expiry"
  placeholder="Expiry"
  value={product.expiry}
  onChange={handleChange}
/>

<input
  type="number"
  name="stock"
  placeholder="Stock"
  value={product.stock}
  onChange={handleChange}
/>

<textarea
  name="description"
  placeholder="Description"
  value={product.description}
  onChange={handleChange}
/>
     
    </div>
   )
}