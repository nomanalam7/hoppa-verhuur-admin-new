import ENDPOINTS from "../endpoints";
import api from "../index";

const getOrders = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.date) queryParams.append("createdAt", params.date);
  if (params.status) queryParams.append("status", params.status);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);


  const queryString = queryParams.toString();
  const url = queryString
    ? `${ENDPOINTS.getOrders}?${queryString}`
    : ENDPOINTS.getOrders;

  return api(url, null, "get");
}

const getOrderById = (id) =>
  api(`${ENDPOINTS.getOrderById}/${id}`, null, "get");

const updateOrder = (id, payload) =>
  api(`${ENDPOINTS.updateOrder}/${id}`, payload, "put");

const markAsPickedUpOrder = (id) =>
  api(`${ENDPOINTS.markAsPickedUpOrder}/${id}`, null, "patch");
const markAsDeliveredOrder = (id) =>
  api(`${ENDPOINTS.markAsDeliveredOrder}/${id}`, null, "patch");
const markAsCompletedOrder = (id) =>
  api(`${ENDPOINTS.markAsCompletedOrder}/${id}`, null, "patch");

const markAsConfirmedOrder = (id) =>
  api(`${ENDPOINTS.markAsConfirmedOrder}/${id}`, null, "patch");

const deleteOrder = (id) =>
  api(`${ENDPOINTS.deleteOrder}/${id}`, null, "delete");

const addAdminNotes = (id, payload) =>
  api(`${ENDPOINTS.addAdminNotes}/${id}`, payload, "post");

export {
  getOrders,
  getOrderById,
  updateOrder,
  markAsPickedUpOrder,
  markAsDeliveredOrder,
  markAsCompletedOrder,
  markAsConfirmedOrder,
  deleteOrder,
  addAdminNotes,
};
