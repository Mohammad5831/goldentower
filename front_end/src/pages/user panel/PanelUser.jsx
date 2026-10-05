// src/components/PanelUser.jsx

import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  DashboardOutlined,
  ShoppingBagOutlined,
  LocationOnOutlined,
  FavoriteBorderOutlined,
  PersonOutline,
  SecurityOutlined,
  SettingsOutlined,
  LogoutOutlined,
  MenuOutlined,
  Close,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

const drawerWidth = 250;

const menuItems = [
  {
    label: "داشبورد",
    path: "/user",
    icon: <DashboardOutlined />,
  },
  {
    label: "سفارش‌های من",
    path: "/user/orders",
    icon: <ShoppingBagOutlined />,
  },
  {
    label: "آدرس‌های من",
    path: "/user/addresses",
    icon: <LocationOnOutlined />,
  },
  {
    label: "علاقه‌مندی‌ها",
    path: "/user/wishlist",
    icon: <FavoriteBorderOutlined />,
  },
  {
    label: "اطلاعات حساب",
    path: "/user/profile",
    icon: <PersonOutline />,
  },
  // {
  //   label: "امنیت حساب",
  //   path: "/user/security",
  //   icon: <SecurityOutlined />,
  // },
  // {
  //   label: "تنظیمات",
  //   path: "/user/settings",
  //   icon: <SettingsOutlined />,
  // },
];

export default function PanelUser({ children }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((current) => !current);
  };

  const handleNavigate = (path) => {
    navigate(path);

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/user") {
      return location.pathname === "/user";
    }

    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#fffdf5",
              color: "#D4AF37",
              border: "1px solid #D4AF37",
              fontWeight: 800,
            }}
          >
            GT
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                color: "#111",
              }}
            >
              برج طلایی
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              پنل کاربری
            </Typography>
          </Box>
        </Box>

        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Menu */}
      <List
        sx={{
          px: 1.5,
          py: 2,
          flex: 1,
        }}
      >
        {menuItems.map((item) => {
          const active = isActive(item.path);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                minHeight: 48,
                mb: 0.5,
                px: 1.5,
                borderRadius: 2,

                color: active
                  ? "#D4AF37"
                  : "#555",

                backgroundColor: active
                  ? "#fffdf5"
                  : "transparent",

                "&:hover": {
                  backgroundColor: active
                    ? "#fffdf5"
                    : "#f8f8f8",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: active
                    ? "#D4AF37"
                    : "#777",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                sx={{
                  textAlign: "right",
                  "& .MuiTypography-root": {
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 48,
            borderRadius: 2,
            color: "#777",

            "&:hover": {
              backgroundColor: "#fafafa",
              color: "#d32f2f",
            },

            "&:hover .MuiListItemIcon-root": {
              color: "#d32f2f",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,
              color: "#777",
            }}
          >
            <LogoutOutlined />
          </ListItemIcon>

          <ListItemText
            primary="خروج از حساب"
            sx={{
              textAlign: "right",

              "& .MuiTypography-root": {
                fontSize: 14,
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#fafafa",
        direction: "rtl",
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <Box
          sx={{
            height: 64,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            backgroundColor: "#fff",
            borderBottom: "1px solid #e8e8e8",

            position: "sticky",
            top: 0,
            zIndex: theme.zIndex.appBar,
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "#111",
            }}
          >
            <MenuOutlined />
          </IconButton>

          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 800,
              color: "#111",
            }}
          >
            پنل کاربری
          </Typography>

          <Box sx={{ width: 40 }} />
        </Box>
      )}

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",

              borderLeft: "1px solid #e8e8e8",
              borderRight: "none",

              backgroundColor: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },

          mr: {
            xs: 0,
            md: `${drawerWidth}px`,
          },

          maxWidth: {
            xs: "100%",
            md: `calc(1600px + ${drawerWidth}px)`,
          },

          boxSizing: "border-box",

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}