import api from "./api";

export const getPayments = () => api.get("/payments/");
export const getPayment = (id) => api.get(`/payments/${id}/`);

// Existing payment endpoint (keep if needed)
export const processPayment = (data) => api.post("/payments/", data);

// Razorpay
export const createOrder = (registrationId) =>
  api.post("/payments/create-order/", {
    registration: registrationId,
  });

export const verifyPayment = (data) =>
  api.post("/payments/verify/", data);