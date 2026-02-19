import { authFetch } from "../utils/api";

const API_URL = "http://localhost:5000/api/orders";

/* GET TOKEN HELPER */
const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* CREATE ORDER */
export const createOrder = async (orderData) => {
  const res = await authFetch("http://localhost:5000/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  return res.json();
};

/* GET ALL ORDERS (ADMIN) */
export const fetchAllOrders = async () => {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),   // ✅ FIXED
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

/* GET USER ORDERS */
export const fetchUserOrders = async (email) => {
  const res = await fetch(`${API_URL}/user/${email}`, {
    headers: getAuthHeaders(),   // ✅ FIXED
  });

  if (!res.ok) throw new Error("Failed to fetch user orders");
  return res.json();
};

/* UPDATE ORDER STATUS */
export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),   // ✅ FIXED
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
};