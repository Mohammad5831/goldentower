
// src/components/Footer.jsx

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Button,
  Divider,
} from "@mui/material";

import {
  WhatsApp,
  Instagram,
  Phone,
} from "@mui/icons-material";

import TelegramIcon from "@mui/icons-material/Telegram";


// ======================================================
// Constants
// ======================================================

const GOLD = "#D4AF37";
const PHONE_NUMBER = "+989155552184";


// ======================================================
// Footer Wrapper
// ======================================================

const FooterBox = styled(Box)(() => ({
  backgroundColor: "#f1f1f1",
  paddingTop: 48,
  paddingBottom: 24,
}));


// ======================================================
// Section Title
// ======================================================

const SectionTitle = styled(Typography)(() => ({
  color: "#181818",
  fontWeight: 800,
  fontSize: "1rem",

  position: "relative",

  paddingBottom: 10,
  marginBottom: 20,

  "&::after": {
    content: '""',
    position: "absolute",

    left: 0,
    bottom: 0,

    width: 38,
    height: 3,

    backgroundColor: GOLD,
    borderRadius: 5,
  },
}));


// ======================================================
// Link List
// ======================================================

const LinkList = styled("ul")(() => ({
  listStyle: "none",
  padding: 0,
  margin: 0,
}));


// ======================================================
// Link Item
// ======================================================

const LinkItem = styled("li")(() => ({
  marginBottom: 11,
}));


// ======================================================
// Footer Link
// ======================================================

const FooterLink = styled(MuiLink)(() => ({
  color: "#555",
  textDecoration: "none",

  fontSize: "0.85rem",
  fontWeight: 500,

  transition: "all 0.2s ease",

  "&:hover": {
    color: GOLD,
    paddingRight: 4,
  },
}));


// ======================================================
// Social Button
// ======================================================

const SocialButton = styled(IconButton)(() => ({
  width: 40,
  height: 40,

  color: GOLD,

  border: "1px solid #dddddd",
  backgroundColor: "#fff",

  transition: "all 0.25s ease",

  "&:hover": {
    color: "#fff",
    backgroundColor: GOLD,
    borderColor: GOLD,
    transform: "translateY(-3px)",
  },
}));


// ======================================================
// Branch Data
// ======================================================

const branches = [
  {
    title: "دفتر مرکزی",
    address:
      "خراسان شمالی، بجنورد، خیابان طلای سفید، بازرگانی برج طلایی",
  },
  {
    title: "گالری کاشی تبریز",
    address:
      "خراسان شمالی، بجنورد، خیابان قیام جنوبی، نبش قیام ۲",
  },
  {
    title: "شعبه اسفراین",
    address:
      "خیابان سپیده کاشانی، معبر آخر، بلوار کشاورز، پلاک ۰، طبقه همکف",
  },
  {
    title: "شعبه گنبد کاووس",
    address:
      "خیابان حافظ جنوبی، نبش کوچه هجدهم، کوچه شهید داود مقدم",
  },
  {
    title: "شعبه جاجرم",
    address:
      "خیابان شهید مطهری، نبش چهارراه معلم",
  },
];


// ======================================================
// Footer
// ======================================================

