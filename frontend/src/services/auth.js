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
};
