import { api } from "./api";

export const orders = {
  create: () => api.post("/orders"),
  getMyOrders: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
};
