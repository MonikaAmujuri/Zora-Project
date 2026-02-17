import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authFetch } from "../../utils/api";
import "./AdminHeader.css";

function AdminHeader({ title = "Admin Dashboard" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
  await authFetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
  });

  localStorage.removeItem("token");

  navigate("/", { replace: true });
};

  return (
    <header className="admin-header">
      <h2>{title}</h2>

      <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
    </header>
  );
}

export default AdminHeader;
