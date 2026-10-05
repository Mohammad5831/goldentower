
// src/pages/Products.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Drawer,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccessTimeRounded,
  AddShoppingCartRounded,
  CloseRounded,
  FavoriteBorderRounded,
  FilterListRounded,
  GridViewRounded,
  Inventory2Rounded,
  ListRounded,
  SearchRounded,
  TuneRounded,
} from "@mui/icons-material";

import { FilterList as FilterListIcon } from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import { addToLocalCart } from "../service/CartLocal";
import { fetchAllProducts } from "../service/getProducts";

import { styled } from "@mui/material/styles";


/* =========================================================
   Page
========================================================= */

const Page = styled("main")(({ theme }) => ({
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

  minHeight: 270,

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
    minHeight: 250,
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: 230,
    borderRadius: 14,
    padding: theme.spacing(3),
  },
}));


/* =========================================================
   Section Header
========================================================= */

const SectionHeader = ({ icon, title, description }) => (
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

          lineHeight: 1.9,

          maxWidth: 650,
        }}
      >
        {description}
      </Typography>
    )}
  </Box>
);


/* =========================================================
   Products Layout
========================================================= */

const ProductsLayout = styled(Box)(({ theme }) => ({
  display: "grid",

  gridTemplateColumns:
    "260px minmax(0, 1fr)",

  gap: theme.spacing(3),

  alignItems: "start",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));


/* =========================================================
   Sidebar
========================================================= */

const Sidebar = styled(Box)(({ theme }) => ({
  position: "sticky",

  top: 24,

  borderRadius: 18,

  padding: theme.spacing(2.5),

  background:
    "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

  border:
    "1px solid rgba(212,175,55,0.14)",

  boxShadow:
    "0 8px 25px rgba(30,30,30,0.045)",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));


/* =========================================================
   Filter Section
========================================================= */

const FilterSection = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(2.5),

  marginBottom: theme.spacing(2.5),

  borderBottom:
    "1px solid rgba(0,0,0,0.07)",

  "&:last-of-type": {
    borderBottom: "none",
    marginBottom: 0,
    paddingBottom: 0,
  },
}));


/* =========================================================
   Product Toolbar
========================================================= */

const Toolbar = styled(Box)(({ theme }) => ({
  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  gap: theme.spacing(2),

  padding: theme.spacing(2),

  marginBottom: theme.spacing(2.5),

  borderRadius: 18,

  background:
    "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

  border:
    "1px solid rgba(212,175,55,0.14)",

  boxShadow:
    "0 8px 25px rgba(30,30,30,0.04)",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));


/* =========================================================
   Product Grid
========================================================= */

const ProductGrid = styled(Box)(({ theme }) => ({
  display: "grid",

  width: "100%",

  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",

  gap: theme.spacing(2.5),

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
  },

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
   Product Card
========================================================= */

const ProductCard = styled(Box)(({ theme }) => ({
  position: "relative",

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
    transform: "translateY(-6px)",

    borderColor:
      "rgba(212,175,55,0.35)",

    boxShadow:
      "0 16px 38px rgba(30,30,30,0.09)",
  },

  [theme.breakpoints.down("sm")]: {
    borderRadius: 15,
  },
}));


/* =========================================================
   Product Image
========================================================= */

const ProductImage = styled(Box)(({ theme }) => ({
  position: "relative",

  height: 220,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  overflow: "hidden",

  margin: theme.spacing(1.5),

  borderRadius: 14,

  background:
    "linear-gradient(145deg, #f5f5f3 0%, #eeeeeb 100%)",

  [theme.breakpoints.down("sm")]: {
    height: 210,
  },

  "& img": {
    width: "100%",
    height: "100%",

    objectFit: "contain",

    padding: theme.spacing(2),

    transition:
      "transform .3s ease",
  },

  "&:hover img": {
    transform: "scale(1.04)",
  },
}));


/* =========================================================
   Discount Badge
========================================================= */

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: "absolute",

  top: 12,
  right: 12,

  zIndex: 2,

  padding:
    theme.spacing(0.6, 1.1),

  borderRadius: 10,

  background:
    "#8b4513",

  color: "#fff",

  fontSize: "0.68rem",

  fontWeight: 800,
}));


