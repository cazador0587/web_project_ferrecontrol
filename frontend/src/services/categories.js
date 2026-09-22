import { api } from "./api";

export const categories = {
  getAll: () => api.get("/categories"),
  create: (categoryData) => api.post("/categories", categoryData),
  update: (id, categoryData) => api.patch(`/categories/${id}`, categoryData),
  remove: (id) => api.delete(`/categories/${id}`),
};

