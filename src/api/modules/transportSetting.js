import ENDPOINTS from "../endpoints";
import api from "../index";

const getTransportSetting = () => {
  return api(ENDPOINTS.getTransportSettings, null, "get");
};

const updateTransportSetting = (data) => {
  return api(ENDPOINTS.updateTransportSettings, data, "put");
};

const getVatTransportSetting = () => {
  return api(ENDPOINTS.getVatTransportSettings, null, "get");
};

const updateVatTransportSetting = (data) => {
  return api(ENDPOINTS.updateVatTransportSettings, data, "put");
};

export {
  getTransportSetting,
  updateTransportSetting,
  getVatTransportSetting,
  updateVatTransportSetting,
};
