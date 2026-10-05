
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { data } from "./data";

import {
  ArrowBackRounded,
  AccessTimeRounded,
  CalendarMonthRounded,
  PersonRounded,
  ArticleRounded,
  ChevronLeftRounded,
} from "@mui/icons-material";

import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  Button,
  Card,
  CardActionArea,
  CardMedia,
} from "@mui/material";

import { styled } from "@mui/material/styles";

/* =========================================================
   Section
========================================================= */

const Section = styled("section")(({ theme }) => ({
  padding: theme.spacing(3, 0, 10),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 0, 8),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 0, 6),
  },
}));

/* =========================================================
   Hero
========================================================= */

const ArticleHero = styled(Box)(({ theme }) => ({
  position: "relative",

  minHeight: 430,

  display: "flex",
  alignItems: "flex-end",

  overflow: "hidden",

  borderRadius: 22,

  backgroundColor: "#171717",

  color: "#fff",

  "&::after": {
    content: '""',

    position: "absolute",

    inset: 0,

    background:
      "linear-gradient(180deg, rgba(0,0,0,0.05) 15%, rgba(0,0,0,0.88) 100%)",

    zIndex: 1,
  },

  [theme.breakpoints.down("md")]: {
    minHeight: 390,
    borderRadius: 18,
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: 360,
    borderRadius: 15,
  },
}));

/* =========================================================
   Hero Image
========================================================= */

const HeroImage = styled("img")({
  position: "absolute",

  inset: 0,

  width: "100%",
  height: "100%",

  objectFit: "cover",

  opacity: 0.88,
});

/* =========================================================
   Article Content Card
========================================================= */

const ContentCard = styled(Box)(({ theme }) => ({
  width: "100%",

  maxWidth: 850,

  margin: "0 auto",

  padding: theme.spacing(4.5),

  borderRadius: 20,

  background:
    "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

  border:
    "1px solid rgba(212,175,55,0.14)",

  boxShadow:
    "0 10px 35px rgba(30,30,30,0.045)",

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3.5),
    borderRadius: 18,
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.3),
    borderRadius: 15,
  },
}));

/* =========================================================
   Meta Item
========================================================= */

