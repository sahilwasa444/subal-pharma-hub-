function ProductCard({
  name,
  price,
  company,
  expiry,
  onAddToCart
}) {
  return (
    <div>
      <h2>{name}</h2>

      <p>Price: ₹{price}</p>

      <p>Company: {company}</p>

      <p>Expiry: {expiry}</p>

      <button onClick={onAddToCart}>
        Add To Cart
      </button>

      <hr />
    </div>
  );
}

export default ProductCard;
