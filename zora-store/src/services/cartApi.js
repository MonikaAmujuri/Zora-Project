export const fetchCart = async (userId) => {
  const res = await fetch(
    `http://localhost:5000/api/cart?userId=${userId}`
  );
  return res.json();
};

export const updateCartQty = async (userId, productId, qty) => {
  const res = await fetch("http://localhost:5000/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      productId,
      quantity: qty,
    }),
  });
  return res.json();
};

export const removeCartItem = async (userId, productId) => {
  const res = await fetch(
    `http://localhost:5000/api/cart/remove/${productId}?userId=${userId}`,
    { method: "DELETE" }
  );
  return res.json();
};