import api from "./api";

export const getResults = (params) => api.get("/results/", { params });
export const createResult = (data) => api.post("/results/", data);
export const updateResult = (id, data) => api.put(`/results/${id}/`, data);
export const deleteResult = (id) => api.delete(`/results/${id}/`);