/* =========================================================
   Product Content
========================================================= */

const ProductContent = styled(Box)(({ theme }) => ({
  display: "flex",

  flexDirection: "column",

  flex: 1,

  padding:
    theme.spacing(0, 2, 2),

  minWidth: 0,
}));


/* =========================================================
   Product Actions
========================================================= */

const ProductActions = styled(Box)(({ theme }) => ({
  display: "flex",

  gap: theme.spacing(1),

  marginTop: "auto",

  paddingTop: theme.spacing(1.5),
}));


/* =========================================================
   Mobile Filter Button
========================================================= */

const MobileFilterButton = styled(Button)(({ theme }) => ({
  width: "100%",

  marginBottom: theme.spacing(2),

  borderRadius: 13,

  padding:
    theme.spacing(1.2, 2),

  color: "#1a1a1a",

  background:
    "linear-gradient(135deg, #d4af37, #e0c15a)",

  fontWeight: 800,

  "&:hover": {
    background:
      "linear-gradient(135deg, #c9a227, #d4af37)",
  },

  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));


/* =========================================================
   Helpers
========================================================= */

const brandTranslations = {
  vita: "ویتا",
  datees: "داتیس",
  artin: "آرتین",
  badab: "باداب",
  pars: "پارس",
  akhvan: "اخوان",
  parnian: "پرنیان",
  chiniCord: "چینی کرد",
  mixPlus: "میکس پلاس",
};


/* =========================================================
   Filter Content
========================================================= */

const FiltersContent = ({
  filters,
  brands,
  categories,
  handleFilterChange,
  handlePriceFilter,
  clearFilters,
  onClose,
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <TuneRounded
            sx={{
              color: "warning.main",
            }}
          />

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
            }}
          >
            فیلتر محصولات
          </Typography>
        </Stack>

        {onClose && (
          <IconButton
            onClick={onClose}
            size="small"
          >
            <CloseRounded />
          </IconButton>
        )}
      </Stack>


      {/* Brand */}

      <FilterSection>
        <Typography
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: "0.9rem",
          }}
        >
          برند
        </Typography>

        <Stack spacing={0.2}>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  size="small"
                  checked={filters.brands.includes(
                    brand
                  )}
                  onChange={(e) =>
                    handleFilterChange(
                      "brands",
                      brand,
                      e.target.checked
                    )
                  }
                  sx={{
                    "&.Mui-checked": {
                      color:
                        "warning.main",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize:
                      "0.78rem",
                  }}
                >
                  {brandTranslations[
                    brand
                  ] || brand}
                </Typography>
              }
            />
          ))}
        </Stack>
      </FilterSection>


      {/* Categories */}

      <FilterSection>
        <Typography
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: "0.9rem",
          }}
        >
          دسته‌بندی
        </Typography>

        <Stack spacing={0.2}>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  size="small"
                  checked={filters.categories.includes(
                    category
                  )}
                  onChange={(e) =>
                    handleFilterChange(
                      "categories",
                      category,
                      e.target.checked
                    )
                  }
                  sx={{
                    "&.Mui-checked": {
                      color:
                        "warning.main",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize:
                      "0.78rem",
                  }}
                >
                  {category}
                </Typography>
              }
            />
          ))}
        </Stack>
      </FilterSection>


      {/* Price */}

      <FilterSection>
        <Typography
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: "0.9rem",
          }}
        >
          محدوده قیمت
        </Typography>

        <Stack spacing={1}>
          <TextField
            size="small"
            placeholder="حداقل قیمت"
            value={filters.priceMin}
            onChange={(e) =>
              handlePriceFilter(
                "priceMin",
                e.target.value
              )
            }
            inputProps={{
              inputMode: "numeric",
            }}
          />

          <TextField
            size="small"
            placeholder="حداکثر قیمت"
            value={filters.priceMax}
            onChange={(e) =>
              handlePriceFilter(
                "priceMax",
                e.target.value
              )
            }
            inputProps={{
              inputMode: "numeric",
            }}
          />
        </Stack>
      </FilterSection>


      {/* Extra filters */}

      <FilterSection>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={filters.hasDiscount}
              onChange={(e) =>
                handleFilterChange(
                  "hasDiscount",
                  null,
                  e.target.checked
                )
              }
              sx={{
                "&.Mui-checked": {
                  color:
                    "warning.main",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontSize: "0.78rem",
              }}
            >
              فقط محصولات تخفیف‌دار
            </Typography>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={filters.inStock}
              onChange={(e) =>
                handleFilterChange(
                  "inStock",
                  null,
                  e.target.checked
                )
              }
              sx={{
                "&.Mui-checked": {
                  color:
                    "warning.main",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontSize: "0.78rem",
              }}
            >
              فقط محصولات موجود
            </Typography>
          }
        />
      </FilterSection>


      {/* دکمه‌ها */}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          justifyContent: "space-between",
          mt: 2.5,
        }}
      >
        <Button
          onClick={clearFilters}
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: "10px",
            borderColor: "#D4AF37",
            color: "#171717",
            fontWeight: 700,
          }}
        >
          پاک کردن
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            flex: 1,
            bgcolor: "#D4AF37",
            color: "#171717",
            borderRadius: "10px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: "#C9A227",
            },
          }}
        >
          اعمال
        </Button>
      </Box>
    </Box>
  );
};


