import api from "./api";

export async function register({ name, email, password }) {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}
export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}
export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}
