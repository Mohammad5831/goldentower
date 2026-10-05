// src/pages/artin/ArtinDetail.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  CardMedia,
  Paper,
  Chip,
  Button,
  Skeleton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { addToLocalCart } from "../../service/CartLocal";

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
}));

const ImageCard = styled(Paper)(({ theme }) => ({
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Thumb = styled(CardMedia)(({ theme, selected }) => ({
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
}));

const ColorSwatch = styled(Box)(({ theme, color, selected }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: color,
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": { transform: "scale(1.1)" },
}));

export default function ArtinDetail() {
  const theme = useTheme();
  const { product_uuid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
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
      if (data.product.Colors?.length) {
        setSelectedColor(data.product.Colors[0]);
        setMainImage(data.product.Colors[0].image);
      } else {
        setMainImage(data.product.image);
      }
    } catch (err) {
      console.error("Error loading product", err);
    } finally {
      setLoading(false);
    }
  }, [product_uuid]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      let item = {
        current_price: product.current_price,
        original_price: product.original_price,
        image: product.image,
        quantity: product.quantity,
        name: product.name,
        model: product.model,
        product_uuid: product.product_uuid
      };
      const result = addToLocalCart(item);
      setAdding(false);
      if (result.success) {
        setSnackbar({
          open: true,
          message: `محصول ${product?.name} باموفقیت به سبد خرید اضافه شد`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: `محصول ${product?.name} در سبد خرید موجود است`,
          severity: "warning",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `خطا در اضافه کردن محصول به سبد خرید`,
        severity: "warning",
      });
    }
    finally {
      setAdding(false);
    };
  };

  // const handleBack = () => navigate("/artin");
  const handleBack = () => navigate("/products");
  const closeSnackbar = () =>
    setSnackbar((s) => ({ ...s, open: false }));

  if (loading) {
    return (
      <PageContainer maxWidth="md">
        <Skeleton variant="rectangular" height={360} animation="wave" />
        <Box mt={2}>
          <Skeleton width="50%" />
          <Skeleton width="30%" />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      {/* Back */}
      <Button onClick={handleBack} sx={{ mb: 2 }}>
        ← بازگشت
      </Button>

      <Grid container spacing={4}>
        {/* تصویر اصلی + Thumbnails */}
        <Grid item xs={12} md={6}>
          <ImageCard>
            <CardMedia
              component="img"
              src={`https://api.goldentower.ir/api/image/${mainImage}`}
              alt={product.name}
              sx={{ width: "100%", height: 360, objectFit: "cover" }}
            />
          </ImageCard>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {product.Colors?.map((col) => (
              <Thumb
                key={col.id}
                component="img"
                src={`https://api.goldentower.ir/api/image/${col.image}`}
                alt={col.name}
                selected={col.id === selectedColor.id}
                onClick={() => {
                  setSelectedColor(col);
                  setMainImage(col.image);
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* جزئیات */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              شناسه محصول
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.model}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              دسته‌بندی
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.Category.name}
            </Typography>
          </Box>

          {/* رنگ‌ها */}
          {product.Colors?.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                انتخاب رنگ
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {product.Colors.map((col) => (
                  <ColorSwatch
                    key={col.id}
                    color={col.code}
                    selected={col.id === selectedColor.id}
                    onClick={() => {
                      setSelectedColor(col);
                      setMainImage(col.image);
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* قیمت */}
          <Box display="flex" alignItems="baseline" mb={4}>
            {product.original_price && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: theme.palette.text.disabled,
                  mr: 1,
                }}
              >
                {Number(product.original_price).toLocaleString()} تومان
              </Typography>
            )}
            <Typography variant="h5" color="primary">
              {Number(product.current_price).toLocaleString()} تومان
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "در حال اضافه‌کردن..." : "افزودن به سبد خرید"}
          </Button>
        </Grid>
      </Grid>

      {/* توضیحات */}
      {product.description && (
        <Box mt={6}>
          <Divider textAlign="center">
            <Typography variant="subtitle1" color="text.secondary">
              توضیحات محصول
            </Typography>
          </Divider>
          <Box mt={3}>
            <Typography variant="body1" color="text.primary">
              {product.description}
            </Typography>
          </Box>
        </Box>
      )}
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
