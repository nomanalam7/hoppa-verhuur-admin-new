import ENDPOINTS from "../endpoints";
import api from "../index";

const loginUser = (payload) => api(ENDPOINTS.loginUser, payload, "post");
const forgotPassword = (payload) =>
  api(ENDPOINTS.forgotPassword, payload, "post");
const verifyOTP = (payload) => api(ENDPOINTS.verifyOTP, payload, "post");
const resetPassword = (payload) =>
  api(ENDPOINTS.resetPassword, payload, "post");

const updateUser = (payload) => api(ENDPOINTS.updateUser, payload, "put");
const getUser = () => api(ENDPOINTS.getUser, null, "get");
const changePassword = (payload) =>
  api(ENDPOINTS.changePassword, payload, "put");

const updateAdminSettings = (payload) =>
  api(ENDPOINTS.updateAdminSettings, payload, "put");
const getAdminSettings = () => api(ENDPOINTS.getAdminSettings, null, "get");

export {
  loginUser,
  forgotPassword,
  resetPassword,
  updateUser,
  changePassword,
  getUser,
  updateAdminSettings,
  getAdminSettings,
  verifyOTP,
};
