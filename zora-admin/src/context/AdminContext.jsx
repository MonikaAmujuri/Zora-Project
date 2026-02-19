import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/api";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await authFetch(
          "http://localhost:5000/api/auth/me",
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();

          // 🔥 Only allow admin
          if (data.role === "admin") {
            setAdmin(data);
          }
        }
      } catch (err) {
        console.log("Admin auth check failed");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
  };

  const logout = async () => {
    await authFetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setAdmin(null);
    localStorage.removeItem("token");
  };

  return (
    <AdminContext.Provider
      value={{ admin, login, logout, loading }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);