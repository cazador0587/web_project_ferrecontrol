import { api } from "./api";

export const categories = {
  getAll: () => api.get("/categories"),
};
