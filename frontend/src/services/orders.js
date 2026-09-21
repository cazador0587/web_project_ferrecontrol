import { api } from "./api";

export const orders = {
  create: () => api.post("/orders"),
  getMyOrders: () => api.get("/orders"),
  getAll: () => api.get("/orders/admin/all"),

  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};
