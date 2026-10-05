
// src/pages/Articles.jsx

import React from "react";
import { data } from "./data";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Container,
} from "@mui/material";

import {
  ArrowBackRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


/* =========================================================
   Section
========================================================= */

const Section = ({ children }) => (
  <Box
    component="section"
    dir="rtl"
    sx={{
      py: {
        xs: 2,
        sm: 3,
        md: 4,
      },
    }}
  >
    <Container maxWidth="lg">
      {children}
    </Container>
  </Box>
);


/* =========================================================
   Hero
========================================================= */

const Hero = () => (
  <Box
    sx={{
      position: "relative",

      minHeight: {
        xs: 250,
        sm: 280,
        md: 300,
      },

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      overflow: "hidden",

      borderRadius: {
        xs: 5,
        sm: 5,
        md: 5,
      },
      background:
        "linear-gradient(135deg, #171717 0%, #252525 55%, #151515 100%)",

      color: "#fff",

      /* Top right circle */

      "&::before": {
        content: '""',

        position: "absolute",

        width: {
          xs: 280,
          sm: 350,
          md: 420,
        },

        height: {
          xs: 280,
          sm: 350,
          md: 420,
        },

        borderRadius: 18,

        right: {
          xs: -140,
          sm: -160,
          md: -180,
        },

        top: {
          xs: -160,
          sm: -190,
          md: -220,
        },

        border:
          "1px solid rgba(212,175,55,0.20)",
      },

      /* Bottom left glow */

      "&::after": {
        content: '""',

        position: "absolute",

        width: {
          xs: 200,
          sm: 240,
          md: 280,
        },

        height: {
          xs: 200,
          sm: 240,
          md: 280,
        },

        borderRadius: '50px',

        left: {
          xs: -100,
          sm: -120,
          md: -140,
        },

        bottom: {
          xs: -130,
          sm: -150,
          md: -180,
        },

        background:
          "rgba(212,175,55,0.05)",
      },
    }}
  >
    <Box
      sx={{
        position: "relative",

        zIndex: 2,

        width: "100%",

        maxWidth: 760,

        px: {
          xs: 2,
          sm: 3,
        },

        textAlign: "center",
      }}
    >

      {/* Main title */}

      <Typography
        sx={{
          color: "warning.main",

          fontWeight: 900,

          fontSize: {
            xs: "1.9rem",
            sm: "2.4rem",
            md: "3.1rem",
          },

          lineHeight: 1.3,

          mb: 1.5,
        }}
      >
        مقالات برج طلایی
      </Typography>


      {/* Subtitle */}

      <Typography
        sx={{
          color: "#fff",

          fontWeight: 700,

          fontSize: {
            xs: "1rem",
            sm: "1.2rem",
            md: "1.45rem",
          },

          mb: 2,
        }}
      >
        دانش بیشتر، انتخاب بهتر
      </Typography>


      {/* Description */}

      <Typography
        sx={{
          color:
            "rgba(255,255,255,0.68)",

          lineHeight: 2,

          fontSize: {
            xs: "0.76rem",
            sm: "0.86rem",
            md: "0.95rem",
          },

          maxWidth: 650,

          mx: "auto",
        }}
      >
        جدیدترین مطالب، آموزش‌ها و اطلاعات مفید
        را در زمینه محصولات و خدمات برج طلایی
        مطالعه کنید.
      </Typography>

    </Box>
  </Box>
);


/* =========================================================
   Articles Grid
   Desktop → 4
   Tablet  → 2
   Mobile  → 1
========================================================= */

const ArticlesGrid = ({ children }) => (
  <Box
    sx={{
      display: "grid",

      width: "100%",

      mt: {
        xs: 5,
        md: 7,
      },

      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        md: "repeat(4, minmax(0, 1fr))",
      },

      gap: {
        xs: 2,
        sm: 2.5,
        md: 3,
      },

      alignItems: "stretch",
    }}
  >
    {children}
  </Box>
);


/* =========================================================
   Article Card
========================================================= */

