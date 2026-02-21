import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  /* REVIEWS */
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* AUTH */
  const { user } = useAuth();

  /* LOAD PRODUCT */
  useEffect(() => {
  const loadProduct = async () => {
    try {
      setLoadingProduct(true);

      const res = await fetch(
        `http://localhost:5000/api/products/${id}`
      );

      if (!res.ok) {
        setProduct(null);
        return;
      }

      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product", error);
      setProduct(null);
    } finally {
      setLoadingProduct(false);
    }
  };

  if (id) {
    loadProduct();
  }
}, [id]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldScroll = params.get("review");

    if (shouldScroll) {
      const reviewSection = document.getElementById("review-section");
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  /* LOAD REVIEWS */
  useEffect(() => {
  const loadReviews = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/reviews/${id}`
    );

    if (!res.ok) {
      console.error("Failed to fetch reviews");
      return;
    }

    const data = await res.json();
    setReviews(data);
    if (user) {
      const userReview = data.find(
        (r) => r.user?._id === user._id
      );

      if (userReview) {
        setExistingReview(userReview);
        setRating(userReview.rating);
        setComment(userReview.comment);
}
    }

  } catch (err) {
    console.error("Failed to load reviews", err);
  }
};

  loadReviews();
}, [id]);

  if (loadingProduct) {
  return <p className="empty-text">Loading product...</p>;
}

if (!product) {
  return <p className="empty-text">Product not found</p>;
}

const finalPrice =
  product.discount > 0
    ? Math.round(
        product.price - (product.price * product.discount) / 100
      )
    : product.price;

  /* ADD TO CART (MongoDB) */
  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
          quantity: qty,
        }),
      });

      // optional: cart badge refresh
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  console.log(user?._id, product?._id);

  /* SUBMIT REVIEW */
 const handleSubmitReview = async () => {
  if (!user) {
    alert("Please login to add a review");
    return;
  }

  try {
    let url = "http://localhost:5000/api/reviews";
    let method = "POST";

    if (existingReview) {
      url = `http://localhost:5000/api/reviews/${existingReview._id}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        product: product._id,
        rating,
        comment,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(
      existingReview
        ? "Review updated!"
        : "Review added!"
    );

    // Reload reviews
    window.location.reload();

  } catch (error) {
    console.error("Review submit failed", error);
  }
};

const handleDeleteReview = async (reviewId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your review?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Review deleted!");

    window.location.reload();

  } catch (error) {
    console.error("Delete failed", error);
  }
};

  /* AVERAGE RATING */
  product.rating
  product.numReviews
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((r) => {
    ratingCounts[r.rating]++;
  });

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        {/* IMAGE */}
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="desc">{product.desc}</p>

          {/* PRICE */}
          <div className="price-row">
            <span className="final-price">₹ {finalPrice}</span>

            {product.discount > 0 && (
              <>
                <span className="original-price">
                  ₹ {product.price}
                </span>
                <span className="discount-badge">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* RATING */}
          <div className="avg-rating">
            {"★".repeat(Math.round(product?.rating || 0))}
            {"☆".repeat(5 - Math.round(product?.rating || 0))}
            <span>
              {(product?.rating || 0).toFixed(1)} (
              {product?.numReviews || 0} reviews)
            </span>
          </div>

          {/* QTY */}
          <div className="qty-control">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>
              -
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          {/* ACTIONS */}
          <button className="add-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* REVIEWS */}
      <div id="review-section" className="reviews-section">
        <h3>Customer Reviews</h3>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage =
              product.numReviews > 0
                ? (ratingCounts[star] / product.numReviews) * 100
                : 0;

            return (
              <div key={star} className="breakdown-row">
                <span>{star} ★</span>

                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <span>{ratingCounts[star]}</span>
              </div>
            );
          })}
        </div>

        {/* ADD REVIEW */}
        <div className="review-form">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={s <= rating ? "active" : ""}
                onClick={() => setRating(s)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={handleSubmitReview}>
            {existingReview ? "Update Review" : "Submit Review"}
          </button>
        </div>

        {/* REVIEWS LIST */}
        {reviews.length === 0 && (
          <p className="no-reviews">No reviews yet</p>
        )}

        {reviews.map((r) => (
          <div className="review-item" key={r._id}>

            <div className="review-header">
              <strong>{r.user?.name || "Anonymous"}</strong>

              {r.isVerifiedBuyer && (
                <span className="verified-badge">
                  ✔ Verified Buyer
                </span>
              )}
            </div>

            <div className="stars">
              {"★".repeat(r.rating)}
            </div>

            <p>{r.comment}</p>

            {user && r.user?._id === user._id && (
              <button
                className="delete-review-btn"
                onClick={() => handleDeleteReview(r._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;
