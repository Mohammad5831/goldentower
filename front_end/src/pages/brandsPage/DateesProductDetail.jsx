// src/pages/artin/ArtinDetail.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  CardMedia,
  Paper,
  IconButton,
  Button,
  Skeleton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import axios from "axios";
import Cookies from "js-cookie";
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

const QuantityControl = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export default function ArtinDetail() {
  const theme = useTheme();
  const { product_uuid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
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
      const prod = data.product;
      setProduct(data.product);

      // select first color or image
      if (prod?.Colors?.length) {
        setSelectedColor(prod.Colors[0]);
        setMainImage(prod.Colors[0].image);
      } else {
        setMainImage(prod.image);
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
        const result = addToLocalCart(item)
        setAdding(false);
        if (result.success) {
          setSnackbar({
          open: true,
          message: `محصول ${product?.name} ${product?.model} با موفقیت به سبد خرید اضافه شد`,
          severity: "success",
        });
        } else {
          setSnackbar({
            open: true,
            message: `محصول ${product?.name} ${product?.model} در سبد خرید موجود است`,
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

  // const handleBack = () => navigate("/datees");
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
      {/* بازگشت */}
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
              alt={product?.name}
              sx={{
                width: "100%",
                height: 360,
                objectFit: "cover",
              }}
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
            {product?.Colors?.map((col) => (
              <Thumb
                key={col?.color_uuid}
                component="img"
                src={`https://api.goldentower.ir/api/image/${col?.image}`}
                alt={col?.name}
                selected={col?.color_uuid === selectedColor?.color_uuid}
                onClick={() => {
                  setSelectedColor(col);
                  setMainImage(col.image);
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* جزئیات محصول */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product?.name}
          </Typography>

          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              شناسه محصول:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product?.model}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              دسته‌بندی:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product?.Category?.name}
            </Typography>
          </Box>

          {/* قیمت */}
          <Box display="flex" alignItems="baseline" mb={3}>
            {product?.original_price && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: theme.palette.text.disabled,
                  mr: 1,
                }}
              >
                {Number(product?.original_price).toLocaleString()} تومان
              </Typography>
            )}
            <Typography variant="h5" color="primary">
              {Number(product?.current_price).toLocaleString()} تومان
            </Typography>
          </Box>

          {/* کنترل تعداد */}
          {/* <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              تعداد
            </Typography>
            <QuantityControl>
              <IconButton
                size="small"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={adding || quantity === 1}
              >
                <RemoveIcon />
              </IconButton>
              <Box
                sx={{
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 40,
                }}
              >
                <Typography>{quantity}</Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={adding}
              >
                <AddIcon />
              </IconButton>
            </QuantityControl>
          </Box> */}

          {/* افزودن به سبد خرید */}
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
      {product?.description && (
        <Box mt={6}>
          <Divider textAlign="center">
            <Typography
              variant="subtitle1"
              color="text.secondary"
            >
              توضیحات محصول
            </Typography>
          </Divider>
          <Box mt={3}>
            <Typography variant="body1" color="text.primary">
              {product?.description}
            </Typography>
          </Box>
        </Box>
      )}

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
