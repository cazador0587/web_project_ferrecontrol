import { api } from "./api";

export const products = {
  getAll: (params = "") => api.get(`/products${params}`),

  getById: (id) => api.get(`/products/${id}`),
};