const ArticleCard = ({ article, onClick }) => {
  return (
    <Card
      sx={{
        width: "100%",

        minWidth: 0,

        height: "100%",

        display: "flex",

        flexDirection: "column",

        borderRadius: {
          xs: 12,
          sm: 14,
          md: 15,
        },

        overflow: "hidden",

        background:
          "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

        border:
          "1px solid rgba(212,175,55,0.14)",

        boxShadow:
          "0 8px 25px rgba(30,30,30,0.045)",

        transition:
          "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

        "&:hover": {
          transform: "translateY(-7px)",

          borderColor:
            "rgba(212,175,55,0.38)",

          boxShadow:
            "0 18px 40px rgba(30,30,30,0.10)",
        },

        "&:hover .article-image": {
          transform: "scale(1.05)",
        },

        "&:hover .article-arrow": {
          transform: "translateX(-4px)",

          color: "warning.main",
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick(article.id)}
        sx={{
          height: "100%",

          display: "flex",

          flexDirection: "column",

          alignItems: "stretch",

          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >

        {/* =================================================
            Image
        ================================================= */}

        <Box
          sx={{
            position: "relative",

            width: "100%",

            aspectRatio: "16 / 9",

            overflow: "hidden",

            backgroundColor: "#f3f3f3",
          }}
        >
          <CardMedia
            component="img"

            loading="lazy"

            image={article.main_image}

            alt={article.title}

            className="article-image"

            sx={{
              width: "100%",

              height: "100%",

              display: "block",

              objectFit: "cover",

              transition:
                "transform .45s ease",
            }}
          />


          {/* Article Badge */}

          <Box
            sx={{
              position: "absolute",

              top: {
                xs: 10,
                sm: 12,
              },

              right: {
                xs: 10,
                sm: 12,
              },

              px: 1.2,

              py: 0.5,

              borderRadius: 2,

              background:
                "rgba(20,20,20,0.82)",

              backdropFilter:
                "blur(7px)",

              color: "warning.main",

              fontSize: {
                xs: "0.62rem",
                sm: "0.68rem",
              },

              fontWeight: 800,
            }}
          >
            مقاله
          </Box>
        </Box>


        {/* =================================================
            Content
        ================================================= */}

        <CardContent
          sx={{
            flex: 1,

            display: "flex",

            flexDirection: "column",

            p: {
              xs: 2,
              sm: 2.2,
              md: 2.4,
            },

            "&:last-child": {
              pb: {
                xs: 2,
                sm: 2.2,
                md: 2.4,
              },
            },
          }}
        >

          {/* Title */}

          <Typography
            sx={{
              fontWeight: 800,

              fontSize: {
                xs: "0.88rem",
                sm: "0.93rem",
                md: "0.97rem",
              },

              lineHeight: 1.8,

              display: "-webkit-box",

              WebkitLineClamp: 2,

              WebkitBoxOrient: "vertical",

              overflow: "hidden",

              minHeight: {
                xs: "3.15rem",
                sm: "3.35rem",
              },
            }}
          >
            {article.title}
          </Typography>


          {/* Bottom */}

          <Box
            sx={{
              mt: "auto",

              pt: 1.5,

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              borderTop:
                "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",

                fontSize: {
                  xs: "0.66rem",
                  sm: "0.7rem",
                },

                fontWeight: 600,
              }}
            >
              مطالعه مقاله
            </Typography>

            <ArrowBackRounded
              className="article-arrow"

              sx={{
                fontSize: {
                  xs: 18,
                  sm: 19,
                },

                color: "text.secondary",

                transition:
                  "transform .2s ease, color .2s ease",
              }}
            />
          </Box>

        </CardContent>

      </CardActionArea>
    </Card>
  );
};


/* =========================================================
   Main
========================================================= */

export const Articles = () => {

  const navigate = useNavigate();


  /* =======================================================
     Navigate To Article
  ======================================================= */

  const handleClick = (id) => {
    navigate(`/articleDetail/${id}`);
  };


  return (
    <Section>

      {/* =================================================
          HERO
      ================================================= */}

      <Hero />


      {/* =================================================
          ARTICLES
      ================================================= */}

      <ArticlesGrid>

        {data.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={handleClick}
          />
        ))}

      </ArticlesGrid>

    </Section>
  );
};


export default Articles;
