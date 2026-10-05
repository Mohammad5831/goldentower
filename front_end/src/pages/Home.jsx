// src/pages/Home.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

// Logos
import vitaLogo from "../assets/logos/vitaLogo.png";
import dateesLogo from "../assets/datees/logo-datees.webp";
import badabLogo from "../assets/badab/badab-logo.svg";
import artinLogo from "../assets/artin/Logo-Artin.png";
import mixplusLogo from "../assets/mixPlus/mixplusLogo.svg";
import darakarLogo from "../assets/darakar/darakarLogo.png";

// Hero Images
// import page1 from "../assets/home/IMG_2282.JPG";
import page2 from "../assets/home/gaz.jpg";

// Category Images
import hoodIcon from "../assets/hoodIcon.png";
import gazIcon from "../assets/gazIcon.jpg";
import ferIcon from "../assets/ferIcon.jpg";
import vanityIcon from "../assets/vanityIcon.webp";

// Articles
import { data } from "./articles/data";


// ======================================================
// API
// ======================================================

const API_URL = "http://localhost:5000";
const IMAGE_URL = `${API_URL}/api/image`;


// ======================================================
// Section Header
// ======================================================

const SectionHeader = ({ title, subtitle }) => (
  <Box
    sx={{
      mb: { xs: 2.5, md: 3 },
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
    }}
  >
    <Box
      sx={{
        width: 4,
        height: 38,
        borderRadius: 2,
        bgcolor: "#D4AF37",
        flexShrink: 0,
      }}
    />

    <Box>
      <Typography
        component="h2"
        sx={{
          fontSize: {
            xs: "1.15rem",
            sm: "1.3rem",
            md: "1.45rem",
          },
          fontWeight: 800,
          color: "#181818",
          lineHeight: 1.4,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            mt: 0.4,
            color: "#777",
            fontSize: {
              xs: "0.78rem",
              sm: "0.85rem",
            },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);


// ======================================================
// Brand Card
// ======================================================

const BrandCard = styled(Card)(() => ({
  width: 165,
  minWidth: 165,
  height: 112,
  flexShrink: 0,

  backgroundColor: "#fff",
  border: "1px solid #e7e7e7",
  borderRadius: 14,
  boxShadow: "none",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",
  overflow: "hidden",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "#D4AF37",
    boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
  },

  "&:focus-visible": {
    outline: "2px solid #D4AF37",
    outlineOffset: 3,
  },

  "@media (max-width:600px)": {
    width: 140,
    minWidth: 140,
    height: 100,
    borderRadius: 12,
  },
}));


// ======================================================
// Category Card
// ======================================================

const CategoryCard = styled(Card)(() => ({
  width: 230,
  minWidth: 230,
  flexShrink: 0,

  backgroundColor: "#fff",
  border: "1px solid #e7e7e7",
  borderRadius: 16,
  boxShadow: "none",

  overflow: "hidden",
  cursor: "pointer",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "#D4AF37",
    boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
  },

  "&:focus-visible": {
    outline: "2px solid #D4AF37",
    outlineOffset: 3,
  },

  "@media (max-width:600px)": {
    width: 190,
    minWidth: 190,
    borderRadius: 14,
  },
}));


// ======================================================
// Horizontal Scroll
// ======================================================

const HorizontalScroll = styled(Box)(() => ({
  display: "flex",
  gap: 18,
  overflowX: "auto",

  padding: "4px 2px 12px",

  scrollbarWidth: "thin",
  scrollbarColor: "#D4AF37 transparent",

  "&::-webkit-scrollbar": {
    height: 5,
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#D4AF37",
    borderRadius: 10,
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "@media (max-width:600px)": {
    gap: 14,
    paddingBottom: 10,
  },
}));


// ======================================================
// Product Card
// ======================================================

const ProductCard = styled(Card)(() => ({
  width: 260,
  minWidth: 260,
  flexShrink: 0,

  backgroundColor: "#fff",
  border: "1px solid #e7e7e7",
  borderRadius: 16,
  boxShadow: "none",

  overflow: "hidden",
  cursor: "pointer",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "#D4AF37",
    boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
  },

  "&:focus-visible": {
    outline: "2px solid #D4AF37",
    outlineOffset: 3,
  },

  "@media (max-width:600px)": {
    width: 215,
    minWidth: 215,
    borderRadius: 14,
  },
}));


