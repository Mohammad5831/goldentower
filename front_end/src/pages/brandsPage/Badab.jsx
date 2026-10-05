// src/pages/badab/BadabPage.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Skeleton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ImageSlider from "../../components/ImageSlider";

import underShower from "../../assets/badab/underShower.svg";
import showerRoom from "../../assets/badab/showerRoom.svg";
import showerPanel from "../../assets/badab/showerPanel.svg";
import sauna from "../../assets/badab/sauna.svg";
import jacuzzi from "../../assets/badab/jacuzzi.svg";
import badabBG from "../../assets/badab/badabBackground.png";
import badabLogo from "../../assets/badab/badab-logo.svg";
import image1 from "../../assets/badab/home-1.webp";
import image2 from "../../assets/badab/home-2.jpg";
import image3 from "../../assets/badab/home-3.jpg";
import image4 from "../../assets/badab/home-4.jpg";
import { fetchProducts } from "../../service/getProducts";

const Root = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 600,
  marginBottom: theme.spacing(4),
}));

const CategoryCard = styled(Card)(({ theme, active }) => ({
  width: "100%",
  height: 120,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: active
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active
    ? theme.palette.action.selected
    : theme.palette.background.paper,
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
}));

const Hero = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 280,
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0.9))",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

const sliderImages = [
  image1,
  image2,
  image3,
  image4,
];

export default function BadabPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(
    () => [
      { title: "all", name: "همه", icon: null },
      { title: "underShower", name: "زیر دوشی", icon: underShower },
      { title: "showerPanel", name: "پنل دوش", icon: showerPanel },
      { title: "showerRoom", name: "اتاق دوش", icon: showerRoom },
      { title: "sauna", name: "سونا", icon: sauna },
      { title: "jacuzzi", name: "وان و جکوزی", icon: jacuzzi },
    ],
    []
  );

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts('badab');
      setProducts(res.data.products || []);
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter(
            (p) => p.Category?.title === activeCategory
          ),
    [activeCategory, products]
  );

  const handleCategory = (title) => {
    setActiveCategory(title);
    window.scrollTo({ top: 450, behavior: "smooth" });
  };

  const viewProduct = (uuid) =>
    navigate(`/productDetail/badab/${uuid}`);

  return (
    <>
      <ImageSlider images={sliderImages} size="200px"/>

      <Root maxWidth="lg">
        <SectionTitle variant="h4">
          محصولات باداب
        </SectionTitle>

        {/* دسته‌بندی‌ها */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ mb: 6 }}
        >
          {categories.map((c) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={c.title}
              sx={{width: 100}}
            >
              <CategoryCard
                active={activeCategory === c.title ? 1 : 0}
                onClick={() => handleCategory(c.title)}
              >
                {c.icon && (
                  <CardMedia
                    component="img"
                    src={c.icon}
                    alt={c.name}
                    loading="lazy"
                    sx={{
                      width: 36,
                      height: 36,
                      mb: 1,
                    }}
                  />
                )}
                <Typography variant="body2">
                  {c.name}
                </Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* هیر/پس‌زمینه */}
        <Hero>
          <CardMedia
            component="img"
            src={badabBG}
            alt="Badab background"
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Overlay>
            <CardMedia
              component="img"
              src={badabLogo}
              alt="Badab logo"
              sx={{ width: 120, mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              باداب، بزرگ‌ترین کارخانه وان و جکوزی ایران
            </Typography>
            <Typography variant="body2" color="text.secondary">
              باداب ارائه‌کننده وان، جکوزی، سونا و پنل دوش با طراحی
              لوکس و کیفیت برتر. بیش از ۴۰ نمایندگی در سراسر ایران.
            </Typography>
          </Overlay>
        </Hero>

        {/* لیست محصولات */}
        {loading ? (
          <Grid container spacing={4}>
            {[...Array(8)].map((_, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={i}
              >
                <Skeleton
                  variant="rectangular"
                  height={200}
                  animation="wave"
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton width="60%" sx={{ mt: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {filtered.map((p) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={p.product_uuid}
              >
                <ProductCard
                  onClick={() => viewProduct(p.product_uuid)}
                >
                  <CardMedia
                    component="img"
                    src={`https://api.goldentower.ir/api/image/${p.image}`}
                    alt={p.name}
                    loading="lazy"
                    sx={{
                      height: 180,
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      noWrap
                    >
                      {p.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {p.size}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      مشاهده
                    </Button>
                  </Box>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* خلاصه فیلتر در انتهای صفحه */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>
            نتایج فیلتر "{categories.find(c => c.title === activeCategory)?.name}"
            : {filtered.length} محصول
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {filtered.map((p) => (
              <li key={p.product_uuid}>
                <Typography variant="body2">{p.name}</Typography>
              </li>
            ))}
          </Box>
        </Box>
      </Root>
    </>
  );
}
