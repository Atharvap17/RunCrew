import api from "./api";

export const registerUser = (data) => api.post("/users/register/", data);
export const loginUser = (email, password) =>
  api.post("/users/login/", { email, password });
export const getProfile = () => api.get("/users/profile/");
export const updateProfile = (data) => api.put("/users/profile/", data);
export const forgotPassword = (email) =>
  api.post("/users/forgot-password/", { email });
export const verifyOTP = (email, otp) =>
  api.post("/users/verify-otp/", { email, otp });
export const resetPassword = (data) =>
  api.post("/users/reset-password/", data);
