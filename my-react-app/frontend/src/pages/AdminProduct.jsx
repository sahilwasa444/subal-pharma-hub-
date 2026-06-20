import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import "../styles/AdminProduct.css";

const emptyForm = {
  name: "",
  price: "",
  company: "",
  expiry: "",
  description: "",
  stock: ""
};

function AdminProduct() {
  const [formData, setFormData] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not load products");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditingId(null);
  }

  function startEdit(product) {
    setEditingId(product._id);
    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      company: product.company || "",
      expiry: product.expiry || "",
      description: product.description || "",
      stock: product.stock ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload, authConfig);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload, authConfig);
        toast.success("Product created successfully");
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`, authConfig);
      if (editingId === id) {
        resetForm();
      }
      toast.success("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not delete product");
    }
  }

  return (
    <div className="page admin-products-page">
      <section className="card admin-products-panel">
        <div className="section__header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="section-title">
              {editingId ? "Edit Product" : "Add Product"}
            </h1>
            <p className="page-subtitle">
              Create, update, and delete products. Redis cache is cleared after
              every change.
            </p>
          </div>
          <span className="badge">{editingId ? "Editing mode" : "Create mode"}</span>
        </div>

        <form className="stack admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-product-form__grid">
            <input
              className="field"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product name"
            />
            <input
              className="field"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <input
              className="field"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company"
            />
            <input
              className="field"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="Expiry"
            />
            <input
              className="field"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
            />
          </div>

          <textarea
            className="field"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <div className="admin-product-form__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                  ? "Update Product"
                  : "Save Product"}
            </button>

            {editingId && (
              <button className="btn btn--ghost" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card admin-products-panel">
        <div className="section__header">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2 className="section-title">Saved products</h2>
          </div>
          <span className="badge">{products.length} items</span>
        </div>

        {loadingProducts ? (
          <div className="empty-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products found.</div>
        ) : (
          <div className="admin-products-grid">
            {products.map((product) => (
              <article
                className={`card admin-product-card ${editingId === product._id ? "admin-product-card--active" : ""}`}
                key={product._id}
              >
                <div>
                  <span className="badge">Medicine</span>
                  <h3>{product.name}</h3>
                  <p className="admin-product-card__meta">
                    Rs. {product.price} | {product.company}
                  </p>
                  <p className="admin-product-card__meta">
                    Expiry: {product.expiry} | Stock: {product.stock}
                  </p>
                  {product.description && (
                    <p className="admin-product-card__description">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="admin-product-card__actions">
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--danger"
                    type="button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminProduct;
