import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import "./AdminSettings.css";

const defaultSettings = {
  store: {
    name: "ZORA",
    email: "support@zora.com",
    currency: "INR",
    tax: 5,
    maintenance: false,
  },
  payments: {
    cod: true,
    upi: false,
    card: false,
    gatewayKey: "",
  },
  notifications: {
    newOrder: true,
    statusChange: false,
    lowStock: true,
  },
};

function AdminSettings() {
  const [activeTab, setActiveTab] = useState("store");
  const [settings, setSettings] = useState(defaultSettings);

  // 🔥 LOAD FROM MONGODB
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/settings"
      );
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Load settings error:", error);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // 🔥 SAVE TO MONGODB
  const saveSettings = async () => {
    try {
      await authFetch(
        "http://localhost:5000/api/admin/settings",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }
      );

      alert("Settings saved successfully");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* TABS */}
      <div className="settings-tabs">
        <button
          className={activeTab === "store" ? "active" : ""}
          onClick={() => setActiveTab("store")}
        >
          Store
        </button>

        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>

        <button
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>

      <div className="settings-card">

        {/* 🔵 STORE TAB */}
        {activeTab === "store" && (
          <>
            <h3>Store Settings</h3>

            <label>Store Name</label>
            <input
              type="text"
              value={settings.store.name}
              onChange={(e) =>
                updateSetting("store", "name", e.target.value)
              }
            />

            <label>Support Email</label>
            <input
              type="email"
              value={settings.store.email}
              onChange={(e) =>
                updateSetting("store", "email", e.target.value)
              }
            />

            <label>Currency</label>
            <select
              value={settings.store.currency}
              onChange={(e) =>
                updateSetting("store", "currency", e.target.value)
              }
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>

            <label>Tax (%)</label>
            <input
              type="number"
              value={settings.store.tax}
              onChange={(e) =>
                updateSetting("store", "tax", Number(e.target.value))
              }
            />

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.store.maintenance}
                onChange={(e) =>
                  updateSetting("store", "maintenance", e.target.checked)
                }
              />
              <span>Maintenance Mode</span>
            </div>

            <button className="save-btn" onClick={saveSettings}>
              Save Store Settings
            </button>
          </>
        )}

        {/* 🟣 PAYMENTS TAB */}
        {activeTab === "payments" && (
          <>
            <h3>Payment Settings</h3>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.payments.cod}
                onChange={(e) =>
                  updateSetting("payments", "cod", e.target.checked)
                }
              />
              <span>Enable Cash on Delivery</span>
            </div>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.payments.upi}
                onChange={(e) =>
                  updateSetting("payments", "upi", e.target.checked)
                }
              />
              <span>Enable UPI Payments</span>
            </div>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.payments.card}
                onChange={(e) =>
                  updateSetting("payments", "card", e.target.checked)
                }
              />
              <span>Enable Card Payments</span>
            </div>

            <label>Payment Gateway Key</label>
            <input
              type="text"
              value={settings.payments.gatewayKey}
              onChange={(e) =>
                updateSetting("payments", "gatewayKey", e.target.value)
              }
            />

            <button className="save-btn" onClick={saveSettings}>
              Save Payment Settings
            </button>
          </>
        )}

        {/* 🟡 NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <>
            <h3>Notification Settings</h3>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.notifications.newOrder}
                onChange={(e) =>
                  updateSetting("notifications", "newOrder", e.target.checked)
                }
              />
              <span>Email on New Order</span>
            </div>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.notifications.statusChange}
                onChange={(e) =>
                  updateSetting("notifications", "statusChange", e.target.checked)
                }
              />
              <span>Email on Order Status Change</span>
            </div>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={settings.notifications.lowStock}
                onChange={(e) =>
                  updateSetting("notifications", "lowStock", e.target.checked)
                }
              />
              <span>Low Stock Alerts</span>
            </div>

            <button className="save-btn" onClick={saveSettings}>
              Save Notification Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;