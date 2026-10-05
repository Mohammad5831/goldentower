// src/pages/brand/VitaPage.jsx
import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Container,
  Pagination,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

import slide1 from "../../assets/vita/slide1.webp"
import slide2 from "../../assets/vita/slide2.webp"
import slide3 from "../../assets/vita/slide3.webp"
import slide4 from "../../assets/vita/slide4.webp"
import { fetchProducts } from '../../service/getProducts';
import { getCachedQueryData } from '../../service/indexDBCache';

const sliderImages = [
  slide1,
  slide2,
  slide3,
  slide4,
];

// lazy-load the slider
const ImageSlider = lazy(() => import('../../components/ImageSlider'));

const PageWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
  textShadow: `-1px 2px ${theme.palette.common.black}60`,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
  margin: 'auto',
  marginBottom: theme.spacing(6),
  maxWidth: 800,
}));

const MemoProductCard = memo(function ProductCard({ prod, onClick }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: theme.shadows[3],
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardMedia
        component="img"
        loading="lazy"
        height={200}
        image={`https://api.goldentower.ir/api/image/${prod.image}`}
        alt={prod.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {prod.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {prod.description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => onClick(prod.product_uuid)}
          sx={{
            borderColor: theme.palette.grey[400],
            '&:hover': { borderColor: theme.palette.text.primary },
          }}
        >
          اطلاعات بیشتر
        </Button>
      </Box>
    </Card>
  );
});

export default function VitaPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const category = {
    id: 2,
    title: 'vanity'
  };
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      if (!category) {
        setAllProducts([]);
        return;
      }
      const res = await fetchProducts("vita", category);
      setAllProducts(res.data || []);
    } catch (err) {
      console.log(err);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const allPages = Math.ceil((allProducts?.length || 0) / itemsPerPage) || 1;

    const currentItems = (allProducts || []).slice(startIndex, endIndex);
    setTotalPages(allPages);
    setProducts(currentItems);
  }, [allProducts, page]);

  const handleChangePage = (pageNumber) => {
    setPage(pageNumber)
  };
  const handleProductClick = useCallback(
    (uuid) => navigate(`/productDetail/vita/${uuid}`),
    [navigate]
  );

  return (
    <PageWrapper>
      <Container maxWidth="lg" disableGutters={false}>
        {/* 1. Slider */}
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              height={250}
              animation="wave"
              sx={{ borderRadius: theme.shape.borderRadius, mb: 4 }}
            />
          }
        >
          <Box sx={{ mb: 4 }}>
            <ImageSlider images={sliderImages} size='400px' />
          </Box>
        </Suspense>

        {/* 2. Title */}
        <Box sx={{ mb: 4 }}>
          <StyledTitle variant="h4">
            کابینت روشویی ویتا؛ رویای شما هدف ما
          </StyledTitle>
        </Box>

        {/* 3. Accordion */}
        <InfoCard>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="vita-summary"
              id="vita-header"
            >
              <Typography variant="h6">در یک نگاه</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                مجموعه جوان و خوش‌ذوق ویتا با به‌کارگیری پژوهش‌های مستمر
                بهترین کابینت‌های روشویی، سرویس‌های بهداشتی و شیرآلات را
                تولید می‌کند. محصولات ما با افتخار قابل رقابت با برندهای
                برتر دنیا و دوستدار محیط زیست هستند.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </InfoCard>

        {/* 4. Products Grid */}
        <Grid container spacing={4}>
          {loading
            ? // نمایش Skeleton
            [...Array(6)].map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Skeleton
                  variant="rectangular"
                  height={240}
                  animation="wave"
                  sx={{ borderRadius: theme.shape.borderRadius }}
                />
                <Skeleton width="60%" sx={{ mt: 1 }} />
                <Skeleton width="40%" />
              </Grid>
            ))
            : // کارت‌های محصولات
            products.map((prod) => (
              <Grid item xs={12} sm={6} md={4} key={prod.product_uuid}>
                <MemoProductCard
                  prod={prod}
                  onClick={handleProductClick}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }} >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => handleChangePage(value)}
          color='primary'
        />
      </Box>
    </PageWrapper>
  );
}
