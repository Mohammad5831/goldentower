
// src/pages/ContactPage.jsx

import React, { useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Stack,
  Divider,
  Grid,
} from "@mui/material";

import {
  PhoneRounded,
  EmailRounded,
  LocationOnRounded,
  AccessTimeRounded,
  SupportAgentRounded,
  EngineeringRounded,
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
   Responsive Cards
========================================================= */

const ResponsiveCardsGrid = styled(Box)(({ theme }) => ({
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
   Contact Card Grid
========================================================= */

const ContactCardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: theme.spacing(2.5),
  boxSizing: "border-box",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
  },
}));


/* =========================================================
   Hero
========================================================= */

const Hero = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: 300,

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

    border: "1px solid rgba(212,175,55,0.20)",
  },

  "&::after": {
    content: '""',
    position: "absolute",

    width: 280,
    height: 280,

    borderRadius: "50%",

    left: -140,
    bottom: -180,

    background: "rgba(212,175,55,0.05)",
  },

  [theme.breakpoints.down("md")]: {
    minHeight: 280,
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: 250,
    borderRadius: 14,
    padding: theme.spacing(3),
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
   Contact Card
========================================================= */

const ContactCard = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",

  padding: theme.spacing(3),

  borderRadius: 18,

  background:
    "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

  border:
    "1px solid rgba(212,175,55,0.14)",

  overflow: "hidden",

  transition:
    "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

  "&::before": {
    content: '""',

    position: "absolute",

    width: 120,
    height: 120,

    borderRadius: "50%",

    background:
      "rgba(212,175,55,0.055)",

    top: -55,
    left: -55,

    pointerEvents: "none",

    transition: "transform .3s ease",
  },

  "&:hover": {
    transform: "translateY(-6px)",

    borderColor:
      "rgba(212,175,55,0.35)",

    boxShadow:
      "0 15px 35px rgba(30,30,30,0.08)",

    "&::before": {
      transform: "scale(1.4)",
    },
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5),
    borderRadius: 15,
  },
}));

/* =========================================================
   Contact Item
========================================================= */

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",

  alignItems: "flex-start",

  gap: theme.spacing(2),

  padding: theme.spacing(2),

  borderRadius: 14,

  backgroundColor: "#fff",

  border:
    "1px solid rgba(0,0,0,0.055)",

  transition:
    "all .2s ease",

  "&:hover": {
    borderColor:
      "rgba(212,175,55,0.30)",

    transform: "translateY(-2px)",

    boxShadow:
      "0 8px 22px rgba(30,30,30,0.055)",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.8),
    gap: theme.spacing(1.5),
  },
}));

/* =========================================================
   Icon Box
========================================================= */

const IconBox = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,

  flexShrink: 0,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  borderRadius: 12,

  color: theme.palette.warning.main,

  backgroundColor:
    "rgba(212,175,55,0.10)",

  "& svg": {
    fontSize: 25,
  },

  [theme.breakpoints.down("sm")]: {
    width: 42,
    height: 42,

    "& svg": {
      fontSize: 22,
    },
  },
}));

/* =========================================================
   Working Hours Card
========================================================= */

const HoursCard = styled(Box)(({ theme }) => ({
  position: "relative",

  width: "100%",
  height: "100%",
  minHeight: 260,
  minWidth: 0,

  display: "flex",
  flexDirection: "column",

  overflow: "hidden",

  borderRadius: 18,

  background:
    "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

  border:
    "1px solid rgba(212,175,55,0.14)",

  boxShadow:
    "0 8px 25px rgba(30,30,30,0.045)",

  transition:
    "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

  "&:hover": {
    transform: "translateY(-5px)",

    borderColor:
      "rgba(212,175,55,0.35)",

    boxShadow:
      "0 16px 38px rgba(30,30,30,0.08)",
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: 0,
    borderRadius: 15,
  },
}));


/* =========================================================
   Hours Grid
========================================================= */

const HoursGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: theme.spacing(2.5),
  alignItems: "stretch",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
  },
}));

/* =========================================================
   Hours Row
========================================================= */

const HoursRow = ({ day, time, last }) => {
  const isClosed = time === "تعطیل";

  return (
    <Box
      sx={{
        px: {
          xs: 2,
          sm: 2.5,
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{
          minHeight: {
            xs: 48,
            sm: 52,
          },

          py: 0.5,
        }}
      >
        {/* Day */}
        <Typography
          sx={{
            color: "text.secondary",

            fontSize: {
              xs: "0.72rem",
              sm: "0.78rem",
            },

            fontWeight: 500,

            whiteSpace: "nowrap",
          }}
        >
          {day}
        </Typography>

        {/* Time */}
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent: "flex-end",

            gap: 0.8,

            minWidth: 0,
          }}
        >
          {!isClosed && (
            <Box
              sx={{
                width: 6,
                height: 6,

                borderRadius: "50%",

                backgroundColor:
                  "warning.main",

                flexShrink: 0,
              }}
            />
          )}

          <Typography
            sx={{
              color: isClosed
                ? "text.disabled"
                : "text.primary",

              fontWeight: isClosed
                ? 500
                : 700,

              fontSize: {
                xs: "0.68rem",
                sm: "0.75rem",
              },

              textAlign: "left",

              whiteSpace: "nowrap",
            }}
          >
            {time}
          </Typography>
        </Box>
      </Stack>

      {!last && (
        <Divider
          sx={{
            borderColor:
              "rgba(0,0,0,0.055)",
          }}
        />
      )}
    </Box>
  );
};


