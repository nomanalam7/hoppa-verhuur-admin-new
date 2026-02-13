import ENDPOINTS from "../endpoints";
import api from "../index";

const getInventory = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.category) queryParams.append("category", params.category);
  if (params.status) queryParams.append("isAvailable", params.status);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString();
  const url = queryString
    ? `${ENDPOINTS.getInventory}?${queryString}`
    : ENDPOINTS.getInventory;

  return api(url, null, "get");
};

const addInventory = (payload) => api(ENDPOINTS.addInventory, payload, "post");

const updateInventory = (id, payload) =>
  api(`${ENDPOINTS.updateInventory}/${id}`, payload, "put");

const deleteInventory = (id) =>
  api(`${ENDPOINTS.deleteInventory}/${id}`, null, "delete");

const getInventoryById = (id) =>
  api(`${ENDPOINTS.getInventoryById}/${id}`, null, "get");

const fetchCategories = () => api(ENDPOINTS.fetchCategories, null, "get");

const getInventoryStats = () => api(ENDPOINTS.inventoryStats, null, "get");

const getAssormentItems = () => api(ENDPOINTS.getAssormentItems, {}, "get");

export {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
  fetchCategories,
  getInventoryById,
  getInventoryStats,
  getAssormentItems
};
