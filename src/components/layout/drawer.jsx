import * as React from "react";
import {
  Drawer as MuiDrawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { ADMIN_ROUTES } from "../../routes";
import logo from "../../assets/images/web-logo.png";
import { Bell, Settings, LogOut, Menu, X } from "lucide-react";

// Small screen ke liye width kam
const drawerWidthLarge = 180;
const drawerWidthSmall = 70;
export const drawerWidth = drawerWidthLarge;

export default function Drawer({ drawerOpen, handleNavigation, handleLogout }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const routes = ADMIN_ROUTES;
  console.log(routes, "Routes");

  // Small screen pe drawer width automatically adjust hoga
  const currentDrawerWidth = isSmallScreen
    ? drawerWidthSmall
    : drawerWidthLarge;

  const isRouteActive = (routePath) => {
    if (location.pathname === routePath) return true;
    if (routePath === "/" && location.pathname === "/") return true;
    if (routePath !== "/" && location.pathname.startsWith(routePath))
      return true;
    return false;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{
        overflow: "auto",
        backgroundColor: "#fff",
        height: "90%",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Logo - Tera original wala */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          py: isSmallScreen ? 1 : 2,
        }}
        onClick={() => handleNavigation("/")} 
      >
        <img src={logo} alt="logo" width={isSmallScreen ? 60 : 100} />
      </Box>

      {/* Menu Items - Tera original logic */}
      <List sx={{ mt: 2 }}>
        {routes.map((route) => {
          if (route.isHideMenu || !route.name) return null;
          const isActive = isRouteActive(route.path);
          return (
            <ListItem key={route.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleNavigation(route.path);
                  if (isSmallScreen) setMobileOpen(false);
                }}
                sx={{
                  background: isActive
                    ? "linear-gradient(to right, rgba(29, 78, 137, 0.5), #A09DFF00)"
                    : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  py: isSmallScreen ? 1.5 : 2,
                  "&:hover": {
                    backgroundColor: isActive
                      ? "linear-gradient(to right, #1D4E89, #A09DFF00)"
                      : "rgba(22, 37, 249, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {route.activeIcon || route.inActiveIcon ? (
                    <img
                      src={
                        isActive
                          ? route.activeIcon || route.inActiveIcon
                          : route.inActiveIcon
                      }
                      alt={route.name}
                      style={{
                        width: isSmallScreen ? 18 : 20,
                        height: isSmallScreen ? 18 : 20,
                      }}
                    />
                  ) : null}
                </ListItemIcon>
                {/* Small screen pe text hide */}
                {isActive && !isSmallScreen && (
                  <ListItemText
                    primary={route.name}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "12px",
                        textAlign: "center",
                        color: isActive ? "#295493" : "#666",
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Menu - Tera original logic */}
      <List sx={{ mt: 2 }}>
        {[
          {
            id: "notifications",
            name: "Meldingen",
            path: "/notifications",
            icon: Bell,
          },
          {
            id: "settings",
            name: "Instellingen",
            path: "/settings",
            icon: Settings,
          },
          {
            id: "logout",
            name: "Uitloggen",
            onClick: handleLogout,
            icon: LogOut,
          },
        ].map((item) => {
          const isActive = isRouteActive(item.path);
          const Icon = item.icon;
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    handleNavigation(item.path);
                  }
                  if (isSmallScreen) setMobileOpen(false);
                }}
                sx={{
                  background: isActive
                    ? "linear-gradient(to right, rgba(29, 78, 137, 0.5), #A09DFF00)"
                    : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "linear-gradient(to right, #1D4E89, #A09DFF00)"
                      : "rgba(22, 37, 249, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    display: "flex",
                    justifyContent: "center",
                    py: 1,
                  }}
                >
                  <Icon
                    size={isSmallScreen ? 18 : 20}
                    color={isActive ? "#295493" : "#666"}
                  />
                </ListItemIcon>
                {/* Small screen pe text hide */}
                {isActive && !isSmallScreen && (
                  <ListItemText
                    primary={item.name}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "12px",
                        textAlign: "center",
                        color: isActive ? "#295493" : "#666",
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Small screen pe menu button */}
      {isSmallScreen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            ml: mobileOpen ? 9 : 0,
            backgroundColor: "#fff",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </IconButton>
      )}

      {/* Drawer */}
      <MuiDrawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? mobileOpen : drawerOpen}
        onClose={isSmallScreen ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerOpen ? currentDrawerWidth : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? currentDrawerWidth : 0,
            boxSizing: "border-box",
            backgroundColor: "#FAFAFB",
            transition: "width 0.3s ease",
            overflowX: "hidden",
            boxShadow: "none",
            border: "none",
            px: isSmallScreen ? 1 : 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    </>
  );
}
