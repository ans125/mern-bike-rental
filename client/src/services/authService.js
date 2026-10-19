import api from "../api/axios";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem("user");
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  storeUser(res.data);
  return res.data;
}

export async function register({ name, email, password, phone, role }) {
  const res = await api.post("/auth/register", { name, email, password, phone, role });
  storeUser(res.data);
  return res.data;
}

// Refresh the stored profile (keeps the token) so approval changes show without re-login
export async function refreshStoredUser() {
  const stored = getStoredUser();
  if (!stored?.token) return stored;
  const res = await api.get("/auth/me");
  const updated = { ...stored, ...res.data };
  storeUser(updated);
  return updated;
}

