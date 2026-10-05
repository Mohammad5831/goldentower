import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

import {
  getLocalCart,
  removeFromDB,
  removeFromLocalCart,
  syncLocalCart,
  updateLocalCartQty,
  CART_UPDATED_EVENT,
} from "../service/CartLocal";

import { calculating } from "../service/Calculate";

const API_URL = "http://localhost:5000";
const GOLD = "#D4AF37";

/* =========================
   Helpers
========================= */

const getToken = () => {
  return (
    Cookies.get("token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
};

const getImageUrl = (image) => {
  if (!image) {
    return "/placeholder-product.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_URL}/api/image/${image}`;
};

const formatPrice = (price) => {
  return (
    new Intl.NumberFormat("en-IR").format(
      Math.max(0, Number(price) || 0)
    ) + " تومان"
  );
};

const getStock = (item) => {
  const stock =
    item.inStock ??
    item.stock ??
    item.inventory ??
    item.quantity_available;

  if (
    stock === undefined ||
    stock === null ||
    stock === ""
  ) {
    return Infinity;
  }

  return Math.max(0, Number(stock) || 0);
};

/* =========================
   Component
========================= */

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [updatingUUID, setUpdatingUUID] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     Snackbar
  ========================= */

  const showMessage = useCallback(
    (message, severity = "success") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  /* =========================
     Calculate
  ========================= */

  const totals = useMemo(() => {
    return calculating(items);
  }, [items]);

  const total = totals.tp;
  const originalTotal = totals.top;

  const discount = Math.max(
    0,
    originalTotal - total
  );

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0),
      0
    );
  }, [items]);

  /* =========================
     Load Cart
  ========================= */

  const fetchCart = useCallback(async () => {
    setLoading(true);

    try {
      const localCart = getLocalCart();

      /*
       * فعلاً منطق پروژه شما بر پایه
       * LocalStorage است.
       *
       * اگر کاربر login باشد،
       * cart موجود در local با DB sync می‌شود.
       */

      const token = getToken();

      if (token) {
        const result =
          await syncLocalCart(token);

        if (result.success) {
          /*
           * بعد از sync، LocalStorage
           * شامل نسخه DB است.
           */

          setItems(getLocalCart());
        } else {
          /*
           * اگر sync شکست خورد،
           * حداقل سبد لوکال را نمایش بده.
           */

          setItems(localCart);

          if (localCart.length === 0) {
            showMessage(
              result.message ||
                "دریافت سبد خرید انجام نشد",
              "error"
            );
          }
        }
      } else {
        setItems(localCart);
      }
    } catch (error) {
      console.error(
        "fetchCart error:",
        error
      );

      setItems(getLocalCart());

      showMessage(
        "خطا در دریافت سبد خرید",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* =========================
     Listen Local Cart Changes
  ========================= */

  useEffect(() => {
    const handleCartUpdate = () => {
      setItems(getLocalCart());
    };

    window.addEventListener(
      CART_UPDATED_EVENT,
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        CART_UPDATED_EVENT,
        handleCartUpdate
      );
    };
  }, []);

  /* =========================
     Update Quantity
  ========================= */

  const updateQuantity = useCallback(
    async (item, newQuantity) => {
      const uuid = item.product_uuid;

      if (!uuid) {
        return;
      }

      const stock = getStock(item);

      let quantity = Math.max(
        1,
        Number(newQuantity) || 1
      );

      if (
        stock !== Infinity &&
        quantity > stock
      ) {
        quantity = stock;

        showMessage(
          `حداکثر ${stock} عدد از این محصول موجود است`,
          "warning"
        );
      }

      if (quantity < 1) {
        return;
      }

      setUpdatingUUID(uuid);

      /*
       * ابتدا UI را سریع تغییر می‌دهیم.
       */

      const updatedCart =
        updateLocalCartQty(
          uuid,
          quantity
        );

      setItems(updatedCart);

      /*
       * اگر کاربر login باشد،
       * تغییر تعداد را به DB هم ارسال می‌کنیم.
       */

      const token = getToken();

      if (token) {
        try {
          await axios.put(
            `${API_URL}/api/carts/${uuid}`,
            {
              quantity,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error(
            "update cart quantity error:",
            error
          );

          /*
           * اگر endpoint PUT در بک‌اند
           * وجود نداشته باشد، UI خراب نمی‌شود.
           */

          showMessage(
            error?.response?.data?.message ||
              "تغییر تعداد در سرور انجام نشد",
            "error"
          );
        }
      }

      setUpdatingUUID(null);
    },
    [showMessage]
  );

  /* =========================
     Remove Item
  ========================= */

  const removeItem = useCallback(
    async (uuid) => {
      if (!uuid) {
        return;
      }

      const token = getToken();

      /*
       * اول UI و LocalStorage
       */

      removeFromLocalCart(uuid);

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.product_uuid !== uuid
        )
      );

      /*
       * بعد DB
       */

      if (token) {
        const result =
          await removeFromDB(
            token,
            uuid
          );

        if (!result.success) {
          showMessage(
            result.message ||
              "حذف از سرور انجام نشد",
            "error"
          );

          return;
        }
      }

      showMessage(
        "محصول از سبد خرید حذف شد",
        "success"
      );
    },
    [showMessage]
  );

  /* =========================
     Checkout
  ========================= */

  const handleCheckout = useCallback(
    async () => {
      const token = getToken();

      if (!token) {
        showMessage(
          "برای ادامه پرداخت ابتدا وارد حساب کاربری شوید",
          "warning"
        );

        setTimeout(() => {
          navigate("/login");
        }, 800);

        return;
      }

      if (items.length === 0) {
        showMessage(
          "سبد خرید شما خالی است",
          "warning"
        );

        return;
      }

      try {
        setCheckoutLoading(true);

        /*
         * قبل از پرداخت، LocalStorage
         * با DB sync می‌شود.
         */

        const syncResult =
          await syncLocalCart(token);

        if (!syncResult.success) {
          showMessage(
            syncResult.message ||
              "همگام‌سازی سبد خرید انجام نشد",
            "error"
          );

          return;
        }

        /*
         * درخواست پرداخت
         */

        const response =
          await axios.post(
            `${API_URL}/api/payment/request`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const paymentUrl =
          response?.data?.url;

        if (!paymentUrl) {
          showMessage(
            response?.data?.message ||
              "لینک پرداخت دریافت نشد",
            "error"
          );

          return;
        }

        window.location.href =
          paymentUrl;
      } catch (error) {
        console.error(
          "checkout error:",
          error
        );

        showMessage(
          error?.response?.data?.message ||
            "خطا در ایجاد درخواست پرداخت",
          "error"
        );
      } finally {
        setCheckoutLoading(false);
      }
    },
    [
      items.length,
      navigate,
      showMessage,
    ]
  );

  /* =========================
     Continue Shopping
  ========================= */

  const handleContinueShopping =
    useCallback(() => {
      navigate("/");
    }, [navigate]);

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <Box
        sx={{
          direction: "ltr",
          minHeight: "60vh",
          bgcolor: "#fafafa",
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton
            variant="rounded"
            height={150}
            sx={{
              borderRadius: 3,
              mb: 3,
            }}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  variant="rounded"
                  height={180}
                  sx={{
                    borderRadius: 3,
                    mb: 2,
                  }}
                />
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Skeleton
                variant="rounded"
                height={350}
                sx={{
                  borderRadius: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  /* =========================
     Empty Cart
  ========================= */

  if (items.length === 0) {
    return (
      <Box
        sx={{
          direction: "ltr",
          minHeight: "70vh",
          bgcolor: "#fafafa",
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8e8e8",
              borderRadius: 3,
              py: 9,
              textAlign: "center",
              bgcolor: "#fff",
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: 90,
                color: "#d5d5d5",
                mb: 2,
              }}
            />

            <Box
              sx={{
                direction: "rtl",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                color="#111"
                gutterBottom
              >
                سبد خرید شما خالی است
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                هنوز محصولی به سبد خرید اضافه نکرده‌اید.
              </Typography>

              <Button
                variant="contained"
                onClick={
                  handleContinueShopping
                }
                endIcon={
                  <ArrowBackIcon />
                }
                sx={{
                  bgcolor: GOLD,
                  color: "#111",
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 4,
                  py: 1.3,
                  "&:hover": {
                    bgcolor: "#b89424",
                  },
                }}
              >
                ادامه خرید
              </Button>
            </Box>
          </Card>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={closeSnackbar}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  /* =========================
     Main
  ========================= */

  return (
    <Box
      sx={{
        direction: "ltr",
        bgcolor: "#fafafa",
        minHeight: "70vh",
        py: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* =========================
            Header
        ========================= */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8e8e8",
            borderRadius: 3,
            bgcolor: "#fff",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              "&:last-child": {
                pb: {
                  xs: 2.5,
                  md: 3,
                },
              },
            }}
          >
            <Box
              sx={{
                direction: "ltr",
                textAlign: "left",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={900}
                color="#111"
                sx={{
                  fontSize: {
                    xs: "1.6rem",
                    md: "2rem",
                  },
                }}
              >
                سبد خرید
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.7 }}
              >
                {totalQuantity} عدد محصول در سبد خرید شما
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* =========================
            Content
        ========================= */}

        <Grid
          container
          spacing={3}
          alignItems="flex-start"
        >
          {/* =========================
              Items
          ========================= */}

          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {items.map((item) => {
                const stock = getStock(item);

                const quantity =
                  Number(item.quantity) || 1;

                const isUpdating =
                  updatingUUID ===
                  item.product_uuid;

                const itemOriginalTotal =
                  Number(
                    item.original_price || 0
                  ) * quantity;

                const itemTotal =
                  Number(
                    item.current_price || 0
                  ) * quantity;

                return (
                  <Card
                    key={
                      item.product_uuid
                    }
                    elevation={0}
                    sx={{
                      border:
                        "1px solid #e8e8e8",
                      borderRadius: 3,
                      bgcolor: "#fff",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: {
                          xs: 1.5,
                          sm: 2,
                        },
                        "&:last-child": {
                          pb: {
                            xs: 1.5,
                            sm: 2,
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: {
                            xs: "flex-start",
                            sm: "center",
                          },
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },
                        }}
                      >
                        {/* Image */}

                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              sm: 130,
                            },
                            height: {
                              xs: 190,
                              sm: 130,
                            },
                            flexShrink: 0,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "#f3f3f3",
                          }}
                        >
                          <CardMedia
                            component="img"
                            src={getImageUrl(
                              item.image
                            )}
                            alt={
                              item.name ||
                              "محصول"
                            }
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src =
                                "/placeholder-product.jpg";
                            }}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>

                        {/* Information */}

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            width: {
                              xs: "100%",
                              sm: "auto",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              direction: "ltr",
                              textAlign:
                                "left",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={800}
                              color="#111"
                              sx={{
                                mb: 0.7,
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              {item.name ||
                                "محصول بدون نام"}
                            </Typography>

                            {item.model && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 1.5,
                                }}
                              >
                                مدل:{" "}
                                {item.model}
                              </Typography>
                            )}

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              قیمت واحد:
                            </Typography>

                            <Typography
                              fontWeight={800}
                              color="#111"
                            >
                              {formatPrice(
                                item.current_price
                              )}
                            </Typography>
                          </Box>

                          {/* Quantity */}

                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "space-between",
                              gap: 2,
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                border:
                                  "1px solid #dedede",
                                borderRadius: 2,
                                overflow:
                                  "hidden",
                              }}
                            >
                              <IconButton
                                size="small"
                                disabled={
                                  isUpdating ||
                                  quantity <= 1
                                }
                                onClick={() =>
                                  updateQuantity(
                                    item,
                                    quantity -
                                      1
                                  )
                                }
                                sx={{
                                  borderRadius: 0,
                                  color: "#111",
                                  "&:hover": {
                                    bgcolor:
                                      "#f5f5f5",
                                  },
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>

                              <Typography
                                sx={{
                                  minWidth: 38,
                                  textAlign:
                                    "center",
                                  fontWeight: 800,
                                }}
                              >
                                {quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                disabled={
                                  isUpdating ||
                                  (stock !==
                                    Infinity &&
                                    quantity >=
                                      stock)
                                }
                                onClick={() =>
                                  updateQuantity(
                                    item,
                                    quantity +
                                      1
                                  )
                                }
                                sx={{
                                  borderRadius: 0,
                                  color: "#111",
                                  "&:hover": {
                                    bgcolor:
                                      "#f5f5f5",
                                  },
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            {stock !==
                              Infinity && (
                              <Typography
                                variant="caption"
                                color={
                                  stock <= 3
                                    ? "error.main"
                                    : "text.secondary"
                                }
                              >
                                موجودی:{" "}
                                {stock} عدد
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Price + Delete */}

                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              sm: 160,
                            },
                            flexShrink: 0,
                            direction:
                              "ltr",
                            textAlign:
                              "left",
                            alignSelf: {
                              xs: "stretch",
                              sm: "center",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            جمع این محصول
                          </Typography>

                          <Typography
                            variant="h6"
                            fontWeight={900}
                            sx={{
                              color: GOLD,
                              mt: 0.5,
                            }}
                          >
                            {formatPrice(
                              itemTotal
                            )}
                          </Typography>

                          {itemOriginalTotal >
                            itemTotal && (
                            <Typography
                              variant="caption"
                              sx={{
                                textDecoration:
                                  "line-through",
                                color:
                                  "text.secondary",
                              }}
                            >
                              {formatPrice(
                                itemOriginalTotal
                              )}
                            </Typography>
                          )}

                          <Box
                            sx={{
                              mt: 1,
                              display:
                                "flex",
                              justifyContent:
                                "flex-end",
                            }}
                          >
                            <Button
                              size="small"
                              color="error"
                              startIcon={
                                <DeleteIcon />
                              }
                              onClick={() =>
                                removeItem(
                                  item.product_uuid
                                )
                              }
                              sx={{
                                borderRadius: 2,
                              }}
                            >
                              حذف
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Grid>

          {/* =========================
              Summary
          ========================= */}

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                border:
                  "1px solid #e8e8e8",
                borderRadius: 3,
                bgcolor: "#fff",
                position: {
                  md: "sticky",
                },
                top: {
                  md: 90,
                },
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
                    direction:
                      "ltr",
                    textAlign:
                      "left",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    color="#111"
                    sx={{
                      pb: 1.5,
                      mb: 1.5,
                      borderBottom:
                        `2px solid ${GOLD}`,
                    }}
                  >
                    خلاصه سفارش
                  </Typography>

                  {/* Total */}

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <Typography>
                      جمع کل:
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      {formatPrice(
                        originalTotal
                      )}
                    </Typography>
                  </Box>

                  {/* Discount */}

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <Typography>
                      تخفیف:
                    </Typography>

                    <Typography
                      fontWeight={800}
                      sx={{
                        color:
                          discount > 0
                            ? "#2e7d32"
                            : "text.primary",
                      }}
                    >
                      {discount > 0
                        ? `- ${formatPrice(
                            discount
                          )}`
                        : "۰ تومان"}
                    </Typography>
                  </Box>

                  {/* Shipping */}

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <Typography>
                      هزینه ارسال:
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      رایگان
                    </Typography>
                  </Box>

                  <Divider
                    sx={{
                      my: 1.5,
                    }}
                  />

                  {/* Final */}

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      alignItems:
                        "center",
                    }}
                  >
                    <Typography
                      fontWeight={900}
                    >
                      مبلغ نهایی:
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={900}
                      sx={{
                        color: GOLD,
                      }}
                    >
                      {formatPrice(total)}
                    </Typography>
                  </Box>

                  {/* Checkout */}

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={
                      checkoutLoading ||
                      items.length === 0
                    }
                    onClick={
                      handleCheckout
                    }
                    startIcon={
                      <ShoppingCartIcon />
                    }
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: "#111",
                      color: "#fff",
                      fontWeight: 900,
                      "&:hover": {
                        bgcolor: "#222",
                      },
                      "&.Mui-disabled": {
                        bgcolor:
                          "#d5d5d5",
                        color: "#888",
                      },
                    }}
                  >
                    {checkoutLoading
                      ? "در حال انتقال به پرداخت..."
                      : "ادامه پرداخت"}
                  </Button>

                  {/* Continue Shopping */}

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={
                      handleContinueShopping
                    }
                    sx={{
                      mt: 1.5,
                      py: 1.2,
                      borderRadius: 2,
                      borderColor:
                        "#d5d5d5",
                      color: "#111",
                      fontWeight: 700,
                      "&:hover": {
                        borderColor:
                          GOLD,
                        bgcolor:
                          "rgba(212,175,55,0.05)",
                      },
                    }}
                  >
                    ادامه خرید
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* =========================
          Snackbar
      ========================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          sx={{
            width: "100%",
            direction: "ltr",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}