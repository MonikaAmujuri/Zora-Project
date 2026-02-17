import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import "./RecentProducts.css";

function RecentProducts() {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchRecentProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/products/recent"
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch recent products", error);
    }
  };

  fetchRecentProducts();
}, []);

  
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.token) return;

      try {
        const res = await fetch(
          "http://localhost:5000/api/wishlist",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();

        const ids = (data.items || []).map(
          (i) => i.product._id
        );
        setWishlistIds(ids);
      } catch (err) {
        console.error("Wishlist fetch error", err);
      }
    };

    fetchWishlist();
  }, [user]);

  if (!Array.isArray(products) || products.length === 0) {
  return null;
}

  /* ❤️ helpers */
  const isWishlisted = (id) =>
    wishlist.some((item) => item._id === id);

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/wishlist/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      // 🔥 UPDATE UI IMMEDIATELY
      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );

      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  return (
    <div className="recent-section">
      <div className="recent-divider"></div>
      <h2 className="recent-title"></h2>

      <div className="recent-grid">
        {products.map((p) => (
          <div className="recent-card" key={p._id}>
            <div className="recent-img-wrap">
              <img
                src={p.image}
                alt={p.name}
                onClick={() =>
                  navigate(`/product/${p._id}`)
                }
              />

              <button
                className={`wishlist-btn ${
                  wishlistIds.includes(p._id) ? "active" : ""
                }`}
                onClick={() => toggleWishlist(p._id)}
              >
                <FiHeart />
              </button>
            </div>

            <div className="recent-info">
              <h4>{p.name}</h4>
              <p className="recent-price">₹ {p.price}</p>

              <button
                className="recent-btn"
                onClick={() =>
                  navigate(`/product/${p._id}`)
                }
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentProducts;
