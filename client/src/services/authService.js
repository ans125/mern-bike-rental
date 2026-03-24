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

export async function register({ name, email, password, role }) {
  const res = await api.post("/auth/register", { name, email, password, role });
  storeUser(res.data);
  return res.data;
}

