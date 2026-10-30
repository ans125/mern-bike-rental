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


// Provider approves or rejects a pending booking ("approved" | "rejected")
export function updateBookingStatus(id, status) {
  return api.put(`/bookings/${id}/status`, { status });
}

// Details with contacts (after approval), pick-up info and chat
export function getBookingDetails(id) {
  return api.get(`/bookings/${id}`);
}

export function sendBookingMessage(id, text) {
  return api.post(`/bookings/${id}/messages`, { text });
}

// Provider confirms the bike was handed over at the shop
export function confirmPickup(id) {
  return api.put(`/bookings/${id}/pickup`);
}

export function confirmReturn(id) {
  return api.put(`/bookings/${id}/return`);
}
