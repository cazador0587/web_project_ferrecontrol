import { getToken } from "../utils/token";

const API_URL = "http://localhost:3001/api";

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }

  return data;
};

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, {
      method: "GET",
      ...options,
    }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, {
      method: "DELETE",
      ...options,
    }),
};
