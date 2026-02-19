import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

function AdminRoute({ children }) {
  const { admin, loading } = useAdmin();

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