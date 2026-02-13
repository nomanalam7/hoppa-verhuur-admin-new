import ENDPOINTS from "../endpoints";
import api from "../index";

const getReports = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const url = queryString
    ? `${ENDPOINTS.getReports}?${queryString}`
    : ENDPOINTS.getReports;
  return api(url, null, "get");
};

const getReportsOrders = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const url = queryString
    ? `${ENDPOINTS.reportingOrders}?${queryString}`
    : ENDPOINTS.reportingOrders;
  return api(url, null, "get");
};

export { getReports, getReportsOrders };
