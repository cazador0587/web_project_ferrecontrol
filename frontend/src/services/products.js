import { api } from "./api";

export const products = {
  getAll: (params = "") => api.get(`/products${params}`),

  getById: (id) => api.get(`/products/${id}`),

  create: (productData) => api.post("/products", productData),

  update: (id, productData) => api.patch(`/products/${id}`, productData),

  remove: (id) => api.delete(`/products/${id}`),
};
