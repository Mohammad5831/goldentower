
// src/pages/user panel/UserOrders.jsx

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
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  SearchOutlined,
  VisibilityOutlined,
  ShoppingBagOutlined,
  AccessTimeOutlined,
  LocalShippingOutlined,
  CheckCircleOutline,
  CancelOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

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

const getField = (
  object,
  fields,
  fallback = null
) => {
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

const getOrderId = (order) => {
  return getField(
    order,
    ["uuid", "order_uuid", "id", "_id"],
    "-"
  );
};

const getOrderDateValue = (order) => {
  return getField(
    order,
    ["created_at", "createdAt", "date"],
    null
  );
};

const getOrderDate = (order) => {
  const date = getOrderDateValue(order);

  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("fa-IR");
};

const getOrderPriceValue = (order) => {
  return getField(
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
};

const getOrderPrice = (order) => {
  const price = getOrderPriceValue(order);
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price || "0";
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
        icon: (
          <AccessTimeOutlined fontSize="small" />
        ),
      };

    case "paid":
    case "confirmed":
    case "accepted":
      return {
        label: "تایید شده",
        color: "info",
        icon: (
          <CheckCircleOutline fontSize="small" />
        ),
      };

    case "shipped":
    case "shipping":
      return {
        label: "ارسال شده",
        color: "primary",
        icon: (
          <LocalShippingOutlined fontSize="small" />
        ),
      };

    case "delivered":
    case "completed":
      return {
        label: "تحویل شده",
        color: "success",
        icon: (
          <CheckCircleOutline fontSize="small" />
        ),
      };

    case "cancelled":
    case "canceled":
      return {
        label: "لغو شده",
        color: "error",
        icon: (
          <CancelOutlined fontSize="small" />
        ),
      };

    case "failed":
      return {
        label: "ناموفق",
        color: "error",
        icon: (
          <CancelOutlined fontSize="small" />
        ),
      };

    default:
      return {
        label: status || "نامشخص",
        color: "default",
        icon: null,
      };
  }
};

