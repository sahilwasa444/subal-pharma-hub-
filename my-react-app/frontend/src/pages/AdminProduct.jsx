import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import EmptyState from "../components/ui/EmptyState";
import StatCard from "../components/ui/StatCard";
import {
  Boxes,
  CircleCheckBig,
  PencilLine,
  PlusCircle,
  Trash2
} from "lucide-react";
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
      <section className="card admin-products-panel admin-products-hero">
        <div className="admin-products-hero__copy">
          <p className="eyebrow">Admin</p>
          <h1 className="section-title">
            {editingId ? "Edit product" : "Add product"}
          </h1>
          <p className="page-subtitle">
            Create, update, and delete products. Redis cache is cleared after
            every change so the storefront stays in sync.
          </p>
        </div>

        <div className="stat-grid stat-grid--three admin-products-hero__stats">
          <StatCard
            icon={Boxes}
            label="Inventory"
            value={products.length}
            description="Saved catalog items in MongoDB."
            tone="blue"
          />
          <StatCard
            icon={CircleCheckBig}
            label="Mode"
            value={editingId ? "Editing" : "Create"}
            description="Current form state."
            tone="emerald"
          />
          <StatCard
            icon={editingId ? PencilLine : PlusCircle}
            label="Action"
            value={editingId ? "Update" : "New item"}
            description="Use the form below to save changes."
            tone="amber"
          />
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
          <div className="admin-products-skeleton">
            {Array.from({ length: 4 }).map((_, index) => (
              <article className="card admin-product-card admin-product-card--skeleton" key={index}>
                <div className="skeleton skeleton--line" style={{ width: "30%" }} />
                <div className="skeleton skeleton--line" style={{ width: "75%", height: "1.35rem" }} />
                <div className="stack">
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line" />
                </div>
              </article>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title="No products found"
            description="Add the first product from the form above to populate the catalog."
          />
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
                    <PencilLine size={15} aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    className="btn btn--danger"
                    type="button"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={15} aria-hidden="true" />
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
