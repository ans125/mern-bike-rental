import api from "../api/axios";

// Contact page form -> support ticket for the admin
export function sendSupportMessage(payload) {
  return api.post("/support", payload);
}

// AI customer support chat; history = previous [{ sender, text }] turns
export function askSupportAssistant(message, history) {
  return api.post("/chat", { message, history });
}