/* =========================================================
   Product Card
========================================================= */

const ProductCardView = ({
  product,
  viewMode,
  onProductClick,
  onAddToCart,
  adding,
  formatPrice,
}) => {
  const isInStock = Boolean(
    product.inStock
  );

  return (
    <ProductCard
      sx={
        viewMode === "list"
          ? {
            gridColumn:
              "1 / -1",

            flexDirection:
              "row",

            p: 1.5,

            "@media (max-width:600px)":
            {
              flexDirection:
                "column",
            },
          }
          : undefined
      }
    >
      {/* Image */}

      <ProductImage
        onClick={() =>
          onProductClick(product)
        }
        sx={
          viewMode === "list"
            ? {
              width: 240,
              minWidth: 240,
              height: 220,
              margin: 0,

              "@media (max-width:600px)":
              {
                width: "auto",
                minWidth: 0,
                margin: 0,
              },
            }
            : undefined
        }
      >
        {product.discount > 0 && (
          <DiscountBadge>
            {product.discount}% تخفیف
          </DiscountBadge>
        )}

        <img
          src={`http://localhost:5000/api/image/${product.image}`}
          alt={product.name}
          loading="lazy"
        />
      </ProductImage>


      {/* Content */}

      <ProductContent
        onClick={() =>
          onProductClick(product)
        }
        sx={
          viewMode === "list"
            ? {
              padding:
                2,

              "@media (max-width:600px)":
              {
                padding:
                  2,
              },
            }
            : undefined
        }
      >
        {/* Brand */}

        <Typography
          sx={{
            color: "warning.main",

            fontSize:
              "0.68rem",

            fontWeight: 800,

            mb: 0.5,
          }}
        >
          {brandTranslations[
            product.brand
          ] || product.brand}
        </Typography>


        {/* Name */}

        <Typography
          sx={{
            color:
              "text.primary",

            fontWeight: 800,

            fontSize: {
              xs: "0.88rem",
              sm: "0.92rem",
            },

            lineHeight: 1.7,

            mb: 1,

            display:
              "-webkit-box",

            WebkitLineClamp: 2,

            WebkitBoxOrient:
              "vertical",

            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>


        {/* Model */}

        {product.model && (
          <Typography
            sx={{
              color:
                "text.disabled",

              fontSize:
                "0.68rem",

              mb: 1.5,
            }}
          >
            مدل: {product.model}
          </Typography>
        )}


        {/* Availability */}

        <Stack
          direction="row"
          spacing={0.7}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,

              borderRadius:
                "50%",

              bgcolor: isInStock
                ? "success.main"
                : "text.disabled",
            }}
          />

          <Typography
            sx={{
              color: isInStock
                ? "success.main"
                : "text.disabled",

              fontSize:
                "0.68rem",

              fontWeight: 600,
            }}
          >
            {isInStock
              ? "موجود در انبار"
              : "ناموجود"}
          </Typography>
        </Stack>


        {/* Price */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
          flexWrap="wrap"
          sx={{
            mb: 1,
          }}
        >
          <Typography
            sx={{
              color:
                "warning.main",

              fontWeight: 900,

              fontSize: {
                xs: "0.85rem",
                sm: "0.9rem",
              },
            }}
          >
            {formatPrice(
              product.current_price
            )}
          </Typography>

          {product.original_price &&
            product.current_price <
            product.original_price && (
              <Typography
                sx={{
                  color:
                    "text.disabled",

                  fontSize:
                    "0.7rem",

                  textDecoration:
                    "line-through",
                }}
              >
                {formatPrice(
                  product.original_price
                )}
              </Typography>
            )}
        </Stack>


        {/* Actions */}

        <ProductActions
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <Button
            fullWidth
            disabled={!isInStock || adding}
            onClick={() =>
              onAddToCart(product)
            }
            startIcon={
              <AddShoppingCartRounded />
            }
            sx={{
              borderRadius: 2.5,

              py: 1,

              bgcolor:
                isInStock
                  ? "warning.main"
                  : "#eeeeee",

              color:
                isInStock
                  ? "#1a1a1a"
                  : "#999",

              fontWeight: 800,

              fontSize:
                "0.72rem",

              "&:hover": {
                bgcolor:
                  isInStock
                    ? "warning.dark"
                    : "#eeeeee",
              },
            }}
          >
            {adding
              ? "در حال افزودن..."
              : isInStock
                ? "افزودن به سبد"
                : "ناموجود"}
          </Button>

          <IconButton
            sx={{
              border:
                "1px solid rgba(212,175,55,0.2)",

              borderRadius: 2.5,

              color:
                "warning.main",

              flexShrink: 0,
            }}
            onClick={() =>
              onProductClick(product)
            }
          >
            <FavoriteBorderRounded />
          </IconButton>
        </ProductActions>
      </ProductContent>
    </ProductCard>
  );
};


/* =========================================================
   Main
========================================================= */

const Products = () => {
  const { brand } = useParams();

  const navigate = useNavigate();


  /* =======================================================
     State
  ======================================================= */

  const [allProducts, setAllProducts] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [sortBy, setSortBy] =
    useState("newest");

  const [viewMode, setViewMode] =
    useState("grid");

  const [page, setPage] =
    useState(1);

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  const [addingProductId, setAddingProductId] =
    useState(null);

  const [filters, setFilters] =
    useState({
      brands: brand ? [brand] : [],
      categories: [],
      priceMin: "",
      priceMax: "",
      hasDiscount: false,
      inStock: false,
    });

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });


  const itemsPerPage = 9;


  /* =======================================================
     Fetch Products
  ======================================================= */

  const fetchAll = useCallback(
    async () => {
      try {
        const res =
          await fetchAllProducts();

        setAllProducts(
          res?.data?.products || []
        );
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setSnackbar({
          open: true,
          message:
            "دریافت محصولات با خطا مواجه شد.",
          severity: "error",
        });
      }
    },
    []
  );

