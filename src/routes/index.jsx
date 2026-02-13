// routes/components.js
import LoginPage from "../app/auth/login";
import ForgotPasswordPage from "../app/auth/forgotPassword";
import SetNewPasswordPage from "../app/auth/setNewPassword";
import DashboardPage from "../app/admin/dashboard";
import OrderManagementPage from "../app/admin/orderManagement";
import TentInventoryPage from "../app/admin/tentInventory";
import ReportsPage from "../app/admin/reports";
import SettingsPage from "../app/admin/settings";

const AUTH_ROUTES = [
  {
    id: 1,
    name: "Inloggen",
    component: <LoginPage />,
    exact: "exact",
    path: "login",
  },

  {
    id: 3,
    name: "Wachtwoord Vergeten",
    component: <ForgotPasswordPage />,
    exact: "exact",
    path: "forgot-password",
  },

  {
    id: 6,
    name: "Wachtwoord Resetten",
    component: <SetNewPasswordPage />,
    exact: "exact",
    path: "set-new-password",
  },
];

// Import icon paths
import dashboardActive from "../assets/icons/dashbaord-active.svg";
import dashboardInactive from "../assets/icons/dashboard-inactive.svg";
import documentActive from "../assets/icons/document-active.svg";
import documentInactive from "../assets/icons/document-inactive.svg";
import inventoryActive from "../assets/icons/inventory-active.svg";
import inventoryInactive from "../assets/icons/Inventory-inactive.svg";
import calendarActive from "../assets/icons/calendar-active.svg";
import calendarInactive from "../assets/icons/calendar-inactive.svg";
import reportingActive from "../assets/icons/reporting-active.svg";
import reportingInactive from "../assets/icons/reporting-inactive.svg";
import settingActive from "../assets/icons/setting-active.svg";
import settingInactive from "../assets/icons/setting-inactive.svg";
import Calender from "../app/admin/calender";

const ADMIN_ROUTES = [
  {
    id: 1,
    name: "Dashboard",
    component: <DashboardPage />,
    exact: "exact",
    path: "/",
    activeIcon: dashboardInactive,
    inActiveIcon: dashboardActive,
    isHideMenu: false,
  },
  {
    id: 2,
    name: "Bestelbeheer",
    component: <OrderManagementPage />,
    exact: "exact",
    path: "/order-management",
    activeIcon: documentActive,
    inActiveIcon: documentInactive,
    isHideMenu: false,
  },
  {
    id: 3,
    name: "Vooraad",
    component: <TentInventoryPage />,
    exact: "exact",
    path: "/tent-inventory",
    activeIcon: inventoryActive,
    inActiveIcon: inventoryInactive,
    isHideMenu: false,
  },

  {
    id: 5,
    name: "Kalender",
    component: <Calender />,
    exact: "exact",
    path: "/calendar",
    activeIcon: calendarActive,
    inActiveIcon: calendarInactive,
    isHideMenu: false,
  },
  {
    id: 6,
    name: "Rapporten",
    component: <ReportsPage />,
    exact: "exact",
    path: "/reports-payment",
    activeIcon: reportingActive,
    inActiveIcon: reportingInactive,
    isHideMenu: false,
  },

  // {
  //   id: 8,
  //   name: "Instellingen",
  //   component: <SettingsPage />,
  //   exact: "exact",
  //   path: "/settings",
  //   activeIcon: settingActive,
  //   inActiveIcon: settingInactive,
  //   isHideMenu: false, // hide from menu
  // },
];


export { AUTH_ROUTES, ADMIN_ROUTES };
