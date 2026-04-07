import api, { API_ORIGIN } from "../api/axios";

export function resolveBikeImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${API_ORIGIN}${image}`;
  return `${API_ORIGIN}/uploads/${image}`;
}

export function getAllBikes() {
  return api.get("/bikes");
}

export function getBikeById(id) {
  return api.get(`/bikes/${id}`);
}

export function getMyBikes() {
  return api.get("/bikes/my/bikes");
}

export function addBike(payload) {
  return api.post("/bikes", payload);
}

export function deleteBike(id) {
  return api.delete(`/bikes/${id}`);
}

export function updateBike(id, payload) {
  return api.put(`/bikes/${id}`, payload);
}

export function addReview(id, payload) {
  return api.post(`/bikes/${id}/reviews`, payload);
}
