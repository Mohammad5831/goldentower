// src/pages/AboutUs.jsx

import React, { useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";

import {
  HomeRounded,
  BuildRounded,
  HandymanRounded,
  ShieldRounded,
  LocalShippingRounded,
  Instagram,
  Telegram,
  WhatsApp,
  ArrowBackRounded,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";

/* =========================================================
   Section
========================================================= */

const Section = styled("section")(({ theme }) => ({
  padding: theme.spacing(4, 0, 10),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3, 0, 7),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 0, 5),
  },
}));

/* =========================================================
   Hero
========================================================= */

const Hero = styled(Box)(({ theme }) => ({
  position: "relative",

  minHeight: 330,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  overflow: "hidden",

  borderRadius: 18,

  background:
    "linear-gradient(135deg, #171717 0%, #252525 55%, #151515 100%)",

  color: "#fff",

  "&::before": {
    content: '""',

    position: "absolute",

    width: 420,
    height: 420,

    borderRadius: "50%",

    right: -180,
    top: -220,

    border:
      "1px solid rgba(212,175,55,0.20)",
  },

  "&::after": {
    content: '""',

    position: "absolute",

    width: 280,
    height: 280,

    borderRadius: "50%",

    left: -140,
    bottom: -180,

    background:
      "rgba(212,175,55,0.05)",
  },

  [theme.breakpoints.down("md")]: {
    minHeight: 300,
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: 270,

    borderRadius: 12,

    padding: theme.spacing(3),
  },
}));

/* =========================================================
   Stat Strip
========================================================= */

const StatItem = styled(Box)(({ theme }) => ({
  flex: 1,

  textAlign: "center",

  padding: theme.spacing(2.5, 1),

  borderLeft:
    "1px solid rgba(212,175,55,0.15)",

  "&:last-child": {
    borderLeft: "none",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5, 0),

    borderLeft:
      "1px solid rgba(212,175,55,0.12)",
  },
}));

/* =========================================================
   Section Header
========================================================= */

const SectionHeader = ({ icon, title, description }) => (
  <Box sx={{ mb: { xs: 3, md: 4 } }}>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ mb: 1 }}
    >
      <Box
        sx={{
          color: "warning.main",
          display: "flex",
        }}
      >
        {icon}
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
        {title}
      </Typography>
    </Stack>

    {description && (
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: {
            xs: "0.78rem",
            sm: "0.85rem",
            md: "0.9rem",
          },
          lineHeight: 1.8,
          maxWidth: 650,
        }}
      >
        {description}
      </Typography>
    )}
  </Box>
);


/* =========================================================
 Service Card 
 ========================================================= */
const ServiceCard = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: theme.spacing(3),
  borderRadius: 18,
  overflow: "hidden",
  background: "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",
  border: "1px solid rgba(212,175,55,0.14)",
  transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "rgba(212,175,55,0.055)",
    top: -55,
    left: -55,
    transition: "transform .3s ease",
    pointerEvents: "none",
  },
  "&:hover": {
    transform: "translateY(-6px)",
    borderColor: "rgba(212,175,55,0.35)",
    boxShadow: "0 15px 35px rgba(30,30,30,0.08)",
    "&::before": {
      transform: "scale(1.4)",
    },
  },
  [
    theme.breakpoints.down("sm")
  ]: {
    padding: theme.spacing(2.5),
    borderRadius: 15,
  },
}));


/* ========================================================= 
 Services Grid 
 ========================================================= */
const ServicesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: theme.spacing(2.5),
  boxSizing: "border-box",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: theme.spacing(2),
  },
}));


/* ========================================================= 
 Branch Grid 
 ========================================================= */
const BranchesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  width: "100%",

  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",

  gap: theme.spacing(2.5),

  boxSizing: "border-box",

  alignItems: "stretch",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns:
      "minmax(0, 1fr)",

    gap: theme.spacing(2),
  },
}));


/* =========================================================
   Branch Card
========================================================= */

const BranchCard = styled(Box)(({ theme }) => ({
  position: "relative",

  width: "100%",
  height: "100%",
  minWidth: 0,

  boxSizing: "border-box",

  overflow: "hidden",

  borderRadius: 18,

  backgroundColor: "#fff",

  border:
    "1px solid rgba(0,0,0,0.07)",

  transition:
    "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

  "&:hover": {
    transform: "translateY(-6px)",

    borderColor:
      "rgba(212,175,55,0.35)",

    boxShadow:
      "0 15px 38px rgba(30,30,30,0.08)",
  },

  [theme.breakpoints.down("sm")]: {
    borderRadius: 15,
  },
}));


