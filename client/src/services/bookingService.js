import api from "../api/axios";

export function createBooking(payload) {
  return api.post("/bookings", payload);
}

export function getMyBookings() {
  return api.get("/bookings/my");
}

export function getProviderBookings() {
  return api.get("/bookings/provider");
}

export function cancelBooking(id) {
  return api.put(`/bookings/cancel/${id}`);
}

