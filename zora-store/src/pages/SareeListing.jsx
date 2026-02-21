import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../utils/api";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "./SareeListing.css";

import { fetchProducts } from "../services/productApi";



function SareeListing() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const navigate = useNavigate();
  const subType = searchParams.get("type"); // subcategory
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedColors, setSelectedColors] = useState([]);


  const { user } = useAuth();

  const getFinalPrice = (price, discount = 0) => {
    if (!discount || discount <= 0) return price;
    return Math.round(price - (price * discount) / 100);
  };

  // 🔢 Quantity handlers
  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };


  const addToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const quantity = quantities[product._id] || 1;

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
          quantity,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Add to cart failed:", err);
        return;
      }

      // refresh cart badge
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // ❤️ wishlist state
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const loadWishlistIds = async () => {
    // IMPORTANT: never block rendering
    if (!user || !user.token) {
      setWishlistIds(new Set());
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await authFetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const ids = new Set(
        (data.items || []).map((i) => i.product._id)
      );

      setWishlistIds(ids);
    } catch (err) {
      console.error("Wishlist ID load error", err);
      setWishlistIds(new Set());
    }
  };

  /* LOAD PRODUCTS */
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);
  useEffect(() => {
    loadWishlistIds();
  }, [user]);


  /* WISHLIST HELPERS */
  const isWishlisted = (productId) => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (productId) => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    // 🔥 OPTIMISTIC UI UPDATE
    setWishlistIds((prev) => {
      const updated = new Set(prev);
      updated.has(productId)
        ? updated.delete(productId)
        : updated.add(productId);
      return updated;
    });
    console.log("Product ID being sent:", productId);

    try {
      await fetch("http://localhost:5000/api/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId }),
      });

      // 🔔 sync header badge
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error(err);
    }
  };



  /* FILTER PRODUCTS */
  let filteredProducts = [...products];

  if (type) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === type
    );
  }
  // PRICE FILTER
  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // COLOR FILTER
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(
      (p) => selectedColors.includes(p.color)
    );
  }

  // PRIORITY 1: If query param exists (from navbar)
if (subType) {
  filteredProducts = filteredProducts.filter(
    (p) => p.subCategory === subType
  );
}

