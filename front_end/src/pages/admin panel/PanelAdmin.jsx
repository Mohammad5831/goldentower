import React, { useState } from "react";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    useMediaQuery,
} from "@mui/material";

import {
    DashboardRounded,
    ShoppingBagRounded,
    ReceiptLongRounded,
    PeopleAltRounded,
    CategoryRounded,
    LocalOfferRounded,
    ArticleRounded,
    SettingsRounded,
    MenuRounded,
    LogoutRounded,
    ChevronLeftRounded,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 250;

const menuItems = [
    {
        title: "داشبورد",
        path: "/admin",
        icon: <DashboardRounded />,
    },
    {
        title: "محصولات",
        path: "/admin/products",
        icon: <ShoppingBagRounded />,
    },
    {
        title: "سفارشات",
        path: "/admin/orders",
        icon: <ReceiptLongRounded />,
    },
    {
        title: "کاربران",
        path: "/admin/users",
        icon: <PeopleAltRounded />,
    },
    {
        title: "دسته‌بندی‌ها",
        path: "/admin/categories",
        icon: <CategoryRounded />,
    },
    {
        title: "برندها",
        path: "/admin/brands",
        icon: <LocalOfferRounded />,
    },
    {
        title: "مقالات",
        path: "/admin/articles",
        icon: <ArticleRounded />,
    },
];

const bottomMenuItems = [
    {
        title: "تنظیمات",
        path: "/admin/settings",
        icon: <SettingsRounded />,
    },
];

export function PanelAdmin({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isMobile = useMediaQuery("(max-width:900px)");

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavigate = (path) => {
        navigate(path);

        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }

        return location.pathname.startsWith(path);
    };

    const getPageTitle = () => {
        if (location.pathname === "/admin") {
            return "داشبورد";
        }

        const currentItem = [
            ...menuItems,
            ...bottomMenuItems,
        ].find((item) => isActive(item.path));

        return currentItem?.title || "پنل مدیریت";
    };

    const handleLogout = () => {
        // در صورت داشتن سیستم احراز هویت:
        // localStorage.removeItem("token");
        // navigate("/login");

        navigate("/");
    };

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fff",
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    height: 72,
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        cursor: "pointer",
                    }}
                    onClick={() => handleNavigate("/admin")}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1.5,
                            bgcolor: "#111",
                            color: "#D4AF37",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 900,
                            fontSize: 18,
                        }}
                    >
                        GT
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: "#111",
                                lineHeight: 1.2,
                            }}
                        >
                            Golden Tower
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#888",
                                mt: 0.3,
                            }}
                        >
                            پنل مدیریت
                        </Typography>
                    </Box>
                </Box>

                {isMobile && (
                    <IconButton
                        onClick={() => setMobileOpen(false)}
                        size="small"
                    >
                        <ChevronLeftRounded />
                    </IconButton>
                )}
            </Box>

            <Divider />

            {/* Main menu */}
            <Box
                sx={{
                    px: 1.5,
                    pt: 2,
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                <Typography
                    sx={{
                        px: 1.5,
                        mb: 1,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#999",
                    }}
                >
                    مدیریت
                </Typography>

                <List disablePadding>
                    {menuItems.map((item) => {
                        const active = isActive(item.path);

                        return (
                            <ListItemButton
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    minHeight: 46,
                                    mb: 0.5,
                                    px: 1.5,
                                    borderRadius: 2,
                                    position: "relative",
                                    color: active ? "#111" : "#666",
                                    bgcolor: active
                                        ? "rgba(212, 175, 55, 0.12)"
                                        : "transparent",

                                    "&:hover": {
                                        bgcolor: active
                                            ? "rgba(212, 175, 55, 0.16)"
                                            : "#f7f7f7",
                                    },

                                    "&::before": active
                                        ? {
                                            content: '""',
                                            position: "absolute",
                                            right: 0,
                                            top: 8,
                                            bottom: 8,
                                            width: 3,
                                            borderRadius: 3,
                                            bgcolor: "#D4AF37",
                                        }
                                        : {},
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 38,
                                        color: active ? "#D4AF37" : "#777",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: active ? 700 : 500,
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Typography
                    sx={{
                        px: 1.5,
                        mt: 3,
                        mb: 1,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#999",
                    }}
                >
                    سیستم
                </Typography>

                <List disablePadding>
                    {bottomMenuItems.map((item) => {
                        const active = isActive(item.path);

                        return (
                            <ListItemButton
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    minHeight: 46,
                                    mb: 0.5,
                                    px: 1.5,
                                    borderRadius: 2,
                                    color: active ? "#111" : "#666",
                                    bgcolor: active
                                        ? "rgba(212, 175, 55, 0.12)"
                                        : "transparent",

                                    "&:hover": {
                                        bgcolor: active
                                            ? "rgba(212, 175, 55, 0.16)"
                                            : "#f7f7f7",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 38,
                                        color: active ? "#D4AF37" : "#777",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: active ? 700 : 500,
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            <Divider />

            {/* Admin profile */}
            <Box
                sx={{
                    p: 1.5,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "#f8f8f8",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor: "#111",
                            color: "#D4AF37",
                            fontSize: 14,
                            fontWeight: 800,
                        }}
                    >
                        A
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#222",
                            }}
                        >
                            مدیر سیستم
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#888",
                                mt: 0.2,
                            }}
                        >
                            Administrator
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={handleLogout}
                        sx={{
                            color: "#888",
                            "&:hover": {
                                color: "#d32f2f",
                                bgcolor: "#fff0f0",
                            },
                        }}
                    >
                        <LogoutRounded fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box
            dir="rtl"
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#f7f7f7",
            }}
        >
            <CssBaseline />

            {/* Desktop Sidebar */}
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
                            borderLeft: "1px solid #e7e7e7",
                            borderRight: "none",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
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

            {/* Main */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                }}
            >
                {/* Header */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: "#fff",
                        color: "#111",
                        borderBottom: "1px solid #e7e7e7",
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: { xs: 64, md: 72 },
                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
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
                            {isMobile && (
                                <IconButton
                                    onClick={() => setMobileOpen(true)}
                                    sx={{
                                        color: "#111",
                                    }}
                                >
                                    <MenuRounded />
                                </IconButton>
                            )}

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 17,
                                            sm: 19,
                                        },
                                        fontWeight: 800,
                                    }}
                                >
                                    {getPageTitle()}
                                </Typography>

                                <Typography
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "block",
                                        },
                                        fontSize: 11,
                                        color: "#999",
                                        mt: 0.3,
                                    }}
                                >
                                    مدیریت فروشگاه Golden Tower
                                </Typography>
                            </Box>
                        </Box>

                        {/* Header Admin */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: {
                                        xs: "none",
                                        sm: "block",
                                    },
                                    textAlign: "right",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                >
                                    مدیر سیستم
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        color: "#999",
                                    }}
                                >
                                    Admin
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: 38,
                                    height: 38,
                                    bgcolor: "#111",
                                    color: "#D4AF37",
                                    fontSize: 13,
                                    fontWeight: 800,
                                }}
                            >
                                A
                            </Avatar>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
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
        </Box>
    );
}