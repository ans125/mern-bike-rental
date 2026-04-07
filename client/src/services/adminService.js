import api from "../api/axios";

export const getAdminStats = () => {
  return api.get("/admin/stats");
};

export const getUsers = () => {
  return api.get("/admin/users");
};

export const getPendingProviders = () => {
  return api.get("/admin/providers/pending");
};

export const approveProvider = (id) => {
  return api.put(`/admin/providers/${id}/approve`);
};

export const getAllBikes = () => {
  return api.get("/admin/bikes");
};

export const deleteBike = (id) => {
  return api.delete(`/admin/bikes/${id}`);
};

export const getAllBookings = () => {
  return api.get("/admin/bookings");
};

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};