/* =========================================================
   Social
========================================================= */

const SocialButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,

  color: theme.palette.warning.main,

  border:
    "1px solid rgba(212,175,55,0.20)",

  borderRadius: 12,

  transition:
    "all .2s ease",

  "&:hover": {
    color: "#fff",

    backgroundColor:
      theme.palette.warning.main,

    transform: "translateY(-3px)",
  },
}));

/* =========================================================
   Main
========================================================= */

export default function AboutUs() {
  const services = useMemo(
    () => [
      {
        icon: <BuildRounded />,
        title: "نصب و راه‌اندازی",
        description:
          "نصب تخصصی محصولات توسط کارشناسان مجرب و آموزش‌دیده.",
      },
      {
        icon: <HandymanRounded />,
        title: "تعمیر و نگهداری",
        description:
          "ارائه خدمات تعمیر و نگهداری با استفاده از قطعات اصلی.",
      },
      {
        icon: <ShieldRounded />,
        title: "گارانتی معتبر",
        description:
          "پشتیبانی و خدمات پس از فروش مطمئن برای محصولات.",
      },
      {
        icon: <LocalShippingRounded />,
        title: "ارسال سریع",
        description:
          "ارسال ایمن و سریع سفارش‌ها به سراسر کشور.",
      },
    ],
    []
  );

  const branches = useMemo(
    () => [
      {
        title: "دفتر مرکزی بجنورد",
        info:
          "خراسان شمالی – بجنورد – خیابان طلای سفید، بازرگانی برج طلایی",
      },
      {
        title: "گالری کاشی تبریز",
        info:
          "بجنورد – خیابان قیام جنوبی – نبش قیام 2",
      },
      {
        title: "شعبه اسفراین",
        info:
          "خیابان سپیده کاشانی، بلوار کشاورز",
      },
      {
        title: "شعبه گنبد کاووس",
        info:
          "خیابان حافظ جنوبی، نبش کوچه هیجدهم",
      },
      {
        title: "شعبه جاجرم",
        info:
          "خیابان شهید مطهری - نبش چهارراه معلم",
      },
    ],
    []
  );

  const handleSocialClick = (platform) => {
    const urls = {
      instagram: "https://www.instagram.com/",
      telegram: "https://t.me/",
      whatsapp: "https://wa.me/",
    };

    window.open(urls[platform], "_blank");
  };

  return (
    <Section dir="rtl">
      <Container maxWidth="lg">

        {/* =================================================
            HERO
        ================================================= */}

        <Hero>
          <Box
            sx={{
              position: "relative",
              zIndex: 2,

              textAlign: "center",

              maxWidth: 760,

              px: {
                xs: 1,
                sm: 3,
              },
            }}
          >
            <Typography
              sx={{
                color: "warning.main",

                fontWeight: 900,

                letterSpacing: {
                  xs: 0,
                  sm: 0.5,
                },

                fontSize: {
                  xs: "1.9rem",
                  sm: "2.4rem",
                  md: "3.1rem",
                },

                mb: 2,
              }}
            >
              برج طلایی
            </Typography>

            <Typography
              sx={{
                color: "#fff",

                fontWeight: 700,

                fontSize: {
                  xs: "1.1rem",
                  sm: "1.3rem",
                  md: "1.55rem",
                },

                mb: 2,
              }}
            >
              بیشتر از یک فروشگاه؛ یک تجربه مطمئن
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.68)",

                lineHeight: 2,

                fontSize: {
                  xs: "0.78rem",
                  sm: "0.88rem",
                  md: "0.95rem",
                },
              }}
            >
              بیش از دو دهه تجربه در صنعت ساختمان،
              همراه با ارائه محصولات باکیفیت و خدمات
              حرفه‌ای برای ساختن تجربه‌ای مطمئن برای مشتریان.
            </Typography>
          </Box>
        </Hero>

        {/* =================================================
            STATS
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 2,
              md: 3,
            },

            backgroundColor: "#fff",

            borderRadius: 3,

            border:
              "1px solid rgba(212,175,55,0.12)",

            display: "flex",

            overflow: "hidden",

            boxShadow:
              "0 5px 20px rgba(0,0,0,0.035)",
          }}
        >
          <StatItem>
            <Typography
              sx={{
                color: "warning.main",
                fontWeight: 900,
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.6rem",
                },
              }}
            >
              20+
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.8rem",
                },
              }}
            >
              سال تجربه
            </Typography>
          </StatItem>

          <StatItem>
            <Typography
              sx={{
                color: "warning.main",
                fontWeight: 900,
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.6rem",
                },
              }}
            >
              5
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.8rem",
                },
              }}
            >
              شعبه فعال
            </Typography>
          </StatItem>

          <StatItem>
            <Typography
              sx={{
                color: "warning.main",
                fontWeight: 900,
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.6rem",
                },
              }}
            >
              10K+
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.8rem",
                },
              }}
            >
              مشتری
            </Typography>
          </StatItem>

          <StatItem>
            <Typography
              sx={{
                color: "warning.main",
                fontWeight: 900,
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.6rem",
                },
              }}
            >
              500+
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.8rem",
                },
              }}
            >
              پروژه موفق
            </Typography>
          </StatItem>
        </Box>

        {/* =================================================
            ABOUT COMPANY
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 7,
              md: 10,
            },
          }}
        >
          <SectionHeader
            icon={<HomeRounded />}
            title="درباره شرکت"
            description="با تجربه، کیفیت و تعهد در کنار شما هستیم."
          />

          <Grid
            container
            spacing={{
              xs: 3,
              md: 6,
            }}
            alignItems="center"
          >
            <Grid item xs={12} md={7}>
              <Typography
                sx={{
                  color: "text.secondary",

                  lineHeight: 2.15,

                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                    md: "0.95rem",
                  },
                }}
              >
                برج طلایی با بیش از ۲۰ سال سابقه در
                زمینه فروش و ارائه محصولات ساختمانی،
                تلاش کرده است مجموعه‌ای کامل از
                محصولات باکیفیت را در اختیار مشتریان
                قرار دهد.
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",

                  lineHeight: 2.15,

                  mt: 2,

                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                    md: "0.95rem",
                  },
                }}
              >
                هدف ما تنها فروش محصول نیست؛ بلکه
                ایجاد یک تجربه مطمئن از انتخاب و خرید
                تا نصب، استفاده و خدمات پس از فروش است.
              </Typography>

              <Box
                sx={{
                  mt: 3,

                  display: "inline-flex",

                  alignItems: "center",

                  gap: 1,

                  color: "warning.main",

                  fontWeight: 700,

                  fontSize: {
                    xs: "0.78rem",
                    sm: "0.85rem",
                  },
                }}
              >
                کیفیت، اعتماد و رضایت مشتری
                <ArrowBackRounded fontSize="small" />
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: {
                    xs: 2.5,
                    sm: 3,
                  },

                  borderRadius: 3,

                  backgroundColor:
                    "rgba(212,175,55,0.055)",

                  border:
                    "1px solid rgba(212,175,55,0.12)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,

                    fontSize: {
                      xs: "1rem",
                      sm: "1.1rem",
                    },

                    mb: 1,
                  }}
                >
                  چرا برج طلایی؟
                </Typography>

                <Divider
                  sx={{
                    mb: 2,

                    borderColor:
                      "rgba(212,175,55,0.15)",
                  }}
                />

                {[
                  "محصولات باکیفیت",
                  "تنوع بالای برندها",
                  "خدمات پس از فروش",
                  "تجربه بیش از ۲۰ سال",
                ].map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,

                        borderRadius: "50%",

                        backgroundColor:
                          "warning.main",

                        flexShrink: 0,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "text.secondary",

                        fontSize: {
                          xs: "0.78rem",
                          sm: "0.85rem",
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ================================================= 
        SERVICES 
        ================================================= */}
        <Box
          sx={{
            mt: {
              xs: 8,
              md: 11,
            },
          }}
        >
          <SectionHeader
            icon={<BuildRounded />}
            title="خدمات ما"
            description="از انتخاب محصول تا خدمات پس از فروش، همراه شما هستیم."
          />

          <ServicesGrid>
            {services.map((service, index) => (
              <ServiceCard key={service.title}>

                {/* شماره */}

                <Typography
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 18,

                    fontSize: "0.7rem",
                    fontWeight: 800,

                    color:
                      "rgba(212,175,55,0.45)",

                    zIndex: 2,
                  }}
                >
                  0{index + 1}
                </Typography>


                {/* Icon */}

                <Box
                  sx={{
                    width: {
                      xs: 56,
                      sm: 62,
                    },

                    height: {
                      xs: 56,
                      sm: 62,
                    },

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    borderRadius: 3,

                    color: "warning.main",

                    backgroundColor:
                      "rgba(212,175,55,0.10)",

                    mb: {
                      xs: 2,
                      sm: 2.5,
                    },

                    position: "relative",

                    zIndex: 1,

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 29,
                        sm: 32,
                      },
                    },
                  }}
                >
                  {service.icon}
                </Box>


                {/* Content */}

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,

                      fontSize: {
                        xs: "0.95rem",
                        sm: "1rem",
                      },

                      lineHeight: 1.7,

                      mb: 1,
                    }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",

                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.8rem",
                      },

                      lineHeight: 1.9,
                    }}
                  >
                    {service.description}
                  </Typography>
                </Box>

              </ServiceCard>
            ))}
          </ServicesGrid>
        </Box>

        {/* =================================================
    BRANCHES
================================================= */}

