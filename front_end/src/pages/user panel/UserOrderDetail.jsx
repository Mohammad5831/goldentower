
// src/pages/user panel/UserOrderDetail.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBackOutlined,
  ShoppingBagOutlined,
  AccessTimeOutlined,
  LocalShippingOutlined,
  CheckCircleOutline,
  CancelOutlined,
  LocationOnOutlined,
  PersonOutline,
  PhoneOutlined,
  ReceiptLongOutlined,
  RefreshOutlined,
  Inventory2Outlined,
  PaymentOutlined,
} from "@mui/icons-material";

// ======================================================
// Constants
// ======================================================

const API_URL = "https://api.goldentower.ir";
const GOLD = "#D4AF37";

// ======================================================
// Authentication
// ======================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
};

// ======================================================
// Helpers
// ======================================================

const getField = (
  object,
  fields,
  fallback = null
) => {
  if (!object) {
    return fallback;
  }

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

const normalizeStatus = (status) => {
  if (
    status === undefined ||
    status === null
  ) {
    return "unknown";
  }

  return String(status)
    .trim()
    .toLowerCase();
};

const getOrderStatus = (order) => {
  return normalizeStatus(
    getField(
      order,
      [
        "status",
        "order_status",
        "orderStatus",
      ],
      "unknown"
    )
  );
};

const STATUS_GROUPS = {
  pending: [
    "pending",
    "pending_payment",
    "waiting",
    "processing",
  ],

  confirmed: [
    "paid",
    "confirmed",
    "accepted",
  ],

  shipped: [
    "shipped",
    "shipping",
    "sent",
  ],

  delivered: [
    "delivered",
    "completed",
  ],

  cancelled: [
    "cancelled",
    "canceled",
  ],

  failed: [
    "failed",
  ],
};

const getStatusInfo = (status) => {
  const normalized =
    normalizeStatus(status);

  if (
    STATUS_GROUPS.pending.includes(
      normalized
    )
  ) {
    return {
      label: "در حال بررسی",
      color: "warning",
      icon: (
        <AccessTimeOutlined fontSize="small" />
      ),
    };
  }

  if (
    STATUS_GROUPS.confirmed.includes(
      normalized
    )
  ) {
    return {
      label: "تایید شده",
      color: "info",
      icon: (
        <CheckCircleOutline fontSize="small" />
      ),
    };
  }

  if (
    STATUS_GROUPS.shipped.includes(
      normalized
    )
  ) {
    return {
      label: "ارسال شده",
      color: "primary",
      icon: (
        <LocalShippingOutlined fontSize="small" />
      ),
    };
  }

  if (
    STATUS_GROUPS.delivered.includes(
      normalized
    )
  ) {
    return {
      label: "تحویل شده",
      color: "success",
      icon: (
        <CheckCircleOutline fontSize="small" />
      ),
    };
  }

  if (
    STATUS_GROUPS.cancelled.includes(
      normalized
    )
  ) {
    return {
      label: "لغو شده",
      color: "error",
      icon: (
        <CancelOutlined fontSize="small" />
      ),
    };
  }

  if (
    STATUS_GROUPS.failed.includes(
      normalized
    )
  ) {
    return {
      label: "ناموفق",
      color: "error",
      icon: (
        <CancelOutlined fontSize="small" />
      ),
    };
  }

  return {
    label: "نامشخص",
    color: "default",
    icon: null,
  };
};

const getOrderId = (order) => {
  return getField(
    order,
    [
      "uuid",
      "order_uuid",
      "id",
      "_id",
    ],
    "-"
  );
};

const getOrderDateValue = (order) => {
  return getField(
    order,
    [
      "created_at",
      "createdAt",
      "date",
    ],
    null
  );
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "fa-IR"
  );
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "fa-IR"
  );
};

const formatPrice = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toLocaleString("fa-IR");
};

