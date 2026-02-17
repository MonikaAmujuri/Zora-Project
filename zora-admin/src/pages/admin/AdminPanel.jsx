import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "../../../../zora-admin/src/services/productApi";

import "./AdminPanel.css";

function AdminPanel() {
  /* -------------------- STATE -------------------- */
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");



  const [form, setForm] = useState({
    name: "",
    price: 0,
    desc: "",
    image: "",
    category: "pattu",
    subCategory: "",
    color:"",
    discount: 0,      // ✅ NEW
    stock: 10
  });



  /* -------------------- URL CATEGORY FILTER -------------------- */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get("category");
  const filterType = searchParams.get("filter");

  /* -------------------- LOAD PRODUCTS -------------------- */
  useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    const data = await fetchProducts();
    setProducts(data);
  } catch (err) {
    console.error("Failed to load products", err);
  }
};



  /* -------------------- FILTER PRODUCTS -------------------- */
  let filteredProducts = [...products];
  // 🔍 Search filter
  if (searchTerm.trim() !== "") {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Products on Sale filter (from dashboard)
  if (filterType === "onsale") {
    filteredProducts = filteredProducts.filter(
      (p) => p.discount && p.discount > 0
    );
  }


  // 1️⃣ Category filter (from dashboard or navbar)
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === categoryFilter
    );
  }

  // 2️⃣ Dashboard filters
  if (filterType === "new") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    filteredProducts = filteredProducts.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= sevenDaysAgo
    );
  }

  if (filterType === "outofstock") {
    filteredProducts = filteredProducts.filter(
      (p) => p.stock === 0
    );
  }

  /* -------------------- HELPERS -------------------- */
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      desc: "",
      image: "",
      category: "pattu",
      subCategory: ""
    });
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

    const handleSave = async () => {
  if (!form.name || !form.price || !form.image || !form.category) {
    alert("Please fill all required fields");
    return;
  }

  const payload = {
    ...form,
    price: Number(form.price),          // 🔥 FIX
    discount: Number(form.discount || 0),
    stock: Number(form.stock || 10),
  };

  try {
    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await addProduct(payload);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      desc: "",
      image: "",
      category: "pattu",
      subCategory: "",
      discount: 0,
      stock: 10,
    });

    fetchProducts(); // re-fetch products from MongoDB
  } catch (err) {
    console.error("Save failed", err);
    alert("Failed to add product");
  }
};


  const handleEdit = (product) => {
    setForm(product);
    setPreview(product.image);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this product?")) return;

  try {
    await deleteProduct(id);
    fetchProducts();
  } catch (err) {
    console.error("Delete failed", err);
    alert("Failed to delete product");
  }
};


  /* -------------------- UI -------------------- */
  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h1>Products</h1>
        {/* TOP ACTION BAR */}
        <div className="admin-top-bar">

          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={categoryFilter || ""}
              onChange={(e) => {
                const value = e.target.value;

                if (value) {
                  navigate(`/admin/products?category=${value}`);
                } else {
                  navigate("/admin/products");
                }
              }}
            >
              <option value="">All Categories</option>
              <option value="pattu">Pattu Sarees</option>
              <option value="fancy">Fancy Sarees</option>
              <option value="cotton">Cotton Sarees</option>
              <option value="work">Work Sarees</option>
              <option value="dresses">Dresses</option>      
              <option value="croptops">Crop Tops</option> 
            </select>

          </div>

          <button
            className="add-product-btn"
            onClick={() => {
              console.log("Add Product clicked");
              setShowForm(true);
            }}
          >
            + Add Product
          </button>


        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="admin-card">
          <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
          {formError && (
            <p className="form-error">
              {formError}
            </p>
          )}
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) }) // ✅ number
            }
          />

          <input
            type="number"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: Number(e.target.value) })
            }
          />


          <textarea
            placeholder="Description"
            value={form.desc}
            onChange={(e) =>
              setForm({ ...form, desc: e.target.value })
            }
          />
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="pattu">Pattu Sarees</option>
            <option value="fancy">Fancy Sarees</option>
            <option value="cotton">Cotton Sarees</option>
            <option value="work">Work Sarees</option>
            <option value="dresses">Dresses</option>      
            <option value="croptops">Crop Tops</option>
          </select>

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();

              reader.onloadend = () => {
                setPreview(reader.result);
                setForm({
                  ...form,
                  image: reader.result // ✅ base64 saved
                });
              };

              reader.readAsDataURL(file);

            }}
          />
          {/* SUB CATEGORY — ONLY FOR DRESSES */}
          {form.category === "dresses" && (
            <select
              value={form.subCategory}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value })
              }
            >
              <option value="">Select Dress Type</option>
              <option value="long-frock">Long Frocks</option>
              <option value="three-piece">3 Piece Set</option>
              <option value="dress-material">Dress Materials</option>
            </select>
          )}

          {/* 👚 Crop Tops Subcategory */}
          {form.category === "croptops" && (
            <select
              value={form.subCategory}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value })
              }
            >
              <option value="">Select Crop Top Type *</option>
              <option value="half-sarees">Half Sarees</option>
              <option value="chunnies">Chunnies</option>
              <option value="readymade-blouses">Readymade Blouses</option>
              <option value="leggings">Leggings</option>
              <option value="western-wear">Western Wear</option>
            </select>
          )}

          <select
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          >
            <option value="">Select Color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="black">Black</option>
            <option value="pink">Pink</option>
            <option value="white">White</option>
          </select>

          {preview && (
            <img src={preview} className="preview-img" />
          )}

          <div className="admin-actions">
            <button className="save-btn" onClick={handleSave}>
              {editingId ? "Update Product" : "Add Product"}
            </button>

            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="admin-products-grid">
        {filteredProducts.length === 0 && (
          <p className="empty-text">No products found</p>
        )}
        

        {filteredProducts.map((p) => {
          const finalPrice =
            p.discount > 0
              ? Math.round(p.price - (p.price * p.discount) / 100)
              : p.price;
          if (filterType === "onsale") {
            filteredProducts = filteredProducts.filter(
              (p) => p.discount > 0
            );
          }


          return (
            <div className="admin-product-card" key={p._id}>
              <img src={p.image} alt={p.name} />

              <div className="card-info">
                <h4>{p.name}</h4>
                <p>{p.desc}</p>

                <span className="price">
                  ₹ {finalPrice}
                  {p.discount > 0 && <del> ₹ {p.price}</del>}
                </span>

                {p.discount > 0 && (
                  <span className="discount-badge">
                    {p.discount}% OFF
                  </span>
                )}

                <small>{p.category}</small>
                {p.subCategory && (
                  <small className="subcategory">
                    {p.subCategory.replace("-", " ")}
                  </small>
                )}

              </div>

              <div className="card-actions">
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button
                  className="danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default AdminPanel;
