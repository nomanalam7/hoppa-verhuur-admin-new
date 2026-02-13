import ENDPOINTS from "../endpoints";
import api from "../index";

const getDashboard = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const url = queryString
    ? `${ENDPOINTS.getDashboard}?${queryString}`
    : ENDPOINTS.getDashboard;
  return api(url, null, "get");
};

const upcommingOrders = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const url = queryString
    ? `${ENDPOINTS.upcommingOrder}?${queryString}`
    : ENDPOINTS.upcommingOrder;
  return api(url, null, "get");
};

export { getDashboard, upcommingOrders };
