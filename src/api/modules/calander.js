import ENDPOINTS from "../endpoints";
import api from "../index";

const getCalanderData = (params) => {
  return api(ENDPOINTS.calenderData, params, "post");
};

export { getCalanderData }; 