import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./routes/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminContacts from "./pages/admin/AdminContacts";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="products" element={<AdminPanel />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;