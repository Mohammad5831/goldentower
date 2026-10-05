import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts } from '../../service/getProducts';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Skeleton,
  Pagination,
} from "@mui/material";
import { styled, } from "@mui/material/styles";

const BackLink = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(3, 0),
  color: theme.palette.error.main,
  "& a": {
    cursor: "pointer",
    textDecoration: "none",
    color: theme.palette.error.main,
  },
  "& a:hover": {
    color: theme.palette.text.primary,
  },
}));

const categoriesMap = {
  gaz: "اجاق گاز توکار",
  hood: "هود",
  sink: "سینک",
  fer: 'فر توکار',
  macrowave: 'مایکروویو'
};

const categoriesDetail = [
  {
    id: 3,
    title: 'gaz'
  },
  {
    id: 7,
    title: 'hood'
  },
  {
    id: 9,
    title: 'sink'
  },
  {
    id: 5,
    title: 'fertokar'
  },
  {
    id: 6,
    title: 'macrowave'
  },
];

export default function MixPlusProducts() {

    const { category } = useParams()
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;
    const selectedCategory = categoriesDetail.find((cat) => cat.title == category)

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            if (!selectedCategory) {
                setAllProducts([]);
                return;
            }
            const res = await fetchProducts("mixplus", selectedCategory);
            setAllProducts(res.data || []);
        } catch (err) {
            console.log(err);
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const allPages = Math.ceil((allProducts?.length || 0) / itemsPerPage) || 1;
        if(!allProducts) return
        const currentItems = (allProducts || []).slice(startIndex, endIndex);
        setTotalPages(allPages);
        setFiltered(currentItems);
    }, [allProducts, page]);


    useEffect(() => {
        fetchAll();
    }, [fetchAll]);


    const handleChangePage = (pageNumber) => {
        setPage(pageNumber)
    };

    const handleBack = () => navigate("/mixplus");
    const handleClick = (uuid) => navigate(`/productDetail/mixplus/${uuid}`);


    return (
       <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* back + title */}
      <BackLink variant="h6">
        <a onClick={handleBack}>{categoriesMap[category] || category} ← صفحه قبل</a>
      </BackLink>

      {/* product grid */}
      <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        {(loading ? Array.from({ length: 6 }) : filtered).map(
          (prod, idx) => (
            <Grid
              item
              key={idx}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ width: 150, }}
            >
              {loading ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    height={180}
                    animation="wave"
                  />
                  <Skeleton width="60%" sx={{ mt: 1 }} />
                </>
              ) : (
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      handleClick(prod.product_uuid)
                    }
                    sx={{ flexGrow: 1 }}
                  >
                    <CardMedia
                      component="img"
                      loading="lazy"
                      height={150}
                      image={`https://api.goldentower.ir/api/image/${prod.image}`}
                      alt={prod.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                      >
                        {prod.name} {prod.model}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )}
            </Grid>
          )
        )}
      </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }} >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => handleChangePage(value)}
            color='primary'
          />
        </Box>
    </Container>
    )
}