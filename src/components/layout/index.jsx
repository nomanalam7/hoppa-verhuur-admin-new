import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Drawer, { drawerWidth } from "./drawer";
import useUserStore from "../../zustand/useUserStore";
import ConfirmationDialog from "../popups/confirmation";
import logoutIcon from "../../assets/icons/logout-blue.svg";
export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { clearUserData } = useUserStore();
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const confirmationDialogRef = React.useRef(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutConfirm = () => {
    confirmationDialogRef.current.open({
      title: "Uitloggen",
      description: "Weet je zeker dat je wilt uitloggen?",
      onConfirm: handleLogout,
      icon: logoutIcon,
    });
  };
  

  const handleLogout = () => {
    clearUserData();
    navigate("/inloggen");
  };

  // Calculate actual drawer width based on open/closed state
  const actualDrawerWidth = drawerOpen ? drawerWidth : 0;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        drawerOpen={drawerOpen}
        handleNavigation={handleNavigation}
        handleLogout={handleLogoutConfirm}
      />
      <ConfirmationDialog ref={confirmationDialogRef} />
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#FAFAFB",
          minHeight: "100vh",
          mt:{xs: 5, md: 0},
          width: `calc(100% - ${actualDrawerWidth}px)`,
          transition: "width 0.3s ease, margin-left 0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
