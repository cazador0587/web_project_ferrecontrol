import { api } from "./api";

export const auth = {
  register: (userData) => {
    return api.post("/auth/register", userData);
  },

  login: (credentials) => {
    return api.post("/auth/login", credentials);
  },

  getCurrentUser: () => {
    return api.get("/auth/me");
  },

  getUserCount: () => {
    return api.get("/auth/admin/user-count");
  },

  getUsers: () => {
    return api.get("/auth/admin/users");
  },

  updateUserRole: (id, role) => {
    return api.patch(`/auth/admin/users/${id}/role`, { role });
  },
};
