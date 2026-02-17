import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiGrid, FiBox, FiUser, FiShoppingBag,  FiSettings, FiStar } from "react-icons/fi";
import "./AdminSidebar.css";

function AdminSidebar({ collapsed, toggleSidebar }) {
  const { pathname } = useLocation();

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* TOP */}
      <div className="sidebar-top">
        <Link to="/admin/dashboard" className="admin-logo">
          {!collapsed && <h2>ZORA</h2>}
        </Link>

        <button className="collapse-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      </div>

      {/* LINKS */}
      <nav className="sidebar-links">
        <Link
          to="/admin/dashboard"
          className={pathname.includes("dashboard") ? "active" : ""}
        >
          <FiGrid />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <Link
          to="/admin/products"
          className={pathname.includes("products") ? "active" : ""}
        >
          <FiBox />
          {!collapsed && <span>Products</span>}
        </Link>

        <Link
          to="/admin/users"
          className={pathname.includes("users") ? "active" : ""}
        >
          <FiUser />
          {!collapsed && <span>Users</span>}
        </Link>

        <Link
          to="/admin/orders"
          className={pathname.includes("orders") ? "active" : ""}
        >
          <FiShoppingBag />
          {!collapsed && <span>Orders</span>}
        </Link>

        
          <Link to="/admin/reviews"
          className={pathname.includes("reviews") ? "active" : ""}
          >
            <FiStar/>
            {!collapsed && <span>Reviews</span>}
          </Link>

          <Link to="/admin/contacts"
          className={pathname.includes("contacts") ? "active" : ""}
          >
            <FiUser/>
            {!collapsed && <span>Contacts</span>}
          </Link>
       

        <Link
          to="/admin/settings"
          className={pathname.includes("settings") ? "active" : ""}
        >
          <FiSettings />
          {!collapsed && <span>Settings</span>}
        </Link>

        <Link
          to="/admin/profile"
          className={pathname.includes("profile") ? "active" : ""}
        >
          <FiUser />
          {!collapsed && <span>Profile</span>}
        </Link>
      </nav>

    </aside>
  );
}

export default AdminSidebar;
