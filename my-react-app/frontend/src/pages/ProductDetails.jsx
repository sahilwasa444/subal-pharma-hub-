import { useParams } from "react-router-dom";

function ProductDetails() {

  const { id } = useParams();

  console.log(id);

  return <h1>Product Details</h1>;
}

export default ProductDetails;