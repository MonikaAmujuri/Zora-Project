import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("adminInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (adminData) => {
    localStorage.setItem("adminInfo", JSON.stringify(adminData));
    localStorage.setItem("token", adminData.token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("token");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);