import api from "./api";

export const getRegistrations = (params) =>
  api.get("/registrations/", { params });
export const getRegistration = (id) => api.get(`/registrations/${id}/`);
export const createRegistration = (data) => api.post("/registrations/", data);
export const cancelRegistration = (id) =>
  api.post(`/registrations/${id}/cancel/`);
export const updateRegistration = (id, data) =>
  api.put(`/registrations/${id}/`, data);