<Box
  sx={{
    mt: {
      xs: 8,
      md: 11,
    },
  }}
>
  <SectionHeader
    icon={<HomeRounded />}
    title="شعب ما"
    description="برای ارتباط و مراجعه، نزدیک‌ترین شعبه را انتخاب کنید."
  />

  <BranchesGrid>
    {branches.map((branch, index) => (
      <BranchCard key={branch.title}>

        {/* Gold Header */}

        <Box
          sx={{
            height: 6,

            background:
              "linear-gradient(90deg, #c9a227, #e0c15a, #c9a227)",
          }}
        />

        <Box
          sx={{
            p: {
              xs: 2.5,
              sm: 3,
            },

            height: "calc(100% - 6px)",

            boxSizing: "border-box",

            display: "flex",

            flexDirection: "column",
          }}
        >

          {/* شماره */}

          <Typography
            sx={{
              position: "absolute",

              top: 18,
              left: 20,

              fontSize: "0.7rem",

              fontWeight: 800,

              color:
                "rgba(212,175,55,0.45)",
            }}
          >
            0{index + 1}
          </Typography>


          {/* Header */}

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              mb: 2.5,
              pr: 1,
            }}
          >

            <Box
              sx={{
                width: {
                  xs: 46,
                  sm: 50,
                },

                height: {
                  xs: 46,
                  sm: 50,
                },

                flexShrink: 0,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                borderRadius: 2.5,

                color: "warning.main",

                backgroundColor:
                  "rgba(212,175,55,0.10)",

                "& svg": {
                  fontSize: {
                    xs: 25,
                    sm: 28,
                  },
                },
              }}
            >
              <HomeRounded />
            </Box>


            <Box sx={{ minWidth: 0 }}>

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.9rem",
                    sm: "0.98rem",
                  },

                  fontWeight: 800,

                  lineHeight: 1.6,

                  wordBreak: "break-word",
                }}
              >
                {branch.title}
              </Typography>

              <Typography
                sx={{
                  color: "warning.main",

                  fontSize: "0.68rem",

                  fontWeight: 600,

                  mt: 0.3,
                }}
              >
                شعبه برج طلایی
              </Typography>

            </Box>

          </Stack>


          {/* Divider */}

          <Divider
            sx={{
              borderColor:
                "rgba(0,0,0,0.06)",

              mb: 2,
            }}
          />


          {/* Address */}

          <Box>

            <Typography
              sx={{
                color: "warning.main",

                fontSize: {
                  xs: "0.78rem",
                  sm: "0.82rem",
                },

                fontWeight: 800,

                mb: 0.7,
              }}
            >
              آدرس
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",

                lineHeight: 1.95,

                fontSize: {
                  xs: "0.74rem",
                  sm: "0.8rem",
                },

                wordBreak: "break-word",
              }}
            >
              {branch.info}
            </Typography>

          </Box>


          {/* فضای انتهایی */}

          <Box sx={{ flexGrow: 1 }} />

        </Box>

      </BranchCard>
    ))}
  </BranchesGrid>
</Box>

        {/* =================================================
            SOCIAL
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 8,
              md: 11,
            },

            pt: {
              xs: 4,
              md: 5,
            },

            borderTop:
              "1px solid rgba(0,0,0,0.07)",

            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,

              fontSize: {
                xs: "1rem",
                sm: "1.15rem",
              },

              mb: 1,
            }}
          >
            با ما در ارتباط باشید
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",

              fontSize: {
                xs: "0.72rem",
                sm: "0.82rem",
              },

              mb: 2.5,
            }}
          >
            آخرین اخبار و محصولات برج طلایی را دنبال کنید.
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
          >
            <SocialButton
              aria-label="Instagram"
              onClick={() =>
                handleSocialClick("instagram")
              }
            >
              <Instagram />
            </SocialButton>

            <SocialButton
              aria-label="Telegram"
              onClick={() =>
                handleSocialClick("telegram")
              }
            >
              <Telegram />
            </SocialButton>

            <SocialButton
              aria-label="WhatsApp"
              onClick={() =>
                handleSocialClick("whatsapp")
              }
            >
              <WhatsApp />
            </SocialButton>
          </Stack>
        </Box>

      </Container>
    </Section>
  );
}