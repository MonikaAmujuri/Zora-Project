import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) return null; // 🔥 VERY IMPORTANT

  if (!admin) {
    return <Navigate to="/" />;
  }

  if (admin.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;