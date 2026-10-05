// src/pages/artin/ArtinProducts.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  Button,
  Pagination,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import axios from "axios";
import { fetchProducts } from "../../service/getProducts";

const Page = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const BackLink = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(2, 0),
  color: theme.palette.error.main,
  "& a": {
    cursor: "pointer",
    textDecoration: "none",
    color: theme.palette.error.main,
  },
  "& a:hover": { color: theme.palette.text.primary },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignContent: "space-around",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  maxWidth: 155
}));

const EmptyState = ({ onContinue }) => (
  <Box textAlign="center" py={8}>
    <Typography variant="h6" gutterBottom>
      محصولی یافت نشد
    </Typography>
    <Typography color="text.secondary" mb={3}>
      هنوز محصولی در این دسته موجود نیست یا در حال بارگذاری داده‌ها هستیم.
    </Typography>
    <Button variant="contained" onClick={onContinue}>
      بازگشت به فروشگاه
    </Button>
  </Box>
);

const categoryTranslations = {
  washbasin_faucets: "شیرآلات روشویی",
  kitchen_faucets: "شیرآلات آشپزخانه",
  toilet_faucets: "شیرآلات توالت",
  bathroom_faucets: "شیرآلات حمام",
  concealed_faucets: "شیرآلات توکار",
};

const categoriesDetail = [
  {
    id: 10,
    title: 'washbasin_faucets',
  },
  {
    id: 11,
    title: 'kitchen_faucets',
  },
  {
    id: 12,
    title: 'toilet_faucets',
  },
  // {
  //   id: ,
  //   title: 'bathroom_faucets',
  // },
  {
    id: 13,
    title: 'concealed_faucets',
  },
]
export default function ArtinProducts() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;


  const selectedCategory = categoriesDetail.find((cat) => cat.title == category)

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      if (!selectedCategory) {
        setAllProducts([]);
        return;
      }
      const res = await fetchProducts("artin", selectedCategory);
      setAllProducts(res.data || []);
    } catch (err) {
      console.log(err);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const allPages = Math.ceil((allProducts?.length || 0) / itemsPerPage) || 1;

    const currentItems = (allProducts || []).slice(startIndex, endIndex);
    setTotalPages(allPages);
    setProducts(currentItems);
  }, [allProducts, page]);

  const handleChangePage = (pageNumber) => {
    setPage(pageNumber)
  };

  const handleBack = () => navigate("/artin");
  const handleProductClick = (item) =>
    navigate(`/productDetail/artin/${item.product_uuid}`);
  const handleContinue = () => navigate("/artin");

  return (
    <Page maxWidth="lg">
      <BackLink variant="h6">
        <a onClick={handleBack}>← بازگشت به برند آرتین</a>
        {"  "}
        {category ? `— ${categoryTranslations[category] || category}` : ""}
      </BackLink>

      {/* Products grid: دو محصول در هر ردیف (xs..lg => 6) */}
      <Box>
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={6} lg={6} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={240}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton width="60%" sx={{ mt: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : products.length ? (
          <Grid sx={{ display: 'flex', justifyContent: 'center' }} container spacing={3} >
            {products.map((p) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                key={p.product_uuid}
              >
                <ProductCard>
                  <CardActionArea
                    onClick={() => handleProductClick(p)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      height: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`https://api.goldentower.ir/api/image/${p.image}`}
                      alt={p.name}
                      loading="lazy"
                      sx={{
                        height: { xs: 180, sm: 200, md: 220 },
                        objectFit: "cover",
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                      // noWrap
                      >
                        {p.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "normal",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.size || p.model || ""}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState onContinue={handleContinue} />
        )}
      </Box>

      {/* Footer filter summary */}
      {/* <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          نتایج فیلتر:{" "}
          <Box component="span" sx={{ color: theme.palette.primary.main }}>
            {categoryTranslations[category] || category || "همه"}
          </Box>{" "}
          — {loading ? "در حال بارگذاری..." : `${products.length} محصول`}
        </Typography>

        {!loading && products.length > 0 && (
          <Grid container spacing={1}>
            {products.map((p) => (
              <Grid item xs={4} sm={6} md={4} key={`list-${p.product_uuid}`}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    p: 1,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  onClick={() => handleProductClick(p)}
                >
                  <CardMedia
                    component="img"
                    image={`https://api.goldentower.ir/api/image/${p.image}`}
                    alt={p.name}
                    loading="lazy"
                    sx={{ width: 72, height: 56, objectFit: "cover", borderRadius: 1 }}
                  />
                  <Box>
                    <Typography variant="body2" noWrap>
                      {p.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.model || p.size || ""}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box> */}
      <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }} >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => handleChangePage(value)}
          color='primary'
        />
      </Box>
    </Page>
  );
}
