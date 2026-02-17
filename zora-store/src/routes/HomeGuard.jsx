import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AdminContext";

function HomeGuard({ children }) {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default HomeGuard;