// PRIORITY 2: If user clicks tabs manually
else if (subCategoryFilter !== "all") {
  filteredProducts = filteredProducts.filter(
    (p) => p.subCategory === subCategoryFilter
  );
}

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.desc?.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
  }
  const subcategoryOptions = {
  pattu: [
    { value: "kanchi", label: "Kanchi Pattu" },
    { value: "uppada", label: "Uppada Pattu" },
    { value: "mangalagiri", label: "Mangalagiri Pattu" },
  ],
  fancy: [
    { value: "banaras", label: "Banaras" },
    { value: "victoria", label: "Victoria" },
    { value: "glass-tissue", label: "Glass Tissue" },
  ],
  cotton: [
    { value: "bengal", label: "Bengal Cotton" },
    { value: "meena", label: "Meena Cotton" },
    { value: "printed", label: "Printed Cotton" },
  ],
  work: [
    { value: "jimmy", label: "Jimmy silk" },
    { value: "georgette", label: "Georgette" },
    { value: "chiffon", label: "Chiffon" },
  ],
  dresses: [
    { value: "long-frock", label: "Long Frocks" },
    { value: "three-piece", label: "3 Piece Set" },
    { value: "dress-material", label: "Dress Materials" },
  ],
  croptops: [
    { value: "half-sarees", label: "Half Sarees" },
    { value: "chunnies", label: "Chunnies" },
    { value: "readymade-blouses", label: "Readymade Blouses" },
    { value: "leggings", label: "Leggings" },
    { value: "western-wear", label: "Western Wear" },
  ],
};

  /* UI */
  return (
    <div className="saree-page">
      <div className="listing-layout">

        {/* LEFT FILTER BAR */}
        <aside className="filter-sidebar">

          <h4 className="filter-title">Filters</h4>

          {/* PRICE FILTER */}
          <div className="filter-section">
            <h5>Price</h5>

            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, Number(e.target.value)])
              }
            />

            <p>Up to ₹ {priceRange[1]}</p>
          </div>

          {/* COLOR FILTER */}
          <div className="filter-section">
            <h5>Color</h5>

            {["red", "blue", "green", "black", "pink", "white"].map((color) => (
              <label key={color} className="color-filter">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => {
                    setSelectedColors((prev) =>
                      prev.includes(color)
                        ? prev.filter((c) => c !== color)
                        : [...prev, color]
                    );
                  }}
                />
                <span className={`color-dot ${color}`}></span>
                {color}
              </label>
            ))}
          </div>

          {/* CLEAR FILTER */}
          <button
            className="clear-filter"
            onClick={() => {
              setPriceRange([0, 50000]);
              setSelectedColors([]);
            }}
          >
            Clear Filters
          </button>

        </aside>
        <div>
          <section className="listing-section">

            {/* 🔥 HEADER (NEW – applies to ALL categories) */}
            <div className="listing-header">
              <h2 className="page-title">


                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : type
                    ? `${type.charAt(0).toUpperCase() + type.slice(1)} Collection`
                    : "All Products"}
              </h2>

              {!searchTerm && (
                <p className="page-subtitle">
                  Handwoven elegance • Timeless craftsmanship
                </p>
              )}

              <div className="title-divider"></div>
            </div>
            {subcategoryOptions[type] && (
              <div className="subcategory-tabs">
                <button
                  className={subCategoryFilter === "all" ? "active" : ""}
                  onClick={() => setSubCategoryFilter("all")}
                >
                  All
                </button>

                {subcategoryOptions[type].map((sub) => (
                  <button
                    key={sub.value}
                    className={subCategoryFilter === sub.value ? "active" : ""}
                    onClick={() => setSubCategoryFilter(sub.value)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <p className="empty-text">No products found</p>
            )}

            <div className="products-grid">
              {filteredProducts.map((p) => (
                <div className="product-card" key={p._id}>
                  {/* ❤️ Wishlist */}
                  <button
                    className={`wishlist-btn ${wishlistIds.has(p._id) ? "active" : ""
                      }`}
                    onClick={() => toggleWishlist(p._id)}
                  >
                    <FiHeart />
                  </button>
                  <Link
                    to={`/product/${p._id}`}
                    className="product-link"
                  >
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p>{p.desc}</p>
                    <div className="product-rating">
                      {"★".repeat(Math.round(p.rating || 0))}
                      {"☆".repeat(5 - Math.round(p.rating || 0))}
                      <span className="review-count">
                        ({p.numReviews || 0})
                      </span>
                    </div>
                    <div className="price-row">
                      {p.discount > 0 ? (
                        <>
                          <span className="final-price">
                            ₹ {getFinalPrice(p.price, p.discount)}
                          </span>

                          <span className="original-price">
                            ₹ {p.price}
                          </span>

                          <span className="discount-badge">
                            {p.discount}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="final-price">
                          ₹ {p.price}
                        </span>
                      )}
                    </div>
                    <div className="qty-control">
                      <button onClick={() => decreaseQty(p._id)}>-</button>
                      <span>{quantities[p._id] || 1}</span>
                      <button onClick={() => increaseQty(p._id)}>+</button>
                    </div>

                    <button
                      className={`add-to-cart ${addedId === p._id ? "added" : ""}`}
                      onClick={() => {
                        addToCart({ ...p, qty: quantities[p._id] || 1 });
                        setAddedId(p._id);
                        setTimeout(() => setAddedId(null), 1500);
                      }}
                    >
                      {addedId === p._id ? "✓ Added" : "Add to Cart"}
                    </button>



                  </div>
                </div>
              ))}

            </div>

          </section>

        </div>
      </div>


    </div>
  );
}

export default SareeListing;   