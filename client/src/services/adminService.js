import api from "../api/axios";

export const getAdminStats = () => {
  return api.get("/admin/stats");
};

export const getUsers = () => {
  return api.get("/admin/users");
};

// status: pending | approved | rejected
export const getVerifications = (status) => {
  return api.get("/admin/verifications", { params: { status } });
};

export const approveUser = (id) => {
  return api.put(`/admin/users/${id}/approve`);
};

export const rejectUser = (id, reason) => {
  return api.put(`/admin/users/${id}/reject`, { reason });
};

// CNIC images are private, so they are fetched with the admin token and shown as blob URLs
export const getUserDocument = (id, side) => {
  return api.get(`/admin/users/${id}/documents/${side}`, { responseType: "blob" });
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

export const getSupportMessages = () => {
  return api.get("/admin/messages");
};

export const updateSupportMessage = (id, status) => {
  return api.put(`/admin/messages/${id}`, { status });
};
