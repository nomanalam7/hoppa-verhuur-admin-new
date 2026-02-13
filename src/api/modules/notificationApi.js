import ENDPOINTS from "../endpoints";
import api from "../index";

const getNotifications = () => {
  return api(ENDPOINTS.getNotifications, null, "get");
};

const getNotificationbyType = (type) => {
  return api(`${ENDPOINTS.getNotificationbyType}/${type}`, null, "get");
};

export {
  getNotifications,
  getNotificationbyType,
};
