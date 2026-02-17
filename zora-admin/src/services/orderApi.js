const API_URL = "http://localhost:5000/api/orders";

/* CREATE ORDER */
export const createOrder = async (order) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

/* GET ALL ORDERS (ADMIN) */
export const fetchAllOrders = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

/* GET USER ORDERS */
export const fetchUserOrders = async (email) => {
  const res = await fetch(`${API_URL}/user/${email}`);
  if (!res.ok) throw new Error("Failed to fetch user orders");
  return res.json();
};

/* UPDATE ORDER STATUS */
export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
};
