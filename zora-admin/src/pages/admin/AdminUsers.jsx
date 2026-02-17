import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/admin/all",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  setUsers(data);
};

  useEffect(() => {
  const loadUsers = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/all"
      );

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
    }
  };

  loadUsers();
}, []);

  const loggedInUsers = users.filter(u => u.isOnline);
  
  const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    // remove from UI immediately
    setUsers(users.filter((u) => u._id !== id));
  } catch (err) {
    console.error(err);
  }
};

const updateRole = async (id, newRole) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/admin/users/${id}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    if (!res.ok) {
      alert("Role update failed");
      return;
    }

    // update UI immediately
    setUsers(
      users.map((u) =>
        u._id === id ? { ...u, role: newRole } : u
      )
    );
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="admin-page">
      <h1>Users</h1>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>

        <div className="stat-card green">
          <p>Logged In Users</p>
          <h2>{loggedInUsers.length}</h2>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="admin-card">
        <h3>Users List</h3>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>
                    <span className={user.isOnline ? "online-badge" : "offline-badge"}>
                      {user.isOnline ? "Logged In" : "Logged Out"}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
