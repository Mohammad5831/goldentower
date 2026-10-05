// src/pages/brand/DateesPage.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ImageSlider from "../../components/ImageSlider";

import hood from "../../assets/datees/hood.webp";
import fertokar from "../../assets/datees/fertokar.webp";
import ojagh from "../../assets/datees/ojagh.webp";
import macrowave from "../../assets/datees/macrowave.webp";
import sink from "../../assets/datees/sink.webp";
import namayandegan from "../../assets/datees/namayandeganGoldentower.jpg";
import slide1 from "../../assets/datees/IMG-1.jpg"
import slide2 from "../../assets/datees/IMG-2.jpg"
import slide3 from "../../assets/datees/IMG-3.jpg"

const categories = [
  {
    id:7,
    title: "hood",
    name: "هود",
    image: hood,
    description:
      "هودهای هوشمند کمک می‌کنند بدون لمس صفحه را روشن و خاموش کنید.",
  },
  {
    id:5,
    title: "fertokar",
    name: "فر توکار",
    image: fertokar,
    description: "با فرهای توکار، آشپزخانه‌ی هوشمند خود را بسازید.",
  },
  {
    id:3,
    title: "gaz",
    name: "اجاق گاز",
    image: ojagh,
    description:
      "اجاق‌گازهای داتیس با طراحی‌های متنوع و متریال استیل یا شیشه.",
  },
  {
    id:6,
    title: "macrowave",
    name: "مایکروویو",
    image: macrowave,
    description: "ست ماکروویو و فر داتیس را اینجا انتخاب کنید.",
  },
  {
    id:9,
    title: "sink",
    name: "سینک",
    image: sink,
    description: "سینک‌های کورین با دوام و زیبایی ماندگار.",
  },
];

const CategoryCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: 'center',
  alignItems: 'center',
  height: "100%",          // کارت کل ارتفاع را پر می‌کند
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const sliderImages = [
  slide1,
  slide2,
  slide3,
];

export default function DateesPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = useCallback(
    (cat) => {
      navigate(`/products/datees/${cat.title}`);
    },
    [navigate]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Slider */}
      <Box sx={{ mb: 6 }}>
        <ImageSlider images={sliderImages} size="600px"/>
      </Box>

      {/* دسته‌بندی‌ها */}
      <Typography
        variant="h5"
        color="primary.main"
        sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
      >
        دسته‌بندی محصولات داتیس
      </Typography>

      <Grid container spacing={4} alignItems="stretch">
        {categories.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={c.title} sx={{ width: '80%', margin: 'auto' }}>
            <CategoryCard onClick={() => handleClick(c)}>
              {/* تصویر دسته‌بندی */}
              <Box
                sx={{
                  flex: "0 0 auto",
                  height: { xs: 140, sm: 160, md: 180 },
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* محتوا */}
              <CardContent sx={{ flex: "1 1 auto", textAlign: "center", width: '90%' }}>
                <Typography variant="h6">{c.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {c.description}
                </Typography>
              </CardContent>
            </CategoryCard>
          </Grid>
        ))}
      </Grid>

      {/* اطلاع‌رسانی */}
      <Box sx={{ alignItems: 'center', mt: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} sx={{ margin: 'auto' }}>
            <CardMedia
              component="img"
              src={namayandegan}
              alt="نمایندگی‌ها"
              loading="lazy"
              sx={{
                width: "100%",
                height: { xs: 220, md: 350 },
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              color="error.main"
              sx={{ mb: 1 }}
            >
              خرید خوب
            </Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
              خرید آنلاین از بازرگانی برج طلایی
            </Typography>
            <Box
              sx={{
                width: 80,
                height: 2,
                backgroundColor: theme.palette.error.main,
                mb: 2,
              }}
            />
            <Typography variant="body1" color="text.secondary">
              خرید آنلاین انواع محصولات داتیس از سایت رسمی تجارت‌خانه برج
              طلایی و خرید حضوری از شعب ما در بجنورد، جاجرم، اسفراین و
              گنبدکاووس.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
