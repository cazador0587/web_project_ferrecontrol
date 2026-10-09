import { getToken } from "../utils/token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const { headers, ...restOptions } = options;

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    });
  } catch {
    throw new Error(
      "No fue posible conectar con el servidor. Inténtalo nuevamente.",
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;

  if (response.status !== 204) {
    const text = await response.text();

    if (text && isJson) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event("ferrecontrol:session-expired"));
    }

    throw new Error(
      data?.message || `Error en la solicitud (HTTP ${response.status})`,
    );
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