// ======================================================
// Article Card
// ======================================================

const ArticleCard = styled(Card)(() => ({
  width: 280,
  minWidth: 280,
  flexShrink: 0,

  backgroundColor: "#fff",
  border: "1px solid #e7e7e7",
  borderRadius: 16,
  boxShadow: "none",

  overflow: "hidden",
  cursor: "pointer",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "#D4AF37",
    boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
  },

  "&:focus-visible": {
    outline: "2px solid #D4AF37",
    outlineOffset: 3,
  },

  "@media (max-width:600px)": {
    width: 240,
    minWidth: 240,
    borderRadius: 14,
  },
}));


// ======================================================
// Data
// ======================================================

const images = [
  {
    src: page2,
    product_uuid: "1b534da9-41ed-4525-a0e4-6c1db72809fd",
    brand: "artin",
  },
  // {
  //   src: page1,
  //   product_uuid: "69c13689-09ec-40f0-8efb-7f916d13ead0",
  //   brand: "vita",
  // },
];

const brands = [
  {
    name: "ویتا",
    id: "vita",
    logo: vitaLogo,
  },
  {
    name: "داتیس",
    id: "datees",
    logo: dateesLogo,
  },
  {
    name: "آرتین",
    id: "artin",
    logo: artinLogo,
  },
  {
    name: "باداب",
    id: "badab",
    logo: badabLogo,
  },
  {
    name: "میکس +",
    id: "mixplus",
    logo: mixplusLogo,
  },
  {
    name: "داراکار",
    id: "darakar",
    logo: darakarLogo,
  },
];

const categories = [
  {
    name: "روشویی",
    image: vanityIcon,
    path: "/vita",
  },
  {
    name: "هود",
    image: hoodIcon,
    path: "/products/datees/hood",
  },
  {
    name: "فر",
    image: ferIcon,
    path: "/products/datees/fertokar",
  },
  {
    name: "گاز",
    image: gazIcon,
    path: "/products/datees/gaz",
  },
];

const articles = data.slice(0, 2);


// ======================================================
// Component
// ======================================================

