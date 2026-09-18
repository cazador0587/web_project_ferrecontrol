import { api } from "./api";

export const cart = {
  get: () => api.get("/cart"),

  addItem: (productId, quantity = 1) =>
    api.post("/cart/items", {
      product: productId,
      quantity,
    }),

  updateItem: (productId, quantity) =>
    api.patch(`/cart/items/${productId}`, {
      quantity,
    }),

  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
};
