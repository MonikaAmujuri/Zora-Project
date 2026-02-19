import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { authFetch } from "../../utils/api";
import "./AdminHeader.css";

function AdminHeader({ title = "Admin Dashboard" }) {
  const { admin, logout } = useAdmin();  // ✅ use AdminContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authFetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    } catch (err) {
      console.log("Logout API failed");
    }

    logout(); // ✅ clear admin context + localStorage
    navigate("/", { replace: true });
  };

  return (
    <header className="admin-header">
      <h2>{title}</h2>

      {admin && (
        <div className="admin-info">
          <div className="admin-avatar">
            {(admin.name || admin.email || admin.phone)
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="admin-details">
            <p className="admin-name">
              {admin.name || "Admin"}
            </p>
            <p className="admin-contact">
              {admin.email || admin.phone}
            </p>
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </header>
  );
}

export default AdminHeader;