console.log(allProducts);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);


  /* =======================================================
     Sync Brand URL
  ======================================================= */

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,

      brands: brand
        ? [brand]
        : prev.brands,
    }));

    setPage(1);
  }, [brand]);


  /* =======================================================
     Brands / Categories
  ======================================================= */

  const brands = useMemo(
    () =>
      [
        ...new Set(
          allProducts
            .map(
              (product) =>
                product.brand
            )
            .filter(Boolean)
        ),
      ],
    [allProducts]
  );


  const categories = useMemo(
    () =>
      [
        ...new Set(
          allProducts
            .map(
              (product) =>
                product.Category?.name
            )
            .filter(Boolean)
        ),
      ],
    [allProducts]
  );


  /* =======================================================
     Filtering + Sorting
  ======================================================= */

  const filteredProducts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      const minPrice =
        filters.priceMin
          ? Number(
            filters.priceMin
          )
          : null;

      const maxPrice =
        filters.priceMax
          ? Number(
            filters.priceMax
          )
          : null;

      const result =
        allProducts.filter(
          (product) => {
            const productName =
              String(
                product.name || ""
              ).toLowerCase();

            const matchesSearch =
              !query ||
              productName.includes(
                query
              );

            const matchesBrand =
              !filters.brands.length ||
              filters.brands.includes(
                product.brand
              );

            const matchesCategory =
              !filters.categories
                .length ||
              filters.categories.includes(
                product.Category?.name
              );

            const matchesMinPrice =
              minPrice === null ||
              Number(
                product.current_price ||
                product.price ||
                0
              ) >= minPrice;

            const matchesMaxPrice =
              maxPrice === null ||
              Number(
                product.current_price ||
                product.price ||
                0
              ) <= maxPrice;

            const matchesDiscount =
              !filters.hasDiscount ||
              Number(
                product.discount || 0
              ) > 0;

            const matchesStock =
              !filters.inStock ||
              Boolean(
                product.inStock
              );

            return (
              matchesSearch &&
              matchesBrand &&
              matchesCategory &&
              matchesMinPrice &&
              matchesMaxPrice &&
              matchesDiscount &&
              matchesStock
            );
          }
        );


      switch (sortBy) {
        case "price-low":
          result.sort(
            (a, b) =>
              Number(
                a.current_price ||
                a.price ||
                0
              ) -
              Number(
                b.current_price ||
                b.price ||
                0
              )
          );
          break;

        case "price-high":
          result.sort(
            (a, b) =>
              Number(
                b.current_price ||
                b.price ||
                0
              ) -
              Number(
                a.current_price ||
                a.price ||
                0
              )
          );
          break;

        case "discount":
          result.sort(
            (a, b) =>
              Number(
                b.discount || 0
              ) -
              Number(
                a.discount || 0
              )
          );
          break;

        case "newest":
          result.sort(
            (a, b) => {
              const dateA =
                new Date(
                  a.createdAt || 0
                ).getTime();

              const dateB =
                new Date(
                  b.createdAt || 0
                ).getTime();

              return (
                dateB - dateA
              );
            }
          );
          break;

        default:
          break;
      }

      return result;
    },
      [
        allProducts,
        searchQuery,
        filters,
        sortBy,
      ]
    );


  /* =======================================================
     Pagination
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProducts.length /
        itemsPerPage
      )
    );


  const currentProducts =
    useMemo(() => {
      const start =
        (page - 1) *
        itemsPerPage;

      return filteredProducts.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredProducts,
      page,
    ]);


  /* =======================================================
     Filter Handlers
  ======================================================= */

  const handleFilterChange = (
    filterType,
    value,
    checked
  ) => {
    setFilters((prev) => {
      if (
        filterType === "brands" ||
        filterType === "categories"
      ) {
        const current =
          prev[filterType] || [];

        return {
          ...prev,

          [filterType]: checked
            ? [
              ...current,
              value,
            ]
            : current.filter(
              (item) =>
                item !== value
            ),
        };
      }

      return {
        ...prev,

        [filterType]: checked,
      };
    });

    setPage(1);
  };


  const handlePriceFilter = (
    type,
    value
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));

    setPage(1);
  };


  const clearFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      priceMin: "",
      priceMax: "",
      hasDiscount: false,
      inStock: false,
    });

    setSearchQuery("");

    setPage(1);
  };


  /* =======================================================
     Search
  ======================================================= */

  const handleSearchChange = (
    value
  ) => {
    setSearchQuery(value);
    setPage(1);
  };


  /* =======================================================
     Product Navigation
  ======================================================= */

  const handleProductClick = (
    product
  ) => {
    navigate(
      `/productDetail/${product.product_uuid}`
    );
  };


  /* =======================================================
     Add To Cart
  ======================================================= */

  const handleAddToCart =
    async (product) => {
      setAddingProductId(
        product.product_uuid
      );

      try {
        const item = {
          current_price:
            product.current_price,

          original_price:
            product.original_price,

          image:
            product.image,

          quantity:
            product.quantity || 1,

          name:
            product.name,

          model:
            product.model,

          product_uuid:
            product.product_uuid,
        };

        const result =
          addToLocalCart(item);

        if (result.success) {
          setSnackbar({
            open: true,

            message:
              `محصول ${product.name} با موفقیت به سبد خرید اضافه شد.`,

            severity:
              "success",
          });
        } else {
          setSnackbar({
            open: true,

            message:
              `محصول ${product.name} در سبد خرید موجود است.`,

            severity:
              "warning",
          });
        }
      } catch (error) {
        console.error(
          "Add to cart error:",
          error
        );

        setSnackbar({
          open: true,

          message:
            "خطا در اضافه کردن محصول به سبد خرید.",

          severity:
            "error",
        });
      } finally {
        setAddingProductId(null);
      }
    };


  /* =======================================================
     Price
  ======================================================= */

  const formatPrice =
    useCallback(
      (price) =>
        `${new Intl.NumberFormat(
          "en-IR"
        ).format(
          Number(price || 0)
        )} تومان`,
      []
    );


  /* =======================================================
     Render
  ======================================================= */

  return (
    <Page dir="rtl">
      <Container maxWidth="lg">


        {/* =================================================
            HERO
        ================================================= */}

        <Hero>
          <Box
            sx={{
              position:
                "relative",

              zIndex: 2,

              textAlign:
                "center",

              maxWidth: 760,

              px: {
                xs: 1,
                sm: 3,
              },
            }}
          >
            <Typography
              sx={{
                color:
                  "warning.main",

                fontWeight: 900,

                fontSize: {
                  xs: "1.9rem",
                  sm: "2.4rem",
                  md: "3rem",
                },

                mb: 1.2,
              }}
            >
              محصولات
            </Typography>

            <Typography
              sx={{
                color: "#fff",

                fontWeight: 700,

                fontSize: {
                  xs: "0.95rem",
                  sm: "1.1rem",
                  md: "1.3rem",
                },

                mb: 1.5,
              }}
            >
              انتخابی مطمئن برای خانه شما
            </Typography>

            <Typography
              sx={{
                color:
                  "rgba(255,255,255,0.68)",

                lineHeight: 2,

                fontSize: {
                  xs: "0.74rem",
                  sm: "0.84rem",
                  md: "0.92rem",
                },
              }}
            >
              مجموعه‌ای از محصولات باکیفیت
              از برندهای معتبر، با امکان
              مقایسه و انتخاب آسان.
            </Typography>
          </Box>
        </Hero>


        {/* =================================================
            PRODUCTS
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
            icon={
              <Inventory2Rounded />
            }
            title="فهرست محصولات"
            description="محصول موردنظر خود را جستجو کنید یا با استفاده از فیلترها انتخاب دقیق‌تری داشته باشید."
          />


          <ProductsLayout>


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar>
              <FiltersContent
                filters={filters}
                brands={brands}
                categories={categories}
                handleFilterChange={
                  handleFilterChange
                }
                handlePriceFilter={
                  handlePriceFilter
                }
                clearFilters={
                  clearFilters
                }
              />
            </Sidebar>


            {/* =================================================
                PRODUCTS CONTENT
            ================================================= */}

            <Box
              sx={{
                minWidth: 0,
              }}
            >


              {/* Mobile filter */}

              <MobileFilterButton
                startIcon={<FilterListRounded />}
                onClick={() => setMobileFilterOpen(true)}
                sx={{
                  backgroundColor: "#D4AF37",
                  color: "#1a1a1a",
                  fontWeight: 700,

                  "&:hover": {
                    backgroundColor: "#c9a227",
                  },
                }}
              >
                فیلتر محصولات
              </MobileFilterButton>


              {/* Mobile Drawer */}

              <Drawer
                anchor="right"
                open={mobileFilterOpen}
                onClose={() => setMobileFilterOpen(false)}
                sx={{
                  display: { xs: "block", md: "none" },

                  "& .MuiDrawer-paper": {
                    width: 280,
                    p: 2.5,
                    bgcolor: "#f7f7f5",
                    boxSizing: "border-box",
                  },
                }}
              >
                <FiltersContent
                  filters={filters}
                  brands={brands}
                  categories={categories}
                  brandTranslations={brandTranslations}
                  handlePriceFilter={handlePriceFilter}
                  handleFilterChange={handleFilterChange}
                  clearFilters={clearFilters}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </Drawer>


              {/* =================================================
                  TOOLBAR
              ================================================= */}

              <Toolbar>

                {/* Search */}

                <TextField
                  fullWidth
                  size="small"
                  value={
                    searchQuery
                  }
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value
                    )
                  }
                  placeholder="جستجوی محصول..."
                  sx={{
                    maxWidth: 450,

                    "& .MuiOutlinedInput-root":
                    {
                      borderRadius: 2.5,

                      background:
                        "#fff",

                      "&.Mui-focused fieldset":
                      {
                        borderColor:
                          "warning.main",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded
                          sx={{
                            color:
                              "text.disabled",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />


                {/* Controls */}

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                  }}
                >

                  <Select
                    size="small"
                    value={
                      sortBy
                    }
                    onChange={(e) => {
                      setSortBy(
                        e.target.value
                      );
                      setPage(1);
                    }}
                    sx={{
                      minWidth: 145,

                      borderRadius: 2.5,

                      background:
                        "#fff",

                      fontSize:
                        "0.75rem",

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor:
                          "warning.main",
                      },
                    }}
                  >
                    <MenuItem value="newest">
                      جدیدترین
                    </MenuItem>

                    <MenuItem value="price-low">
                      ارزان‌ترین
                    </MenuItem>

                    <MenuItem value="price-high">
                      گران‌ترین
                    </MenuItem>

                    <MenuItem value="discount">
                      بیشترین تخفیف
                    </MenuItem>
                  </Select>


                  <Box
                    sx={{
                      display: {
                        xs: "none",
                        sm: "flex",
                      },

                      border:
                        "1px solid rgba(0,0,0,0.1)",

                      borderRadius: 2.5,

                      overflow: "hidden",

                      background:
                        "#fff",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        setViewMode(
                          "grid"
                        )
                      }
                      sx={{
                        borderRadius: 0,

                        color:
                          viewMode ===
                            "grid"
                            ? "warning.main"
                            : "text.disabled",

                        bgcolor:
                          viewMode ===
                            "grid"
                            ? "rgba(212,175,55,0.1)"
                            : "transparent",
                      }}
                    >
                      <GridViewRounded />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() =>
                        setViewMode(
                          "list"
                        )
                      }
                      sx={{
                        borderRadius: 0,

                        color:
                          viewMode ===
                            "list"
                            ? "warning.main"
                            : "text.disabled",

                        bgcolor:
                          viewMode ===
                            "list"
                            ? "rgba(212,175,55,0.1)"
                            : "transparent",
                      }}
                    >
                      <ListRounded />
                    </IconButton>
                  </Box>
                </Stack>
              </Toolbar>


              {/* =================================================
                  RESULT INFO
              ================================================= */}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  mb: 2,
                  px: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.76rem",
                  }}
                >
                  {filteredProducts.length}{" "}
                  محصول یافت شد
                </Typography>

                {filters.brands.length >
                  0 && (
                    <Typography
                      sx={{
                        color:
                          "warning.main",

                        fontSize:
                          "0.72rem",

                        fontWeight: 700,
                      }}
                    >
                      برند:{" "}
                      {brandTranslations[
                        filters.brands[0]
                      ] ||
                        filters.brands[0]}
                    </Typography>
                  )}
              </Stack>


              {/* =================================================
                  PRODUCTS
              ================================================= */}

              {currentProducts.length >
                0 ? (
                <ProductGrid
                  sx={
                    viewMode ===
                      "list"
                      ? {
                        gridTemplateColumns:
                          "1fr",
                      }
                      : undefined
                  }
                >
                  {currentProducts.map(
                    (product) => (
                      <ProductCardView
                        key={
                          product.product_uuid
                        }
                        product={
                          product
                        }
                        viewMode={
                          viewMode
                        }
                        onProductClick={
                          handleProductClick
                        }
                        onAddToCart={
                          handleAddToCart
                        }
                        adding={
                          addingProductId ===
                          product.product_uuid
                        }
                        formatPrice={
                          formatPrice
                        }
                      />
                    )
                  )}
                </ProductGrid>
              ) : (
                <Box
                  sx={{
                    minHeight: 320,

                    display: "flex",

                    flexDirection:
                      "column",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    textAlign:
                      "center",

                    borderRadius: 18,

                    background:
                      "linear-gradient(145deg, #ffffff 0%, #faf9f6 100%)",

                    border:
                      "1px solid rgba(212,175,55,0.14)",
                  }}
                >
                  <Inventory2Rounded
                    sx={{
                      fontSize: 50,
                      color:
                        "text.disabled",
                      mb: 1.5,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 0.7,
                    }}
                  >
                    محصولی پیدا نشد
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize:
                        "0.78rem",

                      mb: 2,
                    }}
                  >
                    فیلترها یا عبارت
                    جستجو را تغییر دهید.
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={
                      clearFilters
                    }
                    sx={{
                      borderRadius: 2.5,

                      color:
                        "warning.main",

                      borderColor:
                        "warning.main",
                    }}
                  >
                    پاک کردن فیلترها
                  </Button>
                </Box>
              )}


              {/* =================================================
                  PAGINATION
              ================================================= */}

              {filteredProducts.length >
                0 && (
                  <Pagination
                    count={
                      totalPages
                    }
                    page={page}
                    onChange={(
                      _event,
                      value
                    ) =>
                      setPage(value)
                    }
                    shape="rounded"
                    sx={{
                      mt: 4,

                      display:
                        "flex",

                      justifyContent:
                        "center",

                      "& .MuiPaginationItem-root":
                      {
                        color:
                          "text.secondary",

                        borderColor:
                          "rgba(0,0,0,0.1)",
                      },

                      "& .Mui-selected":
                      {
                        bgcolor:
                          "warning.main",

                        color:
                          "#1a1a1a",

                        fontWeight: 800,

                        "&:hover":
                        {
                          bgcolor:
                            "warning.dark",
                        },
                      },
                    }}
                  />
                )}
            </Box>
          </ProductsLayout>
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

            textAlign:
              "center",
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
            محصول موردنظر خود را پیدا نکردید؟
          </Typography>

          <Typography
            sx={{
              color:
                "text.secondary",

              fontSize: {
                xs: "0.72rem",
                sm: "0.82rem",
              },

              lineHeight: 1.8,
            }}
          >
            برای دریافت اطلاعات بیشتر درباره
            محصولات و موجودی با ما در تماس باشید.
          </Typography>
        </Box>

      </Container>


      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          3000
        }
        onClose={() =>
          setSnackbar(
            (prev) => ({
              ...prev,
              open: false,
            })
          )
        }
        anchorOrigin={{
          vertical:
            "bottom",
          horizontal:
            "center",
        }}
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={() =>
            setSnackbar(
              (prev) => ({
                ...prev,
                open: false,
              })
            )
          }
          sx={{
            width: "100%",
          }}
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </Page>
  );
};


export default Products;
