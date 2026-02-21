import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SalesGraph from "../../components/admin/SalesGraph";
import { authFetch } from "../../utils/api";
import "./AdminDashboard.css";


function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => {
  const saved = localStorage.getItem("adminDashboardStats");
  return saved ? JSON.parse(saved) : null;
});
  

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await authFetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setStats(data);

      // 🔥 Save to localStorage
      localStorage.setItem(
        "adminDashboardStats",
        JSON.stringify(data)
      );

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  fetchStats();
}, []);

  // 🔹 Stats
const totalProducts = stats?.totalProducts || 0;
const productsOnSale = stats?.productsOnSale || 0;
const pattuCount = stats?.pattuCount || 0;
const fancyCount = stats?.fancyCount || 0;
const cottonCount = stats?.cottonCount || 0;
const totalUsers = stats?.totalUsers || 0;
const totalOrders = stats?.totalOrders || 0;
const recentProducts = stats?.recentProducts || [];
const outOfStockProducts = stats?.outOfStockProducts || [];


  return (
    <div className="admin-dashboard">

      {/* ================= STATS CARDS ================= */}
      <div className="stats-grid">
        <div className="stat-card purple" onClick={() => navigate("/admin/products")}>
          <p>Total Products</p>
          <h2>{totalProducts}</h2>
        </div>

        <div className="stat-card red" onClick={() => navigate("/admin/products?category=pattu")}>
          <p>Pattu Sarees</p>
          <h2>{pattuCount}</h2>
        </div>

        <div className="stat-card blue" onClick={() => navigate("/admin/products?category=fancy")}>
          <p>Fancy Sarees</p>
          <h2>{fancyCount}</h2>
        </div>

        <div className="stat-card green" onClick={() => navigate("/admin/products?category=cotton")}>
          <p>Cotton Sarees</p>
          <h2>{cottonCount}</h2>
        </div>

        <div className="stat-card purple"
          onClick={() => navigate("/admin/users")}
        >
          <p>Total Users</p>
          <h2>{totalUsers}</h2>
        </div>
        <div
          className="stat-card orange"
          onClick={() => navigate("/admin/orders")}
        >
          <p>Orders</p>
          <h2>{totalOrders}</h2>
        </div>
        <div
          className="stat-card orange clickable"
          onClick={() =>
            navigate("/admin/products?filter=onsale")
          }
        >
          <p>Products on Sale</p>
          <h2>{productsOnSale}</h2>
        </div>
      </div>

      {/* ================= RECENT PRODUCTS TABLE ================= */}
      <div className="dashboard-card">
        <h3>Recent Products</h3>

        {recentProducts.length === 0 ? (
          <p>No recent products</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Added On</th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹ {p.price}</td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <SalesGraph />
      
      {/* ================= OUT OF STOCK TABLE ================= */}
      <div className="dashboard-card danger-card">
        <div className="table-header">
          <h3>Out of Stock</h3>

          <button
            className="view-all-btn"
            onClick={() => navigate("/admin/products?filter=outofstock")}
          >
            View All
          </button>
        </div>

        {outOfStockProducts.length === 0 ? (
          <p className="success-text">✅ All products are in stock</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {outOfStockProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹ {p.price}</td>
                  <td>
                    <span className="status-badge danger">
                      Out of Stock
                    </span>
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

export default AdminDashboard;