/* =========================================================
   Main
========================================================= */

export default function ContactPage() {
  const contactItems = useMemo(
    () => [
      {
        icon: <LocationOnRounded />,
        title: "آدرس دفتر مرکزی",
        content: (
          <>
            خراسان شمالی، بجنورد، خیابان طلای سفید،
            <br />
            نبش طلای سفید ۹، بازرگانی برج طلایی
            <br />
            <Box
              component="span"
              sx={{
                display: "inline-block",
                mt: 0.5,
                color: "text.disabled",
              }}
            >
              کد پستی: ۹۴۱۳۷۱۷۰۷۸
            </Box>
          </>
        ),
      },
      {
        icon: <PhoneRounded />,
        title: "تلفن تماس",
        content: (
          <Stack spacing={0.5}>
            <Typography
              component="a"
              href="tel:09155552184"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "warning.main",
                },
              }}
            >
              دفتر مرکزی: ۰۹۱۵۵۵۵۲۱۸۴
            </Typography>

            <Typography
              component="a"
              href="tel:09155552182"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "warning.main",
                },
              }}
            >
              فروش: ۰۹۱۵۵۵۵۲۱۸۲
            </Typography>

            <Typography
              component="a"
              href="tel:09155552182"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "warning.main",
                },
              }}
            >
              پشتیبانی: ۰۹۱۵۵۵۵۲۱۸۲
            </Typography>
          </Stack>
        ),
      },
      {
        icon: <EmailRounded />,
        title: "ایمیل",
        content: (
          <Stack spacing={0.5}>
            <Typography
              component="a"
              href="mailto:info@goldentower.ir"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "warning.main",
                },
              }}
            >
              عمومی: info@goldentower.ir
            </Typography>

            <Typography
              component="a"
              href="mailto:sales@goldentower.ir"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "warning.main",
                },
              }}
            >
              فروش: sales@goldentower.ir
            </Typography>

            <Typography
              component="a"
              href="mailto:support@goldentower.ir"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "warning.main",
                },
              }}
            >
              پشتیبانی: support@goldentower.ir
            </Typography>
          </Stack>
        ),
      },
    ],
    []
  );

  const workingHours = useMemo(
    () => [
      {
        icon: <LocationOnRounded />,
        title: "دفتر مرکزی",
        rows: [
          ["شنبه تا چهارشنبه", "۸:۰۰ - ۱۴:۰۰، ۱۷:۰۰ - ۲۱:۰۰"],
          ["پنج‌شنبه", "۸:۰۰ - ۱۳:۰۰"],
          ["جمعه", "تعطیل"],
        ],
      },
      {
        icon: <SupportAgentRounded />,
        title: "پشتیبانی تلفنی",
        rows: [
          ["شنبه تا چهارشنبه", "۸:۰۰ - ۲۱:۰۰"],
          ["پنج‌شنبه", "۸:۰۰ - ۱۶:۰۰"],
          ["جمعه", "۱۰:۰۰ - ۱۴:۰۰"],
        ],
      },
      {
        icon: <EngineeringRounded />,
        title: "خدمات فنی",
        rows: [
          ["شنبه تا چهارشنبه", "۹:۰۰ - ۱۸:۰۰"],
          ["پنج‌شنبه", "۹:۰۰ - ۱۴:۰۰"],
          ["اورژانس (۲۴/۷)", "همیشه"],
        ],
      },
    ],
    []
  );

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

                fontSize: {
                  xs: "1.9rem",
                  sm: "2.4rem",
                  md: "3.1rem",
                },

                mb: 1.5,
              }}
            >
              تماس با ما
            </Typography>

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
              همیشه در کنار شما هستیم
            </Typography>

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
              }}
            >
              برای دریافت اطلاعات بیشتر، مشاوره،
              خرید و خدمات پس از فروش می‌توانید
              از طریق راه‌های ارتباطی زیر با ما
              در تماس باشید.
            </Typography>
          </Box>
        </Hero>

        {/* =================================================
            CONTACT INFORMATION
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
            icon={<PhoneRounded />}
            title="اطلاعات تماس"
            description="راه‌های ارتباطی مستقیم با برج طلایی."
          />

          <ContactCardsGrid>
            {contactItems.map((item) => (
              <ContactCard key={item.title}>
                <ContactItem>
                  <IconBox>
                    {item.icon}
                  </IconBox>

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: {
                          xs: "0.9rem",
                          sm: "0.95rem",
                        },
                        mb: 0.8,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: {
                          xs: "0.72rem",
                          sm: "0.78rem",
                        },
                        lineHeight: 1.9,
                      }}
                    >
                      {item.content}
                    </Typography>
                  </Box>
                </ContactItem>
              </ContactCard>
            ))}
          </ContactCardsGrid>
        </Box>

        {/* =================================================
            MAP
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
            icon={<LocationOnRounded />}
            title="موقعیت ما"
            description="دفتر مرکزی برج طلایی را روی نقشه پیدا کنید."
          />

          <Box
            sx={{
              position: "relative",

              width: "100%",

              height: {
                xs: 300,
                sm: 380,
                md: 460,
              },

              borderRadius: 18,

              overflow: "hidden",

              border:
                "1px solid rgba(212,175,55,0.18)",

              boxShadow:
                "0 10px 30px rgba(30,30,30,0.06)",

              backgroundColor: "#fff",
            }}
          >
            <iframe
              title="موقعیت دفتر مرکزی برج طلایی"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d197.9165586047!2d57.33282246077902!3d37.468632294632485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f709700357194d5%3A0xcb1c85a9cae2b434!2z2KjYp9iy2LHar9in2YbbjCDYqNix2Kwg2LfZhNin24zbjA!5e0!3m2!1sfa!2s!4v1759586449854!5m2!1sfa!2s"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Box>

        {/* =================================================
            WORKING HOURS
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
            icon={<AccessTimeRounded />}
            title="ساعات کاری"
            description="زمان فعالیت بخش‌های مختلف مجموعه."
          />

          <HoursGrid>
            {workingHours.map((section) => (
              <Grid
                item
                xs={12}
                md={4}
                key={section.title}
                sx={{
                  display: "flex",
                }}
              >
                <HoursCard>
                  {/* Gold top line */}
                  <Box
                    sx={{
                      height: 5,

                      background:
                        "linear-gradient(90deg, #c9a227, #e0c15a, #c9a227)",
                    }}
                  />

                  {/* Header */}
                  <Box
                    sx={{
                      px: {
                        xs: 2,
                        sm: 2.5,
                      },

                      pt: {
                        xs: 2.2,
                        sm: 2.5,
                      },

                      pb: 1.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: {
                            xs: 44,
                            sm: 48,
                          },

                          height: {
                            xs: 44,
                            sm: 48,
                          },

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "center",

                          borderRadius: 2.5,

                          color: "warning.main",

                          backgroundColor:
                            "rgba(212,175,55,0.10)",

                          flexShrink: 0,

                          "& svg": {
                            fontSize: {
                              xs: 22,
                              sm: 24,
                            },
                          },
                        }}
                      >
                        {section.icon}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,

                            fontSize: {
                              xs: "0.9rem",
                              sm: "0.98rem",
                            },

                            lineHeight: 1.5,
                          }}
                        >
                          {section.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: "warning.main",

                            fontSize: {
                              xs: "0.63rem",
                              sm: "0.68rem",
                            },

                            fontWeight: 600,

                            mt: 0.2,
                          }}
                        >
                          برج طلایی
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Divider */}
                  <Divider
                    sx={{
                      borderColor:
                        "rgba(0,0,0,0.06)",
                    }}
                  />

                  {/* Working hours */}
                  <Box sx={{ pb: 1 }}>
                    {section.rows.map(
                      ([day, time], index) => (
                        <HoursRow
                          key={day}
                          day={day}
                          time={time}
                          last={
                            index ===
                            section.rows.length - 1
                          }
                        />
                      )
                    )}
                  </Box>
                </HoursCard>
              </Grid>
            ))}
          </HoursGrid>
        </Box>

        {/* =================================================
            FOOTER CTA
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
            آماده پاسخگویی به شما هستیم
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",

              fontSize: {
                xs: "0.72rem",
                sm: "0.82rem",
              },

              mb: 2,

              lineHeight: 1.8,
            }}
          >
            برای مشاوره، خرید یا دریافت خدمات
            با ما در ارتباط باشید.
          </Typography>

          <Box
            component="a"
            href="tel:09155552182"
            sx={{
              display: "inline-flex",

              alignItems: "center",

              gap: 1,

              color: "warning.main",

              fontWeight: 800,

              fontSize: {
                xs: "0.78rem",
                sm: "0.85rem",
              },

              textDecoration: "none",

              "&:hover": {
                opacity: 0.75,
              },
            }}
          >
            تماس با پشتیبانی

            <ArrowBackRounded
              fontSize="small"
            />
          </Box>
        </Box>

      </Container>
    </Section>
  );
}
