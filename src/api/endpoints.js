const ENDPOINTS = {
  registerAgent: "admin/auth/register",
  loginUser: "admin/auth/login",
  verifyOTP: "admin/auth/verify-otp",
  forgotPassword: "admin/auth/forgot-password",
  resetPassword: "admin/auth/reset-password",
  getUser: "admin/auth/me",
  updateUser: "admin/auth/update",
  changePassword: "admin/auth/change-password",
  updateAdminSettings: "admin/auth/settings",
  getAdminSettings: "admin/auth/settings",

  // Inventory endpoints
  getInventory: "inventory-items/all",
  getInventoryById: "inventory-items",
  addInventory: "inventory-items/create",
  updateInventory: "inventory-items/update",
  deleteInventory: "inventory-items/delete",
  fetchCategories: "categories/all",

  //dashbaord

  getDashboard: "admin/dashboard",
  upcommingOrder: "admin/dashboard/upcoming-orders",

  //reparts
  getReports: "admin/dashboard/reporting",
  reportingOrders: "admin/dashboard/reporting/orders",

  calenderData: "admin/dashboard/calendar-orders",
  inventoryStats: "admin/dashboard/inventory/stats",
  getAssormentItems: "inventory-items/by-category",

  //transport settings
  getTransportSettings: "transport-settings",
  updateTransportSettings: "transport-settings",
  getVatTransportSettings: "transport-settings/vat/fetch",
  updateVatTransportSettings: "transport-settings/vat",

  //order management
  getOrders: "orders/all",
  getOrderById: "orders",
  updateOrder: "orders/admin-update",
  markAsPickedUpOrder: "orders/status/picked-up",
  markAsDeliveredOrder: "orders/status/delivered",
  markAsCompletedOrder: "orders/status/completed",
  markAsConfirmedOrder: "orders/status/confirmed",
  deleteOrder: "orders/delete",
  addAdminNotes: "orders/admin-notes",

  //notifications
  getNotifications: "notifications/all",
  getNotificationbyType: "notifications",
};

export default ENDPOINTS;