const MetaItem = ({ icon, children }) => (
  <Stack
    direction="row"
    spacing={0.7}
    alignItems="center"
    sx={{
      color: "rgba(255,255,255,0.68)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        color: "warning.main",

        "& svg": {
          fontSize: {
            xs: 16,
            sm: 18,
          },
        },
      }}
    >
      {icon}
    </Box>

    <Typography
      sx={{
        fontSize: {
          xs: "0.65rem",
          sm: "0.72rem",
        },

        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Typography>
  </Stack>
);

/* =========================================================
   Related Article Card
========================================================= */

const RelatedCard = styled(Card)(({ theme }) => ({
  height: "100%",

  borderRadius: 17,

  overflow: "hidden",

  border:
    "1px solid rgba(212,175,55,0.14)",

  background:
    "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

  boxShadow:
    "0 8px 25px rgba(30,30,30,0.04)",

  transition:
    "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

  "&:hover": {
    transform: "translateY(-6px)",

    borderColor:
      "rgba(212,175,55,0.35)",

    boxShadow:
      "0 15px 35px rgba(30,30,30,0.08)",
  },

  [theme.breakpoints.down("sm")]: {
    borderRadius: 14,
  },
}));

/* =========================================================
   Main
========================================================= */

export default function ArticleDetail() {
  const { article_id } = useParams();

  const navigate = useNavigate();

  const selected = data.find(
    (article) => article.id === Number(article_id)
  );

  /* =======================================================
     Article Not Found
  ======================================================= */

  if (!selected) {
    return (
      <Section dir="rtl">
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: "60vh",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              textAlign: "center",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <ArticleRounded
                sx={{
                  fontSize: 55,
                  color: "warning.main",
                }}
              />

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.4rem",
                }}
              >
                مقاله پیدا نشد
              </Typography>

              <Button
                variant="outlined"
                onClick={() => navigate("/articles")}
                endIcon={<ArrowBackRounded />}
                sx={{
                  borderColor: "warning.main",
                  color: "warning.main",

                  "&:hover": {
                    borderColor: "warning.dark",
                  },
                }}
              >
                بازگشت به مقالات
              </Button>
            </Stack>
          </Box>
        </Container>
      </Section>
    );
  }

  /* =======================================================
     Related Articles
  ======================================================= */

  const relatedArticles = data
    .filter((article) => article.id !== selected.id)
    .slice(0, 3);

  return (
    <Section dir="rtl">
      <Container maxWidth="lg">

        {/* =================================================
            HERO
        ================================================= */}

        <ArticleHero>
          <HeroImage
            src={selected.main_image}
            alt={selected.title}
            loading="lazy"
          />

          <Box
            sx={{
              position: "relative",

              zIndex: 2,

              width: "100%",

              px: {
                xs: 2.5,
                sm: 4,
                md: 6,
              },

              pb: {
                xs: 3,
                sm: 4,
                md: 5,
              },
            }}
          >

            {/* Category */}

            <Box
              sx={{
                display: "inline-flex",

                alignItems: "center",

                px: 1.5,
                py: 0.6,

                mb: 1.5,

                borderRadius: 10,

                backgroundColor:
                  "rgba(212,175,55,0.14)",

                border:
                  "1px solid rgba(212,175,55,0.30)",

                color: "warning.main",

                backdropFilter: "blur(8px)",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.72rem",
                  },

                  fontWeight: 700,
                }}
              >
                {selected.category}
              </Typography>
            </Box>

            {/* Title */}

            <Typography
              component="h1"
              sx={{
                maxWidth: 900,

                fontWeight: 900,

                lineHeight: 1.55,

                fontSize: {
                  xs: "1.45rem",
                  sm: "2rem",
                  md: "2.65rem",
                },

                mb: 2,
              }}
            >
              {selected.title}
            </Typography>

            {/* Meta */}

            <Stack
              direction="row"
              spacing={{
                xs: 1.5,
                sm: 2.5,
              }}
              flexWrap="wrap"
              useFlexGap
            >
              <MetaItem
                icon={<CalendarMonthRounded />}
              >
                {selected.date}
              </MetaItem>

              <MetaItem
                icon={<AccessTimeRounded />}
              >
                {selected.reading_time}
              </MetaItem>

              <MetaItem
                icon={<PersonRounded />}
              >
                {selected.author}
              </MetaItem>
            </Stack>
          </Box>
        </ArticleHero>

        {/* =================================================
            ARTICLE
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 5,
              md: 7,
            },
          }}
        >
          <ContentCard>

            {/* Article Intro */}

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },

                mb: 4,

                borderRadius: 3,

                backgroundColor:
                  "rgba(212,175,55,0.055)",

                borderRight:
                  "3px solid",

                borderColor:
                  "warning.main",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",

                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                  },

                  lineHeight: 2.1,

                  fontWeight: 500,
                }}
              >
                {selected.excerpt}
              </Typography>
            </Box>

            {/* Article Content */}

            <Box>
              {selected.content.map(
                (block, index) => {

                  if (block.type === "heading") {
                    return (
                      <Typography
                        key={index}
                        component="h2"
                        sx={{
                          fontWeight: 800,

                          fontSize: {
                            xs: "1.05rem",
                            sm: "1.25rem",
                          },

                          lineHeight: 1.7,

                          mt: index === 0 ? 0 : 4,

                          mb: 1.5,

                          color: "text.primary",

                          "&::before": {
                            content: '""',

                            display: "inline-block",

                            width: 7,
                            height: 7,

                            borderRadius: "50%",

                            backgroundColor:
                              "warning.main",

                            marginLeft: 1,

                            verticalAlign: "middle",
                          },
                        }}
                      >
                        {block.text}
                      </Typography>
                    );
                  }

                  if (block.type === "paragraph") {
                    return (
                      <Typography
                        key={index}
                        component="p"
                        sx={{
                          color: "text.secondary",

                          fontSize: {
                            xs: "0.82rem",
                            sm: "0.9rem",
                          },

                          lineHeight: {
                            xs: 2.1,
                            sm: 2.2,
                          },

                          mb: 2.2,
                        }}
                      >
                        {block.text}
                      </Typography>
                    );
                  }

                  return null;
                }
              )}
            </Box>

            {/* Divider */}

            <Divider
              sx={{
                mt: 4,
                mb: 3,

                borderColor:
                  "rgba(0,0,0,0.07)",
              }}
            />

            {/* Article Info */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },

                gap: 1.5,
              }}
            >

              <Box
                sx={{
                  p: 1.7,

                  borderRadius: 2.5,

                  backgroundColor: "#faf9f6",

                  border:
                    "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <CalendarMonthRounded
                    sx={{
                      color: "warning.main",
                      fontSize: 20,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "text.disabled",
                      }}
                    >
                      تاریخ انتشار
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {selected.date}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  p: 1.7,

                  borderRadius: 2.5,

                  backgroundColor: "#faf9f6",

                  border:
                    "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <AccessTimeRounded
                    sx={{
                      color: "warning.main",
                      fontSize: 20,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "text.disabled",
                      }}
                    >
                      زمان مطالعه
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {selected.reading_time}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  p: 1.7,

                  borderRadius: 2.5,

                  backgroundColor: "#faf9f6",

                  border:
                    "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <PersonRounded
                    sx={{
                      color: "warning.main",
                      fontSize: 20,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "text.disabled",
                      }}
                    >
                      نویسنده
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {selected.author}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

            </Box>
          </ContentCard>
        </Box>

        {/* =================================================
            RELATED ARTICLES
        ================================================= */}

        {relatedArticles.length > 0 && (
          <Box
            sx={{
              mt: {
                xs: 7,
                md: 10,
              },
            }}
          >

            {/* Header */}

            <Box
              sx={{
                mb: {
                  xs: 3,
                  md: 4,
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: "warning.main",
                  }}
                >
                  <ArticleRounded />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,

                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.45rem",
                      md: "1.65rem",
                    },
                  }}
                >
                  مقالات مرتبط
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "text.secondary",

                  fontSize: {
                    xs: "0.76rem",
                    sm: "0.84rem",
                  },

                  lineHeight: 1.8,
                }}
              >
                مطالب دیگری که ممکن است برای شما مفید باشند.
              </Typography>
            </Box>

            {/* Cards */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },

                gap: 2.5,
              }}
            >
              {relatedArticles.map((article) => (
                <RelatedCard
                  key={article.id}
                >
                  <CardActionArea
                    onClick={() =>
                      navigate(
                        `/articleDetail/${article.id}`
                      )
                    }
                    sx={{
                      height: "100%",

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "stretch",
                    }}
                  >

                    <CardMedia
                      component="img"
                      image={article.main_image}
                      alt={article.title}
                      loading="lazy"
                      sx={{
                        height: {
                          xs: 190,
                          sm: 180,
                        },

                        objectFit: "cover",
                      }}
                    />

                    <Box
                      sx={{
                        p: 2,
                        flexGrow: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "warning.main",

                          fontSize: "0.65rem",

                          fontWeight: 700,

                          mb: 0.7,
                        }}
                      >
                        {article.category}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 800,

                          fontSize: {
                            xs: "0.82rem",
                            sm: "0.88rem",
                          },

                          lineHeight: 1.8,
                        }}
                      >
                        {article.title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        px: 2,
                        pb: 1.8,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          sx={{
                            color: "text.disabled",

                            fontSize: "0.65rem",
                          }}
                        >
                          {article.reading_time}
                        </Typography>

                        <ChevronLeftRounded
                          sx={{
                            color: "warning.main",
                            fontSize: 20,
                          }}
                        />
                      </Stack>
                    </Box>

                  </CardActionArea>
                </RelatedCard>
              ))}
            </Box>
          </Box>
        )}

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 6,
              md: 8,
            },

            pt: 3,

            borderTop:
              "1px solid rgba(0,0,0,0.07)",

            display: "flex",

            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => navigate("/articles")}
            startIcon={<ArrowBackRounded />}
            sx={{
              color: "warning.main",

              fontWeight: 800,

              fontSize: {
                xs: "0.75rem",
                sm: "0.82rem",
              },

              "&:hover": {
                backgroundColor:
                  "rgba(212,175,55,0.07)",
              },
            }}
          >
            بازگشت به مقالات
          </Button>
        </Box>

      </Container>
    </Section>
  );
}