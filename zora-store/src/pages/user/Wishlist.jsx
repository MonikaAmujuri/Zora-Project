import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import UserHeader from "../../components/user/UserHeader";
import { useAuth } from "../../context/AuthContext";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate(); 

    // 🛒 Add to Cart 
    const addToCart = async (product) => {
        if (!user || !user.token) {
            navigate("/login");
            return;
        }

        try {
            await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    userId: user._id,      // ✅ FIX
                    productId: product.id,
                    quantity: 1,
                }),
            });

            await removeFromWishlist(product.id);

            window.dispatchEvent(new Event("cartUpdated"));
            navigate("/cart");
        } catch (err) {
            console.error("Add to cart failed", err);
        }
    };

  // ❤️ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user || !user.token) return;

    await fetch("http://localhost:5000/api/wishlist/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId }),
    });

    // refresh wishlist + header badge
    loadWishlist();
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // 📥 Load wishlist
  const loadWishlist = async () => {
    if (!user || !user.token) {
      setWishlist([]);
      return;
    }

    const res = await fetch("http://localhost:5000/api/wishlist", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();

    // 🔄 transform backend data to frontend-friendly shape
    const mapped = (data.items || []).map((i) => ({
      id: i.product._id,
      name: i.product.name,
      image: i.product.image,
      price: i.product.price,
      desc: i.product.description || "",
    }));

    setWishlist(mapped);
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  return (
    <div className="wishlist-page">
      <UserHeader />

      <section className="listing-section">
        {/* Header */}
        <div className="listing-header">
          <h2 className="page-title">My Wishlist</h2>
          <p className="page-subtitle">
            Your saved favorites, curated just for you
          </p>
          <div className="title-divider"></div>
        </div>

        {wishlist.length === 0 ? (
          <p className="empty-text">No items in wishlist</p>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((p) => (
              <div className="wishlist-card" key={p.id}>
                {p.image && <img src={p.image} alt={p.name} />}

                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <p className="price">₹ {p.price}</p>

                <div className="wishlist-actions">
                  <button
                    className="cart-btn"
                    onClick={() => addToCart(p)}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromWishlist(p.id)}
                  >
                    <FiHeart /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Wishlist;