export default function Footer() {
  const theme = useTheme();

  return (
    <FooterBox
      component="footer"
      role="contentinfo"
      sx={{
        direction: "ltr",
      }}
    >
      <Container maxWidth="lg">

        {/* ==================================================
            MAIN FOOTER
        ================================================== */}

        <Grid
          container
          spacing={{
            xs: 4,
            md: 5,
          }}
        >

          {/* ==================================================
              ABOUT STORE
          ================================================== */}

          <Grid item xs={12} sm={6} md={3}>

            <SectionTitle>
              فروشگاه برج طلایی
            </SectionTitle>

            <Typography
              sx={{
                color: "#666",
                fontSize: "0.85rem",
                lineHeight: 2,
                mb: 2.5,
                maxWidth: 450,
              }}
            >
              برج طلایی با بیش از ۲۰ سال سابقه در زمینه فروش
              محصولات ساختمانی و ارائه خدمات مشاوره فعالیت می‌کند.
            </Typography>

            <Button
              variant="outlined"
              component="a"
              href={`tel:${PHONE_NUMBER}`}
              startIcon={<Phone />}
              sx={{
                direction: "ltr",

                color: GOLD,
                borderColor: GOLD,

                borderRadius: 2,

                px: 2,

                fontSize: "0.8rem",
                fontWeight: 700,

                "&:hover": {
                  color: "#fff",
                  backgroundColor: GOLD,
                  borderColor: GOLD,
                },
              }}
            >
              همین الان مشاوره بگیرید
            </Button>

          </Grid>


          {/* ==================================================
              QUICK LINKS
          ================================================== */}

          <Grid item xs={12} sm={6} md={3}>

            <SectionTitle>
              دسترسی سریع
            </SectionTitle>

            <LinkList>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/"
                >
                  صفحه اصلی
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/products"
                >
                  محصولات
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/about"
                >
                  درباره ما
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/contact"
                >
                  تماس با ما
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/cart"
                >
                  سبد خرید
                </FooterLink>
              </LinkItem>

            </LinkList>

          </Grid>


          {/* ==================================================
              USER ACCOUNT
          ================================================== */}

          <Grid item xs={12} sm={6} md={3}>

            <SectionTitle>
              حساب کاربری
            </SectionTitle>

            <LinkList>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/login"
                >
                  ورود به حساب کاربری
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/signup"
                >
                  ثبت‌نام
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/user"
                >
                  پنل کاربری
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/user/orders"
                >
                  سفارش‌های من
                </FooterLink>
              </LinkItem>

              <LinkItem>
                <FooterLink
                  component={RouterLink}
                  to="/user/addresses"
                >
                  آدرس‌های من
                </FooterLink>
              </LinkItem>

            </LinkList>


            {/* Social Media */}

            <Box
              sx={{
                display: "flex",
                gap: 1,

                mt: 2.5,
              }}
            >

              <SocialButton
                component="a"
                href={`https://wa.me/${PHONE_NUMBER.replace(
                  "+",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <WhatsApp fontSize="small" />
              </SocialButton>


              <SocialButton
                component="a"
                href="https://instagram.com/golden_tower_bojnurd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram fontSize="small" />
              </SocialButton>


              <SocialButton
                component="a"
                href="https://t.me/goldentower_admin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <TelegramIcon fontSize="small" />
              </SocialButton>

            </Box>

          </Grid>


          {/* ==================================================
              BRANCHES
          ================================================== */}

          <Grid item xs={12} sm={6} md={3}>

            <SectionTitle>
              آدرس شعب
            </SectionTitle>

            {branches.map((branch) => (
              <Box
                key={branch.title}
                sx={{
                  mb: 2,
                }}
              >

                <Typography
                  sx={{
                    color: "#222",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    mb: 0.4,
                  }}
                >
                  {branch.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#666",
                    fontSize: "0.75rem",
                    lineHeight: 1.9,
                  }}
                >
                  {branch.address}
                </Typography>

              </Box>
            ))}

          </Grid>

        </Grid>


        {/* ==================================================
            BOTTOM
        ================================================== */}

        <Divider
          sx={{
            mt: 5,
            mb: 3,
            borderColor: "#dddddd",
          }}
        />


        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },

            alignItems: "center",
            justifyContent: "space-between",

            gap: 3,

            textAlign: "center",
          }}
        >

          {/* Enamad */}

          <Box>
            <a
              href="https://trustseal.enamad.ir/?id=650495&Code=fysBMViTiV7b23kkrtRDcOu0c1tXlTGs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="نماد اعتماد الکترونیکی"
            >
              <img
                src="https://trustseal.enamad.ir/logo.aspx?id=650495&Code=fysBMViTiV7b23kkrtRDcOu0c1tXlTGs"
                alt="نماد اعتماد الکترونیکی"
                style={{
                  cursor: "pointer",
                  maxHeight: 60,
                  display: "block",
                }}
              />
            </a>
          </Box>


          {/* Copyright */}

          <Typography
            sx={{
              color: "#777",
              fontSize: "0.75rem",
              lineHeight: 1.8,
            }}
          >
            © ۱۴۰۴ فروشگاه برج طلایی.
            تمامی حقوق محفوظ است.
          </Typography>


          {/* Phone */}

          <Box
            component="a"
            href={`tel:${PHONE_NUMBER}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,

              color: "#555",
              textDecoration: "none",

              fontSize: "0.8rem",
              fontWeight: 700,

              transition: "color 0.2s ease",

              "&:hover": {
                color: GOLD,
              },
            }}
          >
            <Phone sx={{ fontSize: 18, color: GOLD }} />

            <Box
              component="span"
              sx={{
                direction: "ltr",
                unicodeBidi: "isolate",
              }}
            >
              0915 555 2184
            </Box>
          </Box>

        </Box>

      </Container>
    </FooterBox>
  );
}
