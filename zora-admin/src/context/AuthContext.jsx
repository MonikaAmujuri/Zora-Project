import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/auth/me", {
          credentials: "include",   // 🔥 VERY IMPORTANT
        });

        if (res.ok) {
          const data = await res.json();
          setAdmin(data);
        }
      } catch (err) {
        console.log("Auth check failed");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
  };

  const logout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);