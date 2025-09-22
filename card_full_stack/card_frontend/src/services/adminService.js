const API_URL = "http://localhost:8000/admin"; // your backend

// Helper function
const fetchAPI = async (endpoint, method = "GET", body = null, token = null, params = {}) => {
  let url = `${API_URL}${endpoint}`;

  // Append query parameters if GET request
  if (method === "GET" && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const headers = {};

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
};

// -------------------- Admin Service --------------------
export const getAllAdmins = async (token, filters = {}) => {
  return await fetchAPI("/all", "GET", null, token, filters);
};

export const createAdmin = async (token, data) => {
  return await fetchAPI("/create_recharger", "POST", data, token);
};

export const updateAdmin = async (token, id, data) => {
  return await fetchAPI(`/${id}`, "PATCH", data, token);
};

export const deleteAdmin = async (token, id) => {
  return await fetchAPI(`/${id}`, "DELETE", null, token);
};
