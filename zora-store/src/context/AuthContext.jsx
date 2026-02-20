import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
  localStorage.setItem("userInfo", JSON.stringify(userData));
  localStorage.setItem("token", userData.token);
  setUser(userData);
};

  const updateUser = (userData) => {
  localStorage.setItem("userInfo", JSON.stringify(userData));
  localStorage.setItem("token", userData.token);   // 🔥 VERY IMPORTANT
  setUser(userData);
};

  const logout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));

      if (storedUser?.token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);