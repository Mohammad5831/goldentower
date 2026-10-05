import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchProfile = (token) =>
  api.get("/user/profile", { headers: { Authorization: `Bearer ${token}` } });

export const fetchOrders = (token, params = {}) =>
  api.get("/auth/orders", { headers: { Authorization: `Bearer ${token}` }, params });

export const fetchOrderById = (token, id) =>
  api.get(`/auth/orders/${order_uuid}`, { headers: { Authorization: `Bearer ${token}` } });

export default api;
