
// src/components/Header.jsx

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Divider,
  Collapse,
  Badge,
  Typography,
  ListItemIcon,
} from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  PersonOutline as PersonIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

import { Link, useLocation } from 'react-router-dom';

import { useAuth } from './AuthContext';
import logoSrc from '../assets/goldenTowerLogo.png';
import { getLocalCart } from '../service/CartLocal';


// ======================================================
// STYLES
// ======================================================

const Offset = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));


const LogoImg = styled('img')(({ theme }) => ({
  width: 150,
  height: 'auto',
  objectFit: 'contain',
  display: 'block',

  [theme.breakpoints.down('md')]: {
    width: 130,
  },

  [theme.breakpoints.down('sm')]: {
    width: 110,
  },
}));


const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active
    ? theme.palette.warning.main
    : theme.palette.text.primary,

  fontWeight: active ? 600 : 400,

  minWidth: 'auto',

  marginLeft: theme.spacing(1),

  borderRadius: 8,

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));


// ======================================================
// DATA
// ======================================================

const navItems = [
  {
    title: 'خانه',
    path: '/',
  },
  {
    title: 'محصولات',
    path: '/products',
  },
  {
    title: 'مقالات',
    path: '/articles',
  },
  {
    title: 'درباره ما',
    path: '/about',
  },
  {
    title: 'تماس با ما',
    path: '/contact',
  },
];


// ======================================================
// COMPONENT
// ======================================================

export default function Header() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down('md')
  );

  const { isLoggedIn } = useAuth();

  const location = useLocation();


  // ----------------------------------------------------
  // STATES
  // ----------------------------------------------------

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [productsOpen, setProductsOpen] = useState(false);

  const [catalogsOpen, setCatalogsOpen] = useState(false);

  const [cartCount, setCartCount] = useState(() => {
    try {
      return getLocalCart().length;
    } catch {
      return 0;
    }
  });


  // ====================================================
  // CART
  // ====================================================

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = getLocalCart();

        setCartCount(
          Array.isArray(cart)
            ? cart.length
            : 0
        );
      } catch {
        setCartCount(0);
      }
    };


    window.addEventListener(
      'cartUpdated',
      updateCartCount
    );


    window.addEventListener(
      'storage',
      updateCartCount
    );


    updateCartCount();


    return () => {
      window.removeEventListener(
        'cartUpdated',
        updateCartCount
      );

      window.removeEventListener(
        'storage',
        updateCartCount
      );
    };
  }, []);


  // ====================================================
  // DRAWER
  // ====================================================

  const closeDrawer = () => {
    setDrawerOpen(false);
  };


  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };


  // ====================================================
  // ACTIVE ROUTE
  // ====================================================

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      {/* ==================================================
          HEADER
      ================================================== */}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#f1f1f1',
          color: theme.palette.text.primary,

          borderBottom: '1px solid',
          borderColor: 'divider',

          zIndex: theme.zIndex.drawer + 1,
        }}
      >

        <Toolbar
          sx={{
            minHeight: {
              xs: 70,
              md: 78,
            },

            px: {
              xs: 2,
              md: 4,
            },

            gap: 1,
          }}
        >

          {/* ==================================================
              LOGO
          ================================================== */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',

              flexGrow: 1,
            }}
          >

            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',

                textDecoration: 'none',
              }}
            >

              <LogoImg
                src={logoSrc}
                alt="Golden Tower"
              />

            </Box>

          </Box>


          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',

                gap: 0.5,
              }}
            >

              {navItems.map(
                ({ title, path }) => (
                  <NavButton
                    key={path}
                    component={Link}
                    to={path}
                    active={
                      isActive(path)
                        ? 1
                        : 0
                    }
                    aria-current={
                      isActive(path)
                        ? 'page'
                        : undefined
                    }
                  >
                    {title}
                  </NavButton>
                )
              )}

            </Box>
          )}


          {/* ==================================================
              USER
          ================================================== */}

          <Button
            component={Link}
            to={
              isLoggedIn
                ? '/dashboard'
                : '/login'
            }
            startIcon={
              <PersonIcon />
            }
            sx={{
              color: theme.palette.text.primary,

              minWidth: 'auto',

              whiteSpace: 'nowrap',

              ml: {
                xs: 0.5,
                md: 1,
              },

              fontSize: {
                xs: 12,
                md: 14,
              },

              '&:hover': {
                backgroundColor:
                  theme.palette.action.hover,
              },
            }}
          >

            {isLoggedIn
              ? 'پنل کاربری'
              : 'ورود / عضویت'}

          </Button>


          {/* ==================================================
              CART
          ================================================== */}

          <IconButton
            component={Link}
            to="/cart"
            aria-label="سبد خرید"
            sx={{
              color: theme.palette.text.primary,

              ml: 0.5,
            }}
          >

            <Badge
              badgeContent={cartCount}
              color="error"
              invisible={cartCount === 0}
              max={99}
            >

              <ShoppingCartIcon />

            </Badge>

          </IconButton>


          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          {isMobile && (
            <IconButton
              edge="end"
              aria-label="باز کردن منو"
              onClick={toggleDrawer}
              sx={{
                color:
                  theme.palette.text.primary,
              }}
            >

              <MenuIcon />

            </IconButton>
          )}

        </Toolbar>

      </AppBar>


      {/* ====================================================
          OFFSET
      ==================================================== */}

      <Offset />


      {/* ====================================================
          MOBILE DRAWER
      ==================================================== */}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
        }}

        sx={{
          '& .MuiDrawer-paper': {
            width: {
              xs: '85%',
              sm: 320,
            },

            maxWidth: 360,

            bgcolor:
              theme.palette.background.paper,
          },
        }}
      >

        {/* ==================================================
            DRAWER HEADER
        ================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',

            justifyContent: 'space-between',

            px: 2,
            py: 1.5,
          }}
        >

          <LogoImg
            src={logoSrc}
            alt="Golden Tower"
          />

          <IconButton
            onClick={closeDrawer}
            aria-label="بستن منو"
          >
            <CloseIcon />
          </IconButton>

        </Box>


        <Divider />


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <List
          sx={{
            px: 1,
            py: 1,
          }}
        >

          {navItems.map(
            ({ title, path }) => (
              <ListItemButton
                key={path}
                component={Link}
                to={path}
                selected={isActive(path)}
                onClick={closeDrawer}
                sx={{
                  borderRadius: 1,

                  mb: 0.5,

                  '&.Mui-selected': {
                    color:
                      theme.palette.warning.main,

                    backgroundColor:
                      theme.palette.action.hover,

                    '&:hover': {
                      backgroundColor:
                        theme.palette.action.hover,
                    },
                  },
                }}
              >

                <ListItemText
                  primary={title}
                  sx={{
                    textAlign: 'left',
                  }}
                />

              </ListItemButton>
            )
          )}

        </List>

        {/* ==================================================
            DRAWER FOOTER
        ================================================== */}

        <Box
          sx={{
            p: 2,
            mt: 'auto',
          }}
        >

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/cart"
            onClick={closeDrawer}
            startIcon={
              <ShoppingCartIcon />
            }
            sx={{
              borderColor:
                theme.palette.warning.main,

              color:
                theme.palette.warning.main,

              '&:hover': {
                borderColor:
                  theme.palette.warning.dark,

                backgroundColor:
                  theme.palette.action.hover,
              },
            }}
          >

            سبد خرید

            {cartCount > 0 &&
              ` (${cartCount})`}

          </Button>

        </Box>

      </Drawer>
    </>
  );
}
