import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import "./AdminReviews.css";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    loadReviews();
    loadStats();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/reviews"
      );
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Fetch reviews error:", error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/review-stats"
      );
      const data = await res.json();
      setReviewStats(data);
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const deleteReview = async (id) => {
    try {
      await authFetch(
        `http://localhost:5000/api/admin/reviews/${id}`,
        { method: "DELETE" }
      );

      setReviews(reviews.filter((r) => r._id !== id));
      loadStats(); // refresh stats after delete
    } catch (error) {
      console.error("Delete review error:", error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Reviews</h1>

      <div className="stats-grid">
        <div className="stat-card blue">
          <p>Total Reviews</p>
          <h2>{reviewStats.totalReviews}</h2>
        </div>

        <div className="stat-card gold">
          <p>Average Rating</p>
          <h2>⭐ {reviewStats.averageRating}</h2>
        </div>
      </div>

      <div className="admin-card">
        {reviews.length === 0 ? (
          <p>No reviews found</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.user?.name || review.user?.email}</td>

                  <td className="product-cell">
                    <img
                      src={review.product?.image}
                      alt={review.product?.name}
                      className="review-product-img"
                    />
                    <span>{review.product?.name}</span>
                  </td>

                  <td>⭐ {review.rating}</td>
                  <td>{review.comment}</td>

                  <td>
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;