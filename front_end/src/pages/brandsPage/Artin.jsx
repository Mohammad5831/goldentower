// src/pages/artin/ArtinPage.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

import storyOfLion from "../../assets/artin/storyOfLion.jpg";
import faucet_01 from "../../assets/artin/01.jpg";
import faucet_02 from "../../assets/artin/02.jpg";
import faucet_03 from "../../assets/artin/03.jpg";
import faucet_04 from "../../assets/artin/04.jpg";
import faucet_05 from "../../assets/artin/05.jpg";

const faucets = [
  { id: 1, title: "washbasin_faucets", label: "شیرآلات روشویی", image: faucet_01 },
  { id: 2, title: "kitchen_faucets", label: "شیرآلات آشپزخانه", image: faucet_02 },
  { id: 3, title: "toilet_faucets", label: "شیرآلات توالت", image: faucet_03 },
  { id: 4, title: "bathroom_faucets", label: "شیرآلات حمام", image: faucet_04 },
  { id: 5, title: "concealed_faucets", label: "شیرآلات توکار", image: faucet_05 },
];

const SliderCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 520,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Thumb = styled(Card)(({ theme, active }) => ({
  width: 140,
  height: 190,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  cursor: "pointer",
  border: active ? `3px solid ${theme.palette.warning.main}` : `1px solid ${theme.palette.divider}`,
  boxShadow: active ? theme.shadows[4] : "none",
  transition: "transform 0.18s, border 0.18s",
  "&:hover": { transform: "translateY(-4px)" },
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    background: theme.palette.action.hover,
  },
}));

export default function ArtinPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = faucets[currentIndex];

  const prev = () => setCurrentIndex((s) => (s - 1 + faucets.length) % faucets.length);
  const next = () => setCurrentIndex((s) => (s + 1) % faucets.length);
  const goTo = (i) => setCurrentIndex(i);
  const goCategory = (item) => navigate(`/products/artin/${item.title}`);

  return (
    <Box sx={{ pt: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom sx={{mb: 5, mt: 3}}>محصولات آرتین</Typography>

      {/* slider area: centered, prev/next beside image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          px: 2,
          mb: 2,
        }}
      >
        {/* prev button (left on wide, above on narrow) */}

        {/* main image */} 
        <SliderCard>
          <CardMedia
            component="img"
            image={current.image}
            alt={current.label}
            sx={{
              height: { xs: 520, sm: 620, md: 520 },
              objectFit: "cover",
              display: "block",
            }}
          />
        </SliderCard>
            <NavButton
              aria-label="قبلی"
              onClick={prev}
              sx={{
                height: { xs: 44, md: 520 },
                width: { xs: 44, md: 56 },
                alignSelf: "center",
              }}
            >
              <ArrowForwardIosIcon />
            </NavButton>

        {/* next button */}
        <NavButton
          aria-label="بعدی"
          onClick={next}
          sx={{
            height: { xs: 44, md: 520 },
            width: { xs: 44, md: 56 },
            alignSelf: "center",
          }}
        >
          <ArrowBackIosNewIcon />
        </NavButton>
      </Box>

      {/* current category button */}
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => goCategory(current)} sx={{bgcolor: theme.palette.warning.main,}}>
          {current.label}
        </Button>
      </Box>

      {/* thumbnails centered */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5, px: 2 }}>
        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 920 }}>
          {faucets.map((item, idx) => (
            <Grid item key={item.id}>
              <Thumb active={item.id === current.id ? 1 : 0} onClick={() => goTo(idx)} aria-label={item.label}>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.label}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Thumb>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Story section centered and responsive */}
      <Box sx={{ position: "relative", height: { xs: 360, md: 420 }, mx: "auto", maxWidth: 1200 }}>
        <CardMedia
          component="img"
          image={storyOfLion}
          alt="داستان یک شیر"
          sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1 }}
        />
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 32 },
            left: { xs: 12, md: 40 },
            right: { xs: 12, md: "auto" },
            maxWidth: { xs: "calc(100% - 24px)", md: 640 },
            bgcolor: "rgba(255, 255, 255, 0.39)",
            backdropFilter: "blur(4px)",
            borderRadius: 1,
            p: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="h4" gutterBottom>داستان یک شیر</Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
            تا به حال فکر کردید که چرا به شیر آب می‌گویند؟ در زمان قاجار، تهران آب لوله‌کشی نداشت و مردم از قنات‌ها و آب‌انبارهای آلوده استفاده می‌کردند. سرمایه‌داری که نذر کرده بود اگر بچه‌دار شود، برای مردم آب لوله‌کشی فراهم کند، پس از تولد فرزندش مهندسانی از اتریش آورد. در آن کشورها مجسمه حیوانات مقدس را بر خروجی آب نصب می‌کردند، و در اتریش سر شیر نماد قدرت بود. پس بر سر چشمه‌ای که برای مردم ساخت، سردیسی از شیر نصب کرد و مردم گفتند: "رفتیم از سر شیر آب آوردیم".
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
