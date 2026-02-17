import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const login = (email, password) => {
  // 🔐 ADMIN LOGIN
  if (email === "admin@zora.com" && password === "admin123") {
    setRole("admin");
    localStorage.setItem("role", "admin");
    return "admin";
  }

  // 👤 USER LOGIN
  const login = async (email, password) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();

  // ✅ SAVE
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  setUser(data.user);

  // ✅ RETURN USER
  return data.user;
}
};

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