export default function UserOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [page, setPage] = useState(1);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const rowsPerPage = 8;

  // ==========================================
  // Snackbar
  // ==========================================

  const showMessage = (
    message,
    severity = "error"
  ) => {
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

      setOrders(
        getOrdersArray(response.data)
      );
    } catch (error) {
      console.error(
        "User orders error:",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // Filter
  // ==========================================

  const filteredOrders = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(
        getOrderId(order)
      ).toLowerCase();

      const status = normalizeStatus(
        getOrderStatus(order)
      );

      const matchesSearch =
        !normalizedSearch ||
        orderId.includes(normalizedSearch);

      let matchesStatus = true;

      if (statusFilter !== "all") {
        if (statusFilter === "pending") {
          matchesStatus = [
            "pending",
            "pending_payment",
            "waiting",
            "processing",
            "paid",
            "confirmed",
            "accepted",
          ].includes(status);
        } else if (
          statusFilter === "shipped"
        ) {
          matchesStatus = [
            "shipped",
            "shipping",
          ].includes(status);
        } else if (
          statusFilter === "delivered"
        ) {
          matchesStatus = [
            "delivered",
            "completed",
          ].includes(status);
        } else if (
          statusFilter === "cancelled"
        ) {
          matchesStatus = [
            "cancelled",
            "canceled",
          ].includes(status);
        } else if (
          statusFilter === "failed"
        ) {
          matchesStatus =
            status === "failed";
        }
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [orders, search, statusFilter]);

  // ==========================================
  // Pagination
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length / rowsPerPage
    )
  );

  const paginatedOrders = useMemo(() => {
    const start =
      (page - 1) * rowsPerPage;

    return filteredOrders.slice(
      start,
      start + rowsPerPage
    );
  }, [filteredOrders, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ==========================================
  // Statistics
  // ==========================================

  const statistics = useMemo(() => {
    let pending = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;

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
        ["shipped", "shipping"].includes(
          status
        )
      ) {
        shipped++;
      }

      if (
        ["delivered", "completed"].includes(
          status
        )
      ) {
        delivered++;
      }

      if (
        ["cancelled", "canceled"].includes(
          status
        )
      ) {
        cancelled++;
      }
    });

    return {
      total: orders.length,
      pending,
      shipped,
      delivered,
      cancelled,
    };
  }, [orders]);

  // ==========================================
  // Stat Card
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
              justifyContent:
                "space-between",
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
                  color:
                    "text.secondary",
                  mb: 1,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 26,
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
                justifyContent:
                  "center",

                color: GOLD,
                backgroundColor:
                  "#fffdf5",
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <Box
      sx={{
        width: "100%",
        direction: "ltr",
      }}
    >
      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <Box
        sx={{
          mb: 3,

          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },

          justifyContent:
            "space-between",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 2,
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
            سفارش‌های من
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color:
                "text.secondary",
            }}
          >
            مشاهده و مدیریت سفارش‌های
            ثبت شده شما
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <RefreshOutlined />
          }
          onClick={fetchOrders}
          disabled={isLoading}
          sx={{
            borderColor: "#ddd",
            color: "#444",
            borderRadius: 2,

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
            بروزرسانی
          </Box>
        </Button>
      </Box>

      {/* ====================================== */}
      {/* Statistics */}
      {/* ====================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <StatCard
            title="کل سفارش‌ها"
            value={statistics.total}
            icon={
              <ShoppingBagOutlined
                sx={{
                  fontSize: 25,
                }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <StatCard
            title="در حال بررسی"
            value={statistics.pending}
            icon={
              <AccessTimeOutlined
                sx={{
                  fontSize: 25,
                }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <StatCard
            title="ارسال شده"
            value={statistics.shipped}
            icon={
              <LocalShippingOutlined
                sx={{
                  fontSize: 25,
                }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 6,
            lg: 2.4,
          }}
        >
          <StatCard
            title="تحویل شده"
            value={statistics.delivered}
            icon={
              <CheckCircleOutline
                sx={{
                  fontSize: 25,
                }}
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 6,
            lg: 2.4,
          }}
        >
          <StatCard
            title="لغو شده"
            value={statistics.cancelled}
            icon={
              <CancelOutlined
                sx={{
                  fontSize: 25,
                }}
              />
            }
          />
        </Grid>
      </Grid>

      {/* ====================================== */}
      {/* Filters */}
      {/* ====================================== */}

      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border:
            "1px solid #e8e8e8",
          backgroundColor: "#fff",
        }}
      >
        <CardContent
          sx={{
            p: 2,

            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              direction: "ltr",
            }}
          >
            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="جستجو بر اساس شماره سفارش..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined
                        sx={{
                          color:
                            "#999",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  direction: "ltr",

                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius: 2,
                    },
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>
                  وضعیت سفارش
                </InputLabel>

                <Select
                  value={statusFilter}
                  label="وضعیت سفارش"
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    direction: "ltr",
                  }}
                >
                  <MenuItem value="all">
                    همه سفارش‌ها
                  </MenuItem>

                  <MenuItem value="pending">
                    در حال بررسی
                  </MenuItem>

                  <MenuItem value="shipped">
                    ارسال شده
                  </MenuItem>

                  <MenuItem value="delivered">
                    تحویل شده
                  </MenuItem>

                  <MenuItem value="cancelled">
                    لغو شده
                  </MenuItem>

                  <MenuItem value="failed">
                    ناموفق
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* Orders Table */}
      {/* ====================================== */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border:
            "1px solid #e8e8e8",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 850,
              direction: "ltr",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "#fafafa",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#333",
                    textAlign: "center",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  سفارش
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#333",
                    textAlign: "center",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  تاریخ
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#333",
                    textAlign: "center",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  مبلغ
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#333",
                    textAlign: "center",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  وضعیت
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 800,
                    color: "#333",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  عملیات
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      borderBottom:
                        "none",
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: 300,

                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      <CircularProgress
                        size={34}
                        sx={{
                          color: GOLD,
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      borderBottom:
                        "none",
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: 300,

                        display: "flex",
                        flexDirection:
                          "column",

                        alignItems:
                          "center",
                        justifyContent:
                          "center",

                        direction:
                          "rtl",

                        textAlign:
                          "center",
                      }}
                    >
                      <ShoppingBagOutlined
                        sx={{
                          fontSize: 52,
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
                        سفارشی پیدا نشد
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            "text.secondary",
                        }}
                      >
                        در حال حاضر
                        سفارشی با این
                        مشخصات وجود
                        ندارد.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map(
                  (order) => {
                    const orderId =
                      getOrderId(
                        order
                      );

                    const status =
                      getStatusInfo(
                        getOrderStatus(
                          order
                        )
                      );

                    return (
                      <TableRow
                        key={String(
                          orderId
                        )}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th":
                            {
                              border: 0,
                            },
                        }}
                      >
                        {/* Order */}

                        <TableCell>
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1.5,

                              direction:
                                "ltr",
                            }}
                          >
                            <Box
                              sx={{
                                width: 42,
                                height: 42,

                                flexShrink:
                                  0,

                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",

                                borderRadius:
                                  2,

                                color:
                                  GOLD,

                                backgroundColor:
                                  "#fffdf5",
                              }}
                            >
                              <ShoppingBagOutlined />
                            </Box>

                            <Box
                              sx={{
                                direction:
                                  "rtl",
                                textAlign:
                                  "right",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color:
                                    "#222",
                                }}
                              >
                                سفارش #
                                {String(
                                  orderId
                                ).slice(
                                  -8
                                )}
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    "text.secondary",
                                }}
                              >
                                شناسه سفارش
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Date */}

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                "#555",
                              whiteSpace:
                                "nowrap",

                              direction:
                                "rtl",
                            }}
                          >
                            {getOrderDate(
                              order
                            )}
                          </Typography>
                        </TableCell>

                        {/* Price */}

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                700,
                              color:
                                "#222",
                              whiteSpace:
                                "nowrap",

                              direction:
                                "rtl",
                            }}
                          >
                            {getOrderPrice(
                              order
                            )}{" "}
                            تومان
                          </Typography>
                        </TableCell>

                        {/* Status */}

                        <TableCell>
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
                              fontSize:
                                11,
                              direction:
                                "rtl",
                            }}
                          />
                        </TableCell>

                        {/* Action */}

                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={
                              <VisibilityOutlined />
                            }
                            onClick={() =>
                              navigate(
                                `/user/orders/${orderId}`
                              )
                            }
                            sx={{
                              borderColor:
                                "#ddd",
                              color:
                                "#444",
                              borderRadius:
                                2,

                              direction:
                                "ltr",

                              "&:hover":
                                {
                                  borderColor:
                                    GOLD,
                                  color:
                                    GOLD,
                                  backgroundColor:
                                    "#fffdf5",
                                },
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                direction:
                                  "rtl",
                              }}
                            >
                              مشاهده
                            </Box>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ==================================== */}
        {/* Pagination */}
        {/* ==================================== */}

        {!isLoading &&
          filteredOrders.length >
            rowsPerPage && (
            <>
              <Divider />

              <Box
                sx={{
                  py: 2.5,
                  px: 3,

                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",

                  gap: 2,

                  flexWrap:
                    "wrap",

                  direction: "ltr",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "text.secondary",

                    direction:
                      "rtl",
                  }}
                >
                  نمایش{" "}
                  {(page - 1) *
                    rowsPerPage +
                    1}{" "}
                  تا{" "}
                  {Math.min(
                    page *
                      rowsPerPage,
                    filteredOrders.length
                  )}{" "}
                  از{" "}
                  {
                    filteredOrders.length
                  }{" "}
                  سفارش
                </Typography>

                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(
                    _event,
                    value
                  ) =>
                    setPage(value)
                  }
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root.Mui-selected":
                      {
                        backgroundColor:
                          GOLD,
                        color:
                          "#fff",
                      },

                    "& .MuiPaginationItem-root.Mui-selected:hover":
                      {
                        backgroundColor:
                          GOLD,
                      },
                  }}
                />
              </Box>
            </>
          )}
      </Card>

      {/* ====================================== */}
      {/* Snackbar */}
      {/* ====================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={
            handleCloseSnackbar
          }
          severity={
            snackbar.severity
          }
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