const getOrderPrice = (order) => {
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

// ======================================================
// Response Parser
// ======================================================

const getOrderObject = (data) => {
  if (!data) {
    return null;
  }

  if (
    data.order &&
    typeof data.order === "object"
  ) {
    return data.order;
  }

  if (
    data.data &&
    typeof data.data === "object" &&
    !Array.isArray(data.data)
  ) {
    if (data.data.order) {
      return data.data.order;
    }

    return data.data;
  }

  return data;
};

const getItems = (order) => {
  const items = getField(
    order,
    [
      "items",
      "order_items",
      "orderItems",
      "products",
    ],
    []
  );

  return Array.isArray(items)
    ? items
    : [];
};

const getItemName = (item) => {
  return getField(
    item,
    [
      "product_name",
      "productName",
      "name",
      "title",
    ],
    "محصول"
  );
};

const getItemQuantity = (item) => {
  const quantity = getField(
    item,
    [
      "quantity",
      "qty",
      "count",
    ],
    1
  );

  const number = Number(quantity);

  return Number.isNaN(number)
    ? 1
    : number;
};

const getItemPrice = (item) => {
  return getField(
    item,
    [
      "price",
      "unit_price",
      "unitPrice",
      "product_price",
    ],
    0
  );
};

const getItemImage = (item) => {
  return getField(
    item,
    [
      "image",
      "image_url",
      "imageUrl",
      "product_image",
      "productImage",
    ],
    null
  );
};

const getAddress = (order) => {
  const address = getField(
    order,
    [
      "address",
      "shipping_address",
      "shippingAddress",
      "delivery_address",
      "deliveryAddress",
    ],
    null
  );

  if (
    address &&
    typeof address === "object"
  ) {
    return address;
  }

  return null;
};

const getCustomer = (order) => {
  const customer = getField(
    order,
    [
      "customer",
      "user",
      "buyer",
    ],
    null
  );

  if (
    customer &&
    typeof customer === "object"
  ) {
    return customer;
  }

  return null;
};

// ======================================================
// Component
// ======================================================

export default function UserOrderDetail() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [order, setOrder] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity: "error",
    });

  // ====================================================
  // Snackbar
  // ====================================================

  const showMessage = useCallback(
    (
      message,
      severity = "error"
    ) => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const closeSnackbar =
    useCallback(() => {
      setSnackbar((current) => ({
        ...current,
        open: false,
      }));
    }, []);

  // ====================================================
  // Fetch Order
  // ====================================================

  const fetchOrder = useCallback(
    async () => {
      if (!uuid) {
        showMessage(
          "شناسه سفارش معتبر نیست."
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const token = getToken();

        const response =
          await axios.get(
            `${API_URL}/api/orders/${uuid}`,
            {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {},
            }
          );

        const orderData =
          getOrderObject(
            response.data
          );

        if (!orderData) {
          throw new Error(
            "Order not found"
          );
        }

        setOrder(orderData);
      } catch (error) {
        console.error(
          "User order detail error:",
          error
        );

        const message =
          error.response?.data
            ?.message ||
          "دریافت جزئیات سفارش با خطا مواجه شد.";

        showMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [uuid, showMessage]
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // ====================================================
  // Derived Data
  // ====================================================

  const orderId = useMemo(
    () => getOrderId(order),
    [order]
  );

  const orderStatus = useMemo(
    () =>
      getOrderStatus(order),
    [order]
  );

  const statusInfo = useMemo(
    () =>
      getStatusInfo(
        orderStatus
      ),
    [orderStatus]
  );

  const items = useMemo(
    () => getItems(order),
    [order]
  );

  const address = useMemo(
    () => getAddress(order),
    [order]
  );

  const customer = useMemo(
    () => getCustomer(order),
    [order]
  );

  const totalPrice = getOrderPrice(
    order
  );

  const orderDate = formatDate(
    getOrderDateValue(order)
  );

  const customerName =
    getField(
      customer || order,
      [
        "full_name",
        "fullName",
        "name",
        "customer_name",
        "customerName",
      ],
      "-"
    );

  const customerPhone =
    getField(
      customer || order,
      [
        "phone",
        "phone_number",
        "phoneNumber",
        "mobile",
      ],
      "-"
    );

  // ====================================================
  // Timeline
  // ====================================================

  const timeline = [
    {
      key: "pending",
      title: "ثبت سفارش",
      description:
        "سفارش شما با موفقیت ثبت شده است.",
      icon: (
        <ReceiptLongOutlined />
      ),
      active:
        STATUS_GROUPS.pending.includes(
          orderStatus
        ) ||
        STATUS_GROUPS.confirmed.includes(
          orderStatus
        ) ||
        STATUS_GROUPS.shipped.includes(
          orderStatus
        ) ||
        STATUS_GROUPS.delivered.includes(
          orderStatus
        ),
    },
    {
      key: "confirmed",
      title: "تایید سفارش",
      description:
        "سفارش شما تایید و آماده پردازش شده است.",
      icon: (
        <CheckCircleOutline />
      ),
      active:
        STATUS_GROUPS.confirmed.includes(
          orderStatus
        ) ||
        STATUS_GROUPS.shipped.includes(
          orderStatus
        ) ||
        STATUS_GROUPS.delivered.includes(
          orderStatus
        ),
    },
    {
      key: "shipped",
      title: "ارسال سفارش",
      description:
        "سفارش شما برای ارسال آماده شده است.",
      icon: (
        <LocalShippingOutlined />
      ),
      active:
        STATUS_GROUPS.shipped.includes(
          orderStatus
        ) ||
        STATUS_GROUPS.delivered.includes(
          orderStatus
        ),
    },
    {
      key: "delivered",
      title: "تحویل سفارش",
      description:
        "سفارش به شما تحویل داده شده است.",
      icon: (
        <Inventory2Outlined />
      ),
      active:
        STATUS_GROUPS.delivered.includes(
          orderStatus
        ),
    },
  ];

  // ====================================================
  // Loading
  // ====================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "ltr",
        }}
      >
        <CircularProgress
          size={36}
          sx={{
            color: GOLD,
          }}
        />
      </Box>
    );
  }

  // ====================================================
  // Error / Not Found
  // ====================================================

  if (!order) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "ltr",
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
            border:
              "1px solid #e8e8e8",
          }}
        >
          <CardContent
            sx={{
              py: 6,
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <ShoppingBagOutlined
              sx={{
                fontSize: 52,
                color: "#ccc",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              سفارش پیدا نشد
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color:
                  "text.secondary",
                mb: 3,
              }}
            >
              امکان دریافت اطلاعات
              این سفارش وجود ندارد.
            </Typography>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  "/user/orders"
                )
              }
              sx={{
                borderColor: "#ddd",
                color: "#444",
                borderRadius: 2,

                "&:hover": {
                  borderColor: GOLD,
                  color: GOLD,
                  backgroundColor:
                    "#fffdf5",
                },
              }}
            >
              بازگشت به سفارش‌ها
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        direction: "ltr",
        boxSizing: "border-box",
      }}
    >
      {/* ==================================================
          Header
      ================================================== */}

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

          direction: "ltr",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            direction: "ltr",
          }}
        >
          <IconButton
            onClick={() =>
              navigate(
                "/user/orders"
              )
            }
            sx={{
              border:
                "1px solid #e5e5e5",
              borderRadius: 2,
              color: "#444",

              "&:hover": {
                borderColor: GOLD,
                color: GOLD,
                backgroundColor:
                  "#fffdf5",
              },
            }}
          >
            <ArrowBackOutlined />
          </IconButton>

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
              }}
            >
              جزئیات سفارش
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color:
                  "text.secondary",
              }}
            >
              سفارش #
              {String(orderId).slice(
                -8
              )}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            direction: "ltr",
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlined />
            }
            onClick={fetchOrder}
            sx={{
              borderColor: "#ddd",
              color: "#444",
              borderRadius: 2,

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
      </Box>

      {/* ==================================================
          Order Summary
      ================================================== */}

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
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Grid
            container
            spacing={3}
            sx={{
              direction: "ltr",
            }}
          >
            <Grid
              size={{
                xs: 12,
                md: 4,
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
                  شماره سفارش
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#111",
                    direction: "ltr",
                    textAlign: "right",
                  }}
                >
                  #{String(
                    orderId
                  ).slice(-8)}
                </Typography>
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
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
                  تاریخ ثبت سفارش
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#222",
                  }}
                >
                  {orderDate}
                </Typography>
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
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
                  وضعیت سفارش
                </Typography>

                <Chip
                  size="small"
                  label={
                    statusInfo.label
                  }
                  color={
                    statusInfo.color
                  }
                  icon={
                    statusInfo.icon
                  }
                  sx={{
                    direction: "rtl",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ==================================================
          Timeline
      ================================================== */}

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
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Box
            sx={{
              direction: "rtl",
              textAlign: "right",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
              }}
            >
              وضعیت سفارش
            </Typography>
          </Box>

          <Stack spacing={0}>
            {timeline.map(
              (step, index) => (
                <Box
                  key={step.key}
                  sx={{
                    display: "flex",
                    gap: 2,
                    direction: "rtl",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,

                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",

                        borderRadius:
                          "50%",

                        backgroundColor:
                          step.active
                            ? "#fffdf5"
                            : "#f5f5f5",

                        color:
                          step.active
                            ? GOLD
                            : "#aaa",

                        border:
                          step.active
                            ? `1px solid ${GOLD}`
                            : "1px solid #ddd",
                      }}
                    >
                      {step.icon}
                    </Box>

                    {index <
                      timeline.length -
                        1 && (
                      <Box
                        sx={{
                          width: 1,
                          flex: 1,
                          minHeight: 35,
                          backgroundColor:
                            timeline[
                              index + 1
                            ].active
                              ? GOLD
                              : "#e5e5e5",
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      pb:
                        index <
                        timeline.length -
                          1
                          ? 3
                          : 0,

                      pt: 0.5,

                      textAlign:
                        "right",
                      direction:
                        "rtl",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color:
                          step.active
                            ? "#222"
                            : "#999",
                        mb: 0.5,
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          "text.secondary",
                      }}
                    >
                      {
                        step.description
                      }
                    </Typography>
                  </Box>
                </Box>
              )
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ==================================================
          Main Content
      ================================================== */}

      <Grid
        container
        spacing={3}
        sx={{
          direction: "ltr",
        }}
      >
        {/* ==================================================
            Order Items
        ================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 2,
              border:
                "1px solid #e8e8e8",
              backgroundColor:
                "#fff",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  direction:
                    "rtl",
                }}
              >
                <ShoppingBagOutlined
                  sx={{
                    color: GOLD,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  محصولات سفارش
                </Typography>
              </Box>

              {items.length ===
              0 ? (
                <Box
                  sx={{
                    py: 5,
                    textAlign:
                      "center",
                    direction:
                      "rtl",
                  }}
                >
                  <Inventory2Outlined
                    sx={{
                      fontSize: 46,
                      color: "#ccc",
                      mb: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      color:
                        "text.secondary",
                    }}
                  >
                    اطلاعات محصولات
                    این سفارش در دسترس
                    نیست.
                  </Typography>
                </Box>
              ) : (
                <Stack
                  divider={
                    <Divider />
                  }
                >
                  {items.map(
                    (
                      item,
                      index
                    ) => {
                      const image =
                        getItemImage(
                          item
                        );

                      const name =
                        getItemName(
                          item
                        );

                      const quantity =
                        getItemQuantity(
                          item
                        );

                      const price =
                        getItemPrice(
                          item
                        );

                      return (
                        <Box
                          key={`${name}-${index}`}
                          sx={{
                            py: 2,

                            display:
                              "flex",
                            alignItems:
                              "center",

                            gap: 2,

                            direction:
                              "ltr",
                          }}
                        >
                          <Box
                            sx={{
                              width: 76,
                              height: 76,
                              flexShrink:
                                0,

                              borderRadius:
                                2,

                              border:
                                "1px solid #eee",

                              overflow:
                                "hidden",

                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",

                              backgroundColor:
                                "#fafafa",
                            }}
                          >
                            {image ? (
                              <Box
                                component="img"
                                src={image}
                                alt={name}
                                sx={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "cover",
                                }}
                              />
                            ) : (
                              <ShoppingBagOutlined
                                sx={{
                                  color:
                                    "#ccc",
                                  fontSize:
                                    30,
                                }}
                              />
                            )}
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,

                              direction:
                                "rtl",
                              textAlign:
                                "right",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight:
                                  800,
                                color:
                                  "#222",
                                mb: 0.5,
                              }}
                            >
                              {name}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  "text.secondary",
                              }}
                            >
                              تعداد:{" "}
                              {quantity}
                            </Typography>
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
                                fontWeight:
                                  800,
                                color:
                                  "#222",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {formatPrice(
                                price
                              )}{" "}
                              تومان
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ==================================================
            Payment Summary
        ================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 2,
              border:
                "1px solid #e8e8e8",
              backgroundColor:
                "#fff",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  direction:
                    "rtl",
                }}
              >
                <PaymentOutlined
                  sx={{
                    color: GOLD,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  خلاصه پرداخت
                </Typography>
              </Box>

              <Stack
                spacing={2}
                sx={{
                  direction:
                    "rtl",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                    direction:
                      "rtl",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        "text.secondary",
                    }}
                  >
                    مبلغ سفارش
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight:
                        700,
                    }}
                  >
                    {formatPrice(
                      totalPrice
                    )}{" "}
                    تومان
                  </Typography>
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                    direction:
                      "rtl",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight:
                        800,
                    }}
                  >
                    مبلغ نهایی
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight:
                        900,
                      color: GOLD,
                      fontSize: 18,
                    }}
                  >
                    {formatPrice(
                      totalPrice
                    )}{" "}
                    تومان
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================================================
            Customer Information
        ================================================== */}

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 2,
              border:
                "1px solid #e8e8e8",
              backgroundColor:
                "#fff",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  direction:
                    "rtl",
                }}
              >
                <PersonOutline
                  sx={{
                    color: GOLD,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  اطلاعات گیرنده
                </Typography>
              </Box>

              <Stack
                spacing={2}
                sx={{
                  direction:
                    "rtl",
                }}
              >
                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1.5,
                    direction:
                      "rtl",
                  }}
                >
                  <PersonOutline
                    sx={{
                      color:
                        "#999",
                    }}
                  />

                  <Box
                    sx={{
                      direction:
                        "rtl",
                      textAlign:
                        "right",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "text.secondary",
                      }}
                    >
                      نام
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      {customerName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1.5,
                    direction:
                      "rtl",
                  }}
                >
                  <PhoneOutlined
                    sx={{
                      color:
                        "#999",
                    }}
                  />

                  <Box
                    sx={{
                      direction:
                        "rtl",
                      textAlign:
                        "right",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "text.secondary",
                      }}
                    >
                      شماره تماس
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          700,
                        direction:
                          "ltr",
                        textAlign:
                          "right",
                      }}
                    >
                      {customerPhone}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================================================
            Address
        ================================================== */}

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 2,
              border:
                "1px solid #e8e8e8",
              backgroundColor:
                "#fff",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  direction:
                    "rtl",
                }}
              >
                <LocationOnOutlined
                  sx={{
                    color: GOLD,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  آدرس ارسال
                </Typography>
              </Box>

              {address ? (
                <Box
                  sx={{
                    direction:
                      "rtl",
                    textAlign:
                      "right",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight:
                        2,
                      color:
                        "#444",
                    }}
                  >
                    {getField(
                      address,
                      [
                        "full_address",
                        "fullAddress",
                        "address",
                        "text",
                      ],
                      "-"
                    )}
                  </Typography>

                  {getField(
                    address,
                    [
                      "postal_code",
                      "postalCode",
                      "zip_code",
                      "zipCode",
                    ],
                    null
                  ) && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color:
                          "text.secondary",
                      }}
                    >
                      کد پستی:{" "}
                      {getField(
                        address,
                        [
                          "postal_code",
                          "postalCode",
                          "zip_code",
                          "zipCode",
                        ]
                      )}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "text.secondary",
                    direction:
                      "rtl",
                    textAlign:
                      "right",
                  }}
                >
                  آدرس ارسال ثبت نشده
                  است.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==================================================
          Snackbar
      ================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={
          closeSnackbar
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={
            closeSnackbar
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
