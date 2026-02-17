export const getProducts = () => {
  const data = localStorage.getItem("products");
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};
