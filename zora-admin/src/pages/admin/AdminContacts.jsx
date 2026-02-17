import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import "./AdminContacts.css";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/contacts"
      );
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Fetch contacts error:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markReplied = async (id) => {
    await authFetch(
      `http://localhost:5000/api/admin/contacts/${id}/reply`,
      { method: "PUT" }
    );
    fetchContacts();
  };

  const deleteMessage = async (id) => {
    await authFetch(
      `http://localhost:5000/api/admin/contacts/${id}`,
      { method: "DELETE" }
    );
    fetchContacts();
  };

  const unreadCount = contacts.filter(c => c.status === "Unread").length;

  return (
    <div className="admin-page">
      <h1>Contact Inbox</h1>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <p>Total Messages</p>
          <h2>{contacts.length}</h2>
        </div>

        <div className="stat-card red">
          <p>Unread Messages</p>
          <h2>{unreadCount}</h2>
        </div>
      </div>

      <div className="admin-card">
        {contacts.length === 0 ? (
          <p>No messages found</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map(contact => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>

                  <td>
                    <span
                      className={
                        contact.status === "Unread"
                          ? "status unread"
                          : "status replied"
                      }
                    >
                      {contact.status}
                    </span>
                  </td>

                  <td>
                    {new Date(contact.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    {contact.status === "Unread" && (
                      <button
                        className="reply-btn"
                        onClick={() => markReplied(contact._id)}
                      >
                        Mark Replied
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteMessage(contact._id)}
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

export default AdminContacts;