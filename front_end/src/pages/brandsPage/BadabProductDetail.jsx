// src/pages/productDetail/BadabDetail.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Grid,
  Typography,
  CardMedia,
  Card,
  CardContent,
  Button,
  Skeleton,
  Modal,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { addToLocalCart } from "../../service/CartLocal";

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 0),
}));

const MainImageWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

const ThumbnailGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SpecCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.03)",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  display: "block",
  margin: "auto",
  marginTop: theme.spacing(3),
  padding: theme.spacing(1, 4),
}));

export default function BadabDetail() {
  const theme = useTheme();
  const { product_uuid } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.goldentower.ir/api/products/${product_uuid}`
      );
      setProduct(data.product);
    } catch (err) {
      console.error("Error loading product", err);
    } finally {
      setLoading(false);
    }
  }, [product_uuid]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const specs = useMemo(() => {
    if (!product?.Size) return [];
    return [
      { label: "طول", value: product.Size.length, icon: jacuzzi_402_length },
      { label: "عرض", value: product.Size.width, icon: jacuzzi_402_width },
      { label: "ارتفاع", value: product.Size.height, icon: jacuzzi_402_height },
    ];
  }, [product]);

  const openImage = (src) => {
    setModalSrc(src);
    setOpenModal(true);
  };

  const closeImage = () => {
    setOpenModal(false);
    setModalSrc("");
  };

  const addToCart = async () => {
    setAdding(true);
    const token = Cookies.get("token");
    if (token) {
      try {
        await axios.post(
          "https://api.goldentower.ir/api/carts",
          {
            product_uuid,
            quantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSnackbar({
          open: true,
          message: `محصول "${product?.name}" با موفقیت به سبد اضافه شد`,
          severity: "success",
        });
      } catch (err) {
        console.error("Add to cart failed", err);
        setSnackbar({
          open: true,
          message: "خطا در افزودن به سبد خرید",
          severity: "error",
        });
      } finally {
        setAdding(false);
      }
    } else {
      addToLocalCart(product_uuid, quantity);
      setAdding(false);
    };
  };

  const closeSnackbar = () =>
    setSnackbar((s) => ({ ...s, open: false }));


  if (loading) {
    return (
      <PageContainer maxWidth="md">
        <Skeleton variant="rectangular" height={400} animation="wave" />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      {/* Main Image */}
      <MainImageWrapper>
        <CardMedia
          component="img"
          src={`https://api.goldentower.ir/api/image/${product.image}`}
          alt={product.name}
          loading="lazy"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: theme.shape.borderRadius,
          }}
          onClick={() =>
            openImage(`https://api.goldentower.ir/api/image/${product.image}`)
          }
        />
      </MainImageWrapper>

      {/* Thumbnails */}
      <ThumbnailGrid container spacing={2} justifyContent="center">
        {product.Images?.map((img, i) => (
          <Grid item xs={4} sm={3} key={i}>
            <CardMedia
              component="img"
              src={`https://api.goldentower.ir/api/image/${img}`}
              alt={`${product.name} ${i + 1}`}
              loading="lazy"
              sx={{
                width: "100%",
                height: 100,
                objectFit: "cover",
                borderRadius: theme.shape.borderRadius,
                cursor: "pointer",
              }}
              onClick={() =>
                openImage(`https://api.goldentower.ir/api/image/${img}`)
              }
            />
          </Grid>
        ))}
      </ThumbnailGrid>

      {/* Specs */}
      <Grid container spacing={2} justifyContent="center">
        {specs.map((s, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <SpecCard>
              <CardMedia
                component="img"
                src={s.icon}
                alt={s.label}
                loading="lazy"
                sx={{
                  width: 40,
                  height: 40,
                  marginRight: theme.spacing(1),
                }}
              />
              <CardContent sx={{ padding: 0 }}>
                <Typography variant="body1" fontWeight={600}>
                  {s.value} سانتی‌متر
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {s.label}
                </Typography>
              </CardContent>
            </SpecCard>
          </Grid>
        ))}
      </Grid>

      {/* Add to Cart */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={addToCart}
        disabled={adding}
      >
        {adding ? "در حال اضافه‌کردن..." : "افزودن به سبد خرید"}
      </Button>

      {/* Image Modal */}
      <Modal open={openModal} onClose={closeImage}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <CardMedia
            component="img"
            src={modalSrc}
            alt="Large view"
            loading="lazy"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: theme.shape.borderRadius,
            }}
          />
        </Box>
      </Modal>
      {/* Snackbar پیام */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
