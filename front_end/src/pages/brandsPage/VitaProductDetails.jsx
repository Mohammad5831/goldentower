// src/pages/productDetail/VitaDetail.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Box,
  Container,
  Typography,
  Button,
  CardMedia,
  Grid,
  Modal,
  Snackbar,
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { addToLocalCart } from "../../service/CartLocal";

const PageWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const MainImage = styled(CardMedia)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  cursor: "pointer",
  margin: 'auto'
}));

const Thumbnail = styled(CardMedia)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  margin: theme.spacing(1),
  objectFit: "cover",
  transition: "transform 0.2s",
  "&:hover": { transform: "scale(1.05)" },
}));

const SpecsTable = styled(Table)(({ theme }) => ({
  marginTop: theme.spacing(3),
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
}));

export default function VitaDetail() {
  const theme = useTheme();
  const { product_uuid } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [modalImage, setModalImage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // بارگذاری اطلاعات محصول
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.goldentower.ir/api/products/${product_uuid}`
      );
      setProduct(res.data.product);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "خطا در بارگذاری اطلاعات محصول.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [product_uuid]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // افزودن به سبد خرید
  const handleAddToCart = async () => {
    setAdding(true);
    try {
      let item = {
          current_price: product.current_price,
          original_price: product.original_price,
          image: product.image,
          quantity: product.quantity,
          name: product.name,
          // model: product.model,
          product_uuid: product.product_uuid
        };
      const result = addToLocalCart(item)
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
      console.log(error);
      
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


  // بستن Snackbar
  const handleCloseSnackbar = () =>
    setSnackbar((s) => ({ ...s, open: false }));

  // باز/بستن Modal عکس
  const openImageModal = useCallback((url) => {
    setModalImage(url);
    setOpenModal(true);
  }, []);
  const closeImageModal = () => setOpenModal(false);

  // جدول مشخصات از API یا پیش‌فرض
  const specs = useMemo(
    () => product?.GeneralSpecs || [],
    [product]
  );

  return (
    <PageWrapper maxWidth="lg">
      {loading || !product ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 8,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={300}
            height={300}
            animation="wave"
          />
        </Box>
      ) : (
        <>
          {/* تصویر اصلی */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <MainImage
              component="img"
              src={`https://api.goldentower.ir/api/image/${product.image}`}
              alt={product.name}
              loading="lazy"
              sx={{
                width: { xs: "80%", sm: 400, md: 500 },
                height: "auto",
              }}
              onClick={() =>
                openImageModal(
                  `https://api.goldentower.ir/api/image/${product.image}`
                )
              }
            />
          </Box>

          {/* عنوان و قیمت */}
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <Grid item xs={12} md="auto" textAlign="center">
              <Typography variant="h4">{product.name}</Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Box display="flex" alignItems="center" justifyContent="center">
                {product.original_price > product.current_price && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: theme.palette.text.disabled,
                      mx: 1,
                    }}
                  >
                    {Number(product.original_price).toLocaleString()} تومان
                  </Typography>
                )}
                <Typography variant="h6" color="primary.main">
                  {Number(product.current_price).toLocaleString()} تومان
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md="auto">
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

          {/* جدول مشخصات */}
          {specs.length > 0 && (
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              <Typography variant="h5" gutterBottom>
                مشخصات فنی
              </Typography>
              <SpecsTable>
                <TableBody>
                  {specs.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        sx={{ fontWeight: "bold", width: "40%" }}
                      >
                        {s.label}
                      </TableCell>
                      <TableCell>{s.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </SpecsTable>
            </Box>
          )}

          {/* گالری بندانگشتی */}
          {/* <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              تصاویر بیشتر
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {product.Images?.map((img) => (
                <Grid item xs={4} sm={2} key={img.name}>
                  <Thumbnail
                    component="img"
                    src={`https://api.goldentower.ir/api/image/${img.name}`}
                    alt={img.alt_text || product.name}
                    loading="lazy"
                    onClick={() =>
                      openImageModal(
                        `https://api.goldentower.ir/api/image/${img.name}`
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box> */}

          {/* توضیحات */}
          <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              دربارهٔ محصول
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>
          </Box>
        </>
      )}

      {/* Modal بزرگ‌نمایی تصویر */}
      <Modal
        open={openModal}
        onClose={closeImageModal}
        aria-labelledby="product-image-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          component="img"
          src={modalImage}
          alt="Product large view"
          loading="lazy"
          sx={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[5],
          }}
        />
      </Modal>

      {/* Snackbar برای پیام‌ها */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
}
