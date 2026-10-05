
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";

import {
  ShoppingBagOutlined,
  LocalShippingOutlined,
  CheckCircleOutline,
  AccessTimeOutlined,
  ArrowBack,
  Inventory2Outlined,
  PersonOutline,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

const API_URL = "https://api.goldentower.ir";
const GOLD = "#D4AF37";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
};

const getField = (object, fields, fallback = null) => {
  if (!object) return fallback;

  for (const field of fields) {
    if (
      object[field] !== undefined &&
      object[field] !== null
    ) {
      return object[field];
    }
  }

  return fallback;
};

const getOrderId = (order) => {
  return getField(
    order,
    ["uuid", "order_uuid", "id", "_id"],
    "-"
  );
};

const getOrderDate = (order) => {
  const date = getField(
    order,
    ["created_at", "createdAt", "date"],
    null
  );

  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("fa-IR");
};

const getOrderPrice = (order) => {
  const price = getField(
    order,
    [
      "total_price",
      "totalPrice",
      "total_amount",
      "totalAmount",
      "price",
    ],
    0
  );

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  return numericPrice.toLocaleString("fa-IR");
};

const getOrderStatus = (order) => {
  return getField(
    order,
    ["status", "order_status", "orderStatus"],
    "unknown"
  );
};

const normalizeStatus = (status) => {
  if (!status) return "unknown";

  return String(status)
    .trim()
    .toLowerCase();
};

const getStatusInfo = (status) => {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "pending":
    case "pending_payment":
    case "waiting":
    case "processing":
      return {
        label: "در حال بررسی",
        color: "warning",
        icon: <AccessTimeOutlined fontSize="small" />,
      };

    case "paid":
    case "confirmed":
    case "accepted":
      return {
        label: "تایید شده",
        color: "info",
        icon: <CheckCircleOutline fontSize="small" />,
      };

    case "shipped":
    case "shipping":
      return {
        label: "ارسال شده",
        color: "primary",
        icon: <LocalShippingOutlined fontSize="small" />,
      };

    case "delivered":
    case "completed":
      return {
        label: "تحویل شده",
        color: "success",
        icon: <CheckCircleOutline fontSize="small" />,
      };

    case "cancelled":
    case "canceled":
      return {
        label: "لغو شده",
        color: "error",
        icon: null,
      };

    case "failed":
      return {
        label: "ناموفق",
        color: "error",
        icon: null,
      };

    default:
      return {
        label: status || "نامشخص",
        color: "default",
        icon: null,
      };
  }
};

const getOrdersArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.orders)) {
    return data.orders;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.orders)) {
    return data.data.orders;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showMessage = (message, severity = "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({
      ...current,
      open: false,
    }));
  };

  // ==========================================
  // Fetch Orders
  // ==========================================

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);

      try {
        const token = getToken();

        const response = await axios.get(
          `${API_URL}/api/orders`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        setOrders(getOrdersArray(response.data));
      } catch (error) {
        console.error(
          "User dashboard orders error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "دریافت سفارش‌ها با خطا مواجه شد.";

        showMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ==========================================
  // Statistics
  // ==========================================

  const statistics = useMemo(() => {
    const total = orders.length;

    let pending = 0;
    let shipped = 0;
    let delivered = 0;

    orders.forEach((order) => {
      const status = normalizeStatus(
        getOrderStatus(order)
      );

      if (
        [
          "pending",
          "pending_payment",
          "waiting",
          "processing",
          "paid",
          "confirmed",
          "accepted",
        ].includes(status)
      ) {
        pending++;
      }

      if (
        ["shipped", "shipping"].includes(status)
      ) {
        shipped++;
      }

      if (
        ["delivered", "completed"].includes(status)
      ) {
        delivered++;
      }
    });

    return {
      total,
      pending,
      shipped,
      delivered,
    };
  }, [orders]);

  // ==========================================
  // Recent Orders
  // ==========================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(
          getField(
            a,
            ["created_at", "createdAt", "date"],
            0
          )
        ).getTime();

        const dateB = new Date(
          getField(
            b,
            ["created_at", "createdAt", "date"],
            0
          )
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  // ==========================================
  // User
  // ==========================================

  const firstName =
    getField(
      user,
      ["first_name", "firstName"],
      ""
    ) || "کاربر";

  // ==========================================
  // Statistics Card
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon,
  }) => {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 2,
          border: "1px solid #e8e8e8",
          backgroundColor: "#fff",
        }}
      >
        <CardContent
          sx={{
            p: 2.5,

            "&:last-child": {
              pb: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              direction: "ltr",
            }}
          >
            <Box
              sx={{
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 27,
                  fontWeight: 800,
                  color: "#111",
                }}
              >
                {value}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,

                borderRadius: 2,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: GOLD,
                backgroundColor: "#fffdf5",
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        direction: "ltr",
      }}
    >
      {/* ======================================== */}
      {/* Header */}
      {/* ======================================== */}

      <Box
        sx={{
          mb: 4,

          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },

          justifyContent: "space-between",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 2,

          direction: "ltr",
        }}
      >
        <Box
          sx={{
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#111",
              mb: 0.7,
              textAlign: 'left'
            }}
          >
            سلام {firstName} 👋
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            به پنل کاربری برج طلایی خوش آمدید.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<PersonOutline />}
          onClick={() => navigate("/user/profile")}
          sx={{
            borderColor: "#ddd",
            color: "#444",
            borderRadius: 2,

            direction: "ltr",

            "&:hover": {
              borderColor: GOLD,
              color: GOLD,
              backgroundColor: "#fffdf5",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              direction: "rtl",
            }}
          >
            پروفایل من
          </Box>
        </Button>
      </Box>

      {/* ======================================== */}
      {/* Statistics */}
      {/* ======================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 4,
        }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="کل سفارش‌ها"
            value={statistics.total}
            icon={
              <ShoppingBagOutlined
                sx={{ fontSize: 25 }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="سفارش‌های در حال بررسی"
            value={statistics.pending}
            icon={
              <AccessTimeOutlined
                sx={{ fontSize: 25 }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="سفارش‌های ارسال شده"
            value={statistics.shipped}
            icon={
              <LocalShippingOutlined
                sx={{ fontSize: 25 }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="سفارش‌های تحویل شده"
            value={statistics.delivered}
            icon={
              <Inventory2Outlined
                sx={{ fontSize: 25 }}
              />
            }
          />
        </Grid>
      </Grid>

      {/* ======================================== */}
      {/* Main Content */}
      {/* ======================================== */}

      <Grid
        container
        spacing={3}
        sx={{
          direction: "ltr",
        }}
      >
        {/* ====================================== */}
        {/* Recent Orders */}
        {/* ====================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e8e8e8",
              backgroundColor: "#fff",
            }}
          >
            <CardContent
              sx={{
                p: 3,

                "&:last-child": {
                  pb: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  mb: 2,

                  direction: "ltr",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#111",

                    direction: "rtl",
                    textAlign: "right",
                  }}
                >
                  سفارش‌های اخیر
                </Typography>

                <Button
                  size="small"
                  endIcon={<ArrowBack />}
                  onClick={() =>
                    navigate("/user/orders")
                  }
                  sx={{
                    color: GOLD,
                    fontWeight: 700,

                    direction: "ltr",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      direction: "rtl",
                    }}
                  >
                    همه سفارش‌ها
                  </Box>
                </Button>
              </Box>

              <Divider />

              {/* Loading */}

              {isLoading ? (
                <Box
                  sx={{
                    minHeight: 250,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress
                    size={32}
                    sx={{
                      color: GOLD,
                    }}
                  />
                </Box>
              ) : recentOrders.length === 0 ? (
                /* Empty */

                <Box
                  sx={{
                    minHeight: 250,

                    display: "flex",
                    flexDirection: "column",

                    alignItems: "center",
                    justifyContent: "center",

                    textAlign: "center",

                    direction: "rtl",
                  }}
                >
                  <ShoppingBagOutlined
                    sx={{
                      fontSize: 48,
                      color: "#ccc",
                      mb: 1.5,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#555",
                      mb: 0.5,
                    }}
                  >
                    هنوز سفارشی ثبت نکرده‌اید
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    سفارش‌های شما در این قسمت نمایش
                    داده می‌شوند.
                  </Typography>
                </Box>
              ) : (
                /* Orders */

                <List disablePadding>
                  {recentOrders.map(
                    (order, index) => {
                      const status =
                        getStatusInfo(
                          getOrderStatus(order)
                        );

                      const orderId =
                        getOrderId(order);

                      return (
                        <React.Fragment
                          key={String(orderId)}
                        >
                          <ListItem
                            disableGutters
                            sx={{
                              py: 2,

                              cursor: "pointer",

                              direction: "ltr",

                              "&:hover": {
                                backgroundColor:
                                  "#fafafa",
                              },
                            }}
                            onClick={() =>
                              navigate(
                                `/user/orders/${orderId}`
                              )
                            }
                          >
                            {/* Order Icon */}

                            <Box
                              sx={{
                                width: 42,
                                height: 42,

                                mr: 1.5,

                                flexShrink: 0,

                                display: "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",

                                borderRadius: 2,

                                backgroundColor:
                                  "#fffdf5",

                                color: GOLD,
                              }}
                            >
                              <ShoppingBagOutlined />
                            </Box>

                            {/* Order Info */}

                            <ListItemText
                              sx={{
                                direction: "rtl",
                                textAlign: "right",
                              }}
                              primary={
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#222",
                                  }}
                                >
                                  سفارش #
                                  {String(
                                    orderId
                                  ).slice(-8)}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    color:
                                      "text.secondary",
                                  }}
                                >
                                  {getOrderDate(
                                    order
                                  )}
                                </Typography>
                              }
                            />

                            {/* Price + Status */}

                            <Box
                              sx={{
                                display: "flex",
                                alignItems:
                                  "flex-end",

                                gap: 1,

                                flexDirection:
                                  "column",

                                ml: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#222",
                                  whiteSpace:
                                    "nowrap",

                                  direction: "rtl",
                                }}
                              >
                                {getOrderPrice(
                                  order
                                )}{" "}
                                تومان
                              </Typography>

                              <Chip
                                size="small"
                                label={
                                  status.label
                                }
                                color={
                                  status.color
                                }
                                icon={
                                  status.icon
                                }
                                sx={{
                                  fontSize: 11,
                                  direction:
                                    "rtl",
                                }}
                              />
                            </Box>
                          </ListItem>

                          {index <
                            recentOrders.length -
                              1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ====================================== */}
        {/* Quick Access */}
        {/* ====================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e8e8e8",
              backgroundColor: "#fff",
            }}
          >
            <CardContent
              sx={{
                p: 3,

                "&:last-child": {
                  pb: 3,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#111",

                  mb: 2,

                  direction: "rtl",
                  textAlign: "left",
                }}
              >
                دسترسی سریع
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {/* Orders */}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <ShoppingBagOutlined />
                  }
                  onClick={() =>
                    navigate("/user/orders")
                  }
                  sx={{
                    justifyContent: "flex-start",

                    height: 48,

                    borderRadius: 2,

                    borderColor: "#e5e5e5",
                    color: "#444",

                    direction: "ltr",

                    "&:hover": {
                      borderColor: GOLD,
                      color: GOLD,
                      backgroundColor:
                        "#fffdf5",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      direction: "rtl",
                    }}
                  >
                    مشاهده سفارش‌های من
                  </Box>
                </Button>

                {/* Profile */}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <PersonOutline />
                  }
                  onClick={() =>
                    navigate("/user/profile")
                  }
                  sx={{
                    justifyContent: "flex-start",

                    height: 48,

                    borderRadius: 2,

                    borderColor: "#e5e5e5",
                    color: "#444",

                    direction: "ltr",

                    "&:hover": {
                      borderColor: GOLD,
                      color: GOLD,
                      backgroundColor:
                        "#fffdf5",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      direction: "rtl",
                    }}
                  >
                    ویرایش اطلاعات حساب
                  </Box>
                </Button>

                {/* Addresses */}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <LocalShippingOutlined />
                  }
                  onClick={() =>
                    navigate("/user/addresses")
                  }
                  sx={{
                    justifyContent: "flex-start",

                    height: 48,

                    borderRadius: 2,

                    borderColor: "#e5e5e5",
                    color: "#444",

                    direction: "ltr",

                    "&:hover": {
                      borderColor: GOLD,
                      color: GOLD,
                      backgroundColor:
                        "#fffdf5",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      direction: "rtl",
                    }}
                  >
                    مدیریت آدرس‌ها
                  </Box>
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ======================================== */}
      {/* Snackbar */}
      {/* ======================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            direction: "rtl",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