const Home = () => {
  const navigate = useNavigate();

  const [discounted, setDiscounted] = useState([]);
  const [showNotice, setShowNotice] = useState(false);


  // ====================================================
  // Fetch Offers
  // ====================================================

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/products/offers`
        );

        setDiscounted(res.data?.offers ?? []);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setDiscounted([]);
      }
    };

    fetchOffers();
  }, []);


  // ====================================================
  // First Visit Notice
  // ====================================================

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowNotice(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);


  // ====================================================
  // Navigation
  // ====================================================

  const handleBrandClick = useCallback(
    (id) => {
      navigate(`/products`);
    },
    [navigate]
  );

  const handleCategoryClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const handleProductClick = useCallback(
    (product) => {
      navigate(
        `/productDetail/${product.product_uuid}`
      );
    },
    [navigate]
  );

  const handleArticleClick = useCallback(
    (id) => {
      navigate(`/articleDetail/${id}`);
    },
    [navigate]
  );


  // ====================================================
  // Keyboard Accessibility
  // ====================================================

  const handleKeyDown = useCallback(
    (event, callback) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    },
    []
  );


  // ====================================================
  // Slider
  // ====================================================

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    rtl: true,

    appendDots: (dots) => (
      <Box
        component="ul"
        sx={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,

          display: "flex",
          justifyContent: "center",
          gap: 0.5,

          m: 0,
          p: 0,
          listStyle: "none",

          "& li": {
            width: 7,
            height: 7,
            margin: 0,
          },

          "& li button": {
            width: 7,
            height: 7,
            padding: 0,
            fontSize: 0,
          },

          "& li button:before": {
            display: "none",
          },

          "& li div": {
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.55)",
            transition: "all .2s ease",
          },

          "& li.slick-active div": {
            width: 20,
            borderRadius: 10,
            backgroundColor: "#D4AF37",
          },
        }}
      >
        {dots.map((dot, index) => (
          <li key={index}>{dot.props.children}</li>
        ))}
      </Box>
    ),
  };


  // ====================================================
  // Render
  // ====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        pb: { xs: 4, md: 7 },
      }}
    >

      {/* ==================================================
          HERO
      ================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: {
              xs: 260,
              sm: 340,
              md: 430,
            },

            overflow: "hidden",
            borderRadius: {
              xs: 2,
              sm: 3,
            },

            position: "relative",

            border: "1px solid #e7e7e7",
            backgroundColor: "#eee",

            "& .slick-slider": {
              width: "100%",
              height: "100%",
            },

            "& .slick-list": {
              width: "100%",
              height: "100%",
            },

            "& .slick-track": {
              height: "100%",
            },

            "& .slick-slide": {
              height: "100%",
            },

            "& .slick-slide > div": {
              height: "100%",
            },
          }}
        >
          <Slider {...sliderSettings}>
            {images.map((img, index) => (
              <Box
                key={img.product_uuid}
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={img.src}
                  alt={`بنر ${index + 1}`}
                  sx={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,

                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.38), rgba(0,0,0,0.05))",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleProductClick(img)}
                    sx={{
                      minWidth: 125,
                      height: 44,

                      px: 2.5,

                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.8)",
                      borderRadius: 2,

                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.85rem",
                        md: "0.9rem",
                      },

                      backdropFilter: "blur(4px)",
                      backgroundColor: "rgba(0,0,0,0.12)",

                      "&:hover": {
                        borderColor: "#D4AF37",
                        backgroundColor:
                          "rgba(212,175,55,0.15)",
                      },
                    }}
                  >
                    اطلاعات بیشتر
                  </Button>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>


      {/* ==================================================
          BRANDS
      ================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 4, md: 5 },
        }}
      >
        <SectionHeader
          title="برندها"
          subtitle="برندهای منتخب و معتبر"
        />

        <HorizontalScroll
          sx={{
            justifyContent: {
              xs: "flex-start",
              md: "center",
            },
          }}
        >
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              role="button"
              tabIndex={0}
              onClick={() => handleBrandClick(brand.id)}
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  handleBrandClick(brand.id)
                )
              }
            >
              <Box
                sx={{
                  width: "100%",
                  height: 65,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  px: 2,
                }}
              >
                <Box
                  component="img"
                  src={brand.logo}
                  alt={brand.name}
                  sx={{
                    maxWidth: {
                      xs: 85,
                      sm: 105,
                    },

                    maxHeight: {
                      xs: 45,
                      sm: 52,
                    },

                    width: "auto",
                    height: "auto",

                    objectFit: "contain",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt: 0.5,

                  color: "#222",

                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.82rem",
                  },

                  fontWeight: 700,
                }}
              >
                {brand.name}
              </Typography>
            </BrandCard>
          ))}
        </HorizontalScroll>
      </Container>


      {/* ==================================================
          CATEGORIES
      ================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 4.5, md: 5.5 },
        }}
      >
        <SectionHeader
          title="دسته‌بندی محصولات"
          subtitle="محصول موردنظر خود را انتخاب کنید"
        />

        <HorizontalScroll
          sx={{
            justifyContent: {
              xs: "flex-start",
              md: "center",
            },
          }}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              role="button"
              tabIndex={0}
              onClick={() =>
                handleCategoryClick(category.path)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  handleCategoryClick(category.path)
                )
              }
            >
              {/* Image */}
              <Box
                sx={{
                  width: "100%",
                  height: {
                    xs: 135,
                    sm: 160,
                  },

                  backgroundColor: "#f5f5f5",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={category.image}
                  alt={category.name}
                  sx={{
                    width: "100%",
                    height: "100%",

                    objectFit: "cover",

                    display: "block",

                    transition:
                      "transform 0.35s ease",

                    "&:hover": {
                      transform: "scale(1.04)",
                    },
                  }}
                />
              </Box>

              {/* Title */}
              <Box
                sx={{
                  px: 1.5,
                  py: 1.4,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "#222",
                    fontWeight: 800,

                    fontSize: {
                      xs: "0.82rem",
                      sm: "0.9rem",
                    },
                  }}
                >
                  {category.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#D4AF37",
                    fontSize: "1rem",
                    lineHeight: 1,
                  }}
                >
                  ←
                </Typography>
              </Box>
            </CategoryCard>
          ))}
        </HorizontalScroll>
      </Container>


      {/* ==================================================
          DISCOUNTED PRODUCTS
      ================================================== */}

      {discounted.length > 0 && (
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 5, md: 6 },
          }}
        >
          <SectionHeader
            title="تخفیف ویژه"
            subtitle="فرصت‌های ویژه برای خرید"
          />

          <HorizontalScroll>
            {discounted.map((product) => (
              <ProductCard
                key={product.product_uuid}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleProductClick(product)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, () =>
                    handleProductClick(product)
                  )
                }
              >
                {/* Image */}
                <Box
                  sx={{
                    height: {
                      xs: 155,
                      sm: 175,
                    },

                    borderRadius: 2,

                    backgroundColor: "#f7f7f7",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={`${IMAGE_URL}/${product.image}`}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "100%",

                      objectFit: "contain",

                      p: 1.5,
                    }}
                  />

                  {product.discount && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 9,
                        right: 9,

                        backgroundColor: "#D4AF37",
                        color: "#fff",

                        px: 1,
                        py: 0.45,

                        borderRadius: 1.5,

                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {product.discount}٪ تخفیف
                    </Box>
                  )}
                </Box>

                <CardContent
                  sx={{
                    px: 1.5,
                    py: 1.5,

                    "&:last-child": {
                      pb: 1.5,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.82rem",
                        sm: "0.88rem",
                      },

                      fontWeight: 700,
                      color: "#222",

                      lineHeight: 1.7,

                      minHeight: "3.1em",

                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.2,

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",

                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#D4AF37",

                        fontWeight: 800,

                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.95rem",
                        },
                      }}
                    >
                      {Number(
                        product.current_price
                      ).toLocaleString("fa-IR")}{" "}
                      تومان
                    </Typography>

                    {product.original_price && (
                      <Typography
                        sx={{
                          color: "#999",

                          textDecoration:
                            "line-through",

                          fontSize: "0.7rem",
                        }}
                      >
                        {Number(
                          product.original_price
                        ).toLocaleString("fa-IR")}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </ProductCard>
            ))}
          </HorizontalScroll>
        </Container>
      )}


      {/* ==================================================
          ARTICLES
      ================================================== */}

      {articles.length > 0 && (
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 5, md: 6 },
          }}
        >
          <SectionHeader
            title="مقالات"
            subtitle="مطالب و راهنمای خرید"
          />

          <HorizontalScroll>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleArticleClick(article.id)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, () =>
                    handleArticleClick(article.id)
                  )
                }
              >
                {/* Article Image */}
                <Box
                  sx={{
                    height: {
                      xs: 145,
                      sm: 165,
                    },

                    overflow: "hidden",
                    backgroundColor: "#f3f3f3",
                  }}
                >
                  <Box
                    component="img"
                    src={article.main_image}
                    alt={article.title}
                    sx={{
                      width: "100%",
                      height: "100%",

                      objectFit: "cover",

                      display: "block",

                      transition:
                        "transform 0.35s ease",

                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    px: 1.7,
                    py: 1.6,

                    "&:last-child": {
                      pb: 1.6,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#222",

                      fontWeight: 800,

                      fontSize: {
                        xs: "0.86rem",
                        sm: "0.92rem",
                      },

                      lineHeight: 1.7,

                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",

                      minHeight: "3.1em",
                    }}
                  >
                    {article.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.8,

                      color: "#777",

                      fontSize: {
                        xs: "0.72rem",
                        sm: "0.78rem",
                      },

                      lineHeight: 1.8,

                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",

                      minHeight: "4.2em",
                    }}
                  >
                    {article.description}
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.2,

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#D4AF37",

                        fontSize: "0.75rem",

                        fontWeight: 700,
                      }}
                    >
                      مطالعه مقاله
                    </Typography>

                    <Typography
                      sx={{
                        color: "#D4AF37",
                        fontSize: "1rem",
                      }}
                    >
                      ←
                    </Typography>
                  </Box>
                </CardContent>
              </ArticleCard>
            ))}
          </HorizontalScroll>
        </Container>
      )}


      {/* ==================================================
          FIRST VISIT NOTICE
      ================================================== */}

      <Snackbar
        open={showNotice}
        autoHideDuration={4500}
        onClose={() => setShowNotice(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setShowNotice(false)}
          severity="info"
          variant="filled"
          sx={{
            borderRadius: 2,
            fontSize: "0.85rem",
          }}
        >
          سایت در حال بروزرسانی است؛ به‌زودی با ظاهری زیباتر
          برمی‌گردیم.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;