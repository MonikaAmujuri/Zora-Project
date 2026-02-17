export const getCart = () =>
  JSON.parse(localStorage.getItem("cart")) || [];

export const saveCart = (cart) =>
  localStorage.setItem("cart", JSON.stringify(cart));
