const API_URL = "http://localhost:5000/api/products";

/* GET ALL PRODUCTS */
export const fetchProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

/* ADD PRODUCT */
export const addProduct = async (product) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Failed to add product");

  return res.json();
};

export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem("token");  // or wherever you store it

  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return res.json();
};

/* DELETE PRODUCT */
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete product");

  return res.json();
};

