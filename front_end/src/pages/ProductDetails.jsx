import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";

import {
  ChevronLeftRounded,
  ShoppingCartRounded,
  FlashOnRounded,
  Inventory2Outlined,
  LocalShippingOutlined,
  VerifiedRounded,
  ArrowBackRounded,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";
const IMAGE_URL = "http://localhost:5000/api/image";

const ProductDetails = () => {
  const { product_uuid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     Fetch Product
  ========================= */

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/products/${product_uuid}`
        );

        setProduct(res.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);

        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات محصول",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (product_uuid) {
      fetchProductDetail();
    }
  }, [product_uuid]);

  /* =========================
     Helpers
  ========================= */

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "تماس بگیرید";
    }

    return `${new Intl.NumberFormat("fa-IR").format(
      Number(price)
    )} تومان`;
  };

  const generalSpecs = useMemo(() => {
    return product?.GeneralSpecs || [];
  }, [product]);

  const detailedSpecs = useMemo(() => {
    return product?.DetailedSpecs || [];
  }, [product]);

  const groupedDetailedSpecs = useMemo(() => {
    return detailedSpecs.reduce((groups, spec) => {
      const groupName =
        spec.group_name || "سایر مشخصات";

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(spec);

      return groups;
    }, {});
  }, [detailedSpecs]);

  /* =========================
     Cart
  ========================= */

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;

    try {
      setAddingToCart(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setSnackbar({
        open: true,
        message: `«${product.name}» به سبد خرید اضافه شد`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "افزودن محصول به سبد خرید انجام نشد",
        severity: "error",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    setSnackbar({
      open: true,
      message: "خرید فوری در حال حاضر در دسترس نیست",
      severity: "info",
    });
  };

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={38}
            sx={{
              color: "#D4AF37",
              mb: 1.5,
            }}
          />

          <Typography
            sx={{
              color: "#666",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            در حال دریافت اطلاعات محصول...
          </Typography>
        </Box>
      </Box>
    );
  }

  /* =========================
     Not Found
  ========================= */

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          bgcolor: "#fafafa",
          direction: "rtl",
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
              textAlign: "center",
              borderRadius: "16px",
              border: "1px solid #e8e8e8",
              boxShadow: "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 900,
                color: "#222",
                mb: 1,
              }}
            >
              محصول پیدا نشد
            </Typography>

            <Typography
              sx={{
                color: "#777",
                fontSize: "0.85rem",
                mb: 2.5,
              }}
            >
              محصول موردنظر وجود ندارد یا اطلاعات آن
              در دسترس نیست.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{
                bgcolor: "#D4AF37",
                color: "#171717",
                borderRadius: "9px",
                px: 3,
                py: 1,
                fontWeight: 900,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#C9A227",
                  boxShadow: "none",
                },
              }}
            >
              بازگشت به محصولات
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const hasDiscount =
    Number(product.discount) > 0 &&
    Number(product.original_price) >
      Number(product.current_price);

  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        minHeight: "100vh",
        direction: "rtl",
        py: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* =========================
            Breadcrumb
        ========================= */}

        <Breadcrumbs
          separator={
            <ChevronLeftRounded
              sx={{
                fontSize: 16,
                color: "#aaa",
              }}
            />
          }
          sx={{
            mb: {
              xs: 2,
              md: 2.5,
            },
          }}
        >
          <Typography
            onClick={() => navigate("/")}
            sx={{
              fontSize: "0.78rem",
              color: "#888",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                color: "#A47E0B",
              },
            }}
          >
            خانه
          </Typography>

          <Typography
            onClick={() => navigate("/products")}
            sx={{
              fontSize: "0.78rem",
              color: "#888",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                color: "#A47E0B",
              },
            }}
          >
            محصولات
          </Typography>

          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "#222",
              fontWeight: 700,
              maxWidth: {
                xs: 160,
                sm: 300,
                md: 420,
              },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.name}
          </Typography>
        </Breadcrumbs>

        {/* =========================
            Main Product
        ========================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.05fr) minmax(360px, 0.95fr)",
            },
            gap: {
              xs: 2,
              md: 3,
              lg: 4,
            },
            alignItems: "start",
          }}
        >
          {/* =========================
              Product Image
          ========================= */}

          <Card
            sx={{
              width: "100%",
              height: {
                xs: 360,
                sm: 440,
                md: 500,
              },
              borderRadius: {
                xs: "16px",
                md: "18px",
              },
              bgcolor: "#fff",
              border: "1px solid #e7e7e7",
              boxShadow: "none",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {hasDiscount && (
              <Box
                sx={{
                  position: "absolute",
                  top: {
                    xs: 12,
                    md: 16,
                  },
                  right: {
                    xs: 12,
                    md: 16,
                  },
                  zIndex: 2,
                  bgcolor: "#D4AF37",
                  color: "#171717",
                  px: 1.2,
                  py: 0.55,
                  borderRadius: "7px",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                }}
              >
                {product.discount}% تخفیف
              </Box>
            )}

            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "#f7f7f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },
              }}
            >
              {product.image ? (
                <Box
                  component="img"
                  src={`${IMAGE_URL}/${product.image}`}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition:
                      "transform 0.35s ease",
                    "&:hover": {
                      transform: {
                        xs: "none",
                        md: "scale(1.025)",
                      },
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "#aaa",
                  }}
                >
                  <Inventory2Outlined
                    sx={{
                      fontSize: 42,
                      color: "#d0d0d0",
                      mb: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    تصویری برای این محصول وجود ندارد
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>

          {/* =========================
              Product Information
          ========================= */}

          <Box
            sx={{
              minWidth: 0,
              bgcolor: "#fff",
              border: "1px solid #e7e7e7",
              borderRadius: {
                xs: "16px",
                md: "18px",
              },
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            {/* Brand + Original */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 1.8,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  bgcolor: "#faf6e7",
                  color: "#9A7710",
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 900,
                }}
              >
                {product.brand || "Golden Tower"}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.45,
                  color: "#4B8B5A",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                <VerifiedRounded
                  sx={{
                    fontSize: 16,
                  }}
                />

                محصول اصل
              </Box>
            </Box>

            {/* Product Name */}

            <Typography
              sx={{
                color: "#171717",
                fontSize: {
                  xs: "1.2rem",
                  sm: "1.35rem",
                  md: "1.45rem",
                },
                fontWeight: 900,
                lineHeight: 1.8,
                mb: 1.8,
              }}
            >
              {product.name}
            </Typography>

            <Divider />

            {/* Price */}

            <Box
              sx={{
                py: 2,
              }}
            >
              {hasDiscount && (
                <Typography
                  sx={{
                    color: "#999",
                    fontSize: "0.78rem",
                    textDecoration: "line-through",
                    mb: 0.3,
                  }}
                >
                  {formatPrice(
                    product.original_price
                  )}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0.8,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    color: "#A47E0B",
                    fontSize: {
                      xs: "1.35rem",
                      sm: "1.5rem",
                    },
                    fontWeight: 950,
                    lineHeight: 1.5,
                  }}
                >
                  {formatPrice(
                    product.current_price
                  )}
                </Typography>
              </Box>
            </Box>

            {/* General Specs */}

            {generalSpecs.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: "#222",
                    fontSize: "0.88rem",
                    fontWeight: 900,
                    mb: 1,
                  }}
                >
                  مشخصات کلی
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #ededed",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {generalSpecs
                    .slice(0, 6)
                    .map((spec, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "0.8fr 1.2fr",
                          gap: 2,
                          alignItems: "center",
                          px: 1.4,
                          py: 0.9,
                          bgcolor:
                            index % 2 === 0
                              ? "#fff"
                              : "#fafafa",
                          borderBottom:
                            index <
                            Math.min(
                              generalSpecs.length,
                              6
                            ) -
                              1
                              ? "1px solid #eeeeee"
                              : "none",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#777",
                            fontSize: "0.73rem",
                            fontWeight: 700,
                          }}
                        >
                          {spec.label}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#222",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            textAlign: "left",
                            wordBreak: "break-word",
                          }}
                        >
                          {spec.value}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>
            )}

            {/* Benefits */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                },
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  minWidth: 0,
                  px: 1,
                  py: 0.9,
                  bgcolor: "#fafafa",
                  borderRadius: "9px",
                }}
              >
                <Inventory2Outlined
                  sx={{
                    color: "#D4AF37",
                    fontSize: 19,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    color: "#555",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    lineHeight: 1.5,
                  }}
                >
                  تضمین اصالت کالا
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  minWidth: 0,
                  px: 1,
                  py: 0.9,
                  bgcolor: "#fafafa",
                  borderRadius: "9px",
                }}
              >
                <LocalShippingOutlined
                  sx={{
                    color: "#D4AF37",
                    fontSize: 19,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    color: "#555",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    lineHeight: 1.5,
                  }}
                >
                  ارسال به سراسر کشور
                </Typography>
              </Box>
            </Box>

            {/* Buttons */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1.25fr 0.75fr",
                },
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={handleAddToCart}
                disabled={addingToCart}
                startIcon={
                  addingToCart ? (
                    <CircularProgress
                      size={17}
                      sx={{
                        color: "#171717",
                      }}
                    />
                  ) : (
                    <ShoppingCartRounded />
                  )
                }
                sx={{
                  minHeight: 46,
                  borderRadius: "9px",
                  bgcolor: "#D4AF37",
                  color: "#171717",
                  fontSize: "0.8rem",
                  fontWeight: 900,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#C9A227",
                    boxShadow: "none",
                  },
                }}
              >
                افزودن به سبد
              </Button>

              <Button
                variant="outlined"
                onClick={handleBuyNow}
                startIcon={<FlashOnRounded />}
                sx={{
                  minHeight: 46,
                  borderRadius: "9px",
                  borderColor: "#ddd",
                  color: "#333",
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  "&:hover": {
                    borderColor: "#D4AF37",
                    bgcolor: "#fffdf5",
                    color: "#9A7710",
                  },
                }}
              >
                خرید فوری
              </Button>
            </Box>
          </Box>
        </Box>

        {/* =========================
            Detailed Specifications
        ========================= */}

        {Object.keys(groupedDetailedSpecs).length >
          0 && (
          <Box
            sx={{
              mt: {
                xs: 4,
                md: 5,
              },
            }}
          >
            {/* Section Header */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 27,
                  bgcolor: "#D4AF37",
                  borderRadius: 5,
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: "#171717",
                    fontSize: {
                      xs: "1.05rem",
                      md: "1.2rem",
                    },
                    fontWeight: 900,
                    lineHeight: 1.5,
                  }}
                >
                  مشخصات فنی
                </Typography>

                <Typography
                  sx={{
                    color: "#888",
                    fontSize: "0.72rem",
                    mt: 0.15,
                  }}
                >
                  جزئیات و اطلاعات فنی محصول
                </Typography>
              </Box>
            </Box>

            {/* Specification Groups */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  lg: "repeat(3, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {Object.entries(
                groupedDetailedSpecs
              ).map(([groupName, specs]) => (
                <Box
                  key={groupName}
                  sx={{
                    bgcolor: "#fff",
                    border: "1px solid #e7e7e7",
                    borderRadius: "13px",
                    overflow: "hidden",
                  }}
                >
                  {/* Group Header */}

                  <Box
                    sx={{
                      px: 1.6,
                      py: 1.15,
                      bgcolor: "#faf8ef",
                      borderBottom:
                        "1px solid #eee8d2",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#9A7710",
                        fontSize: "0.8rem",
                        fontWeight: 900,
                      }}
                    >
                      {groupName}
                    </Typography>
                  </Box>

                  {/* Group Items */}

                  <Box sx={{ p: 0.7 }}>
                    {specs.map(
                      (spec, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "0.9fr 1.1fr",
                            gap: 1.5,
                            px: 1,
                            py: 0.9,
                            borderBottom:
                              index !==
                              specs.length - 1
                                ? "1px solid #eeeeee"
                                : "none",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#777",
                              fontSize:
                                "0.7rem",
                              fontWeight: 700,
                              lineHeight: 1.7,
                            }}
                          >
                            {spec.label}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#222",
                              fontSize:
                                "0.72rem",
                              fontWeight: 800,
                              textAlign: "left",
                              lineHeight: 1.7,
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {spec.value}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* =========================
            Back To Products
        ========================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: {
              xs: 3.5,
              md: 4,
            },
            mb: 1,
          }}
        >
          <Button
            onClick={() => navigate("/products")}
            endIcon={<ArrowBackRounded />}
            sx={{
              color: "#666",
              fontSize: "0.78rem",
              fontWeight: 800,
              borderRadius: "8px",
              px: 1.5,
              "&:hover": {
                bgcolor: "#fff",
                color: "#A47E0B",
              },
            }}
          >
            بازگشت به محصولات
          </Button>
        </Box>
      </Container>

      {/* =========================
          Snackbar
      ========================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            borderRadius: "9px",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;