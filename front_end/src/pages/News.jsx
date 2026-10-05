import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Pagination 
} from '@mui/material';

const News = () => {
  const [activeFilter, setActiveFilter] = useState('همه');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filterTabs = ['همه', 'اخبار', 'رویدادها', 'پروژه‌ها'];

  const allPosts = [
    { 
      id: 1, 
      title: 'سفر روسیه برج طلایی', 
      excerpt: 'همراهی تیم اقتصادی خراسان رضوی به همراه استاندار محترم خراسان رضوی...', 
      category: 'رویدادها', 
      author: 'مدیریت برج طلایی', 
      views: 245, 
      img: './russia.jpg', 
      featured: true 
    },
    // ... other posts
  ];

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesFilter = activeFilter === 'همه' || post.category === activeFilter;
      return matchesFilter;
    });
  }, [activeFilter]);

  const featuredPost = allPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const totalPages = Math.ceil(regularPosts.length / postsPerPage);
  const currentPosts = regularPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 4, bgcolor: '#2a2a2a', borderRadius: '20px', p: 4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
          <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 2 }}>
            اخبار و رویدادها
          </Typography>
          <Typography sx={{ color: '#ccc', maxWidth: 600, margin: '0 auto' }}>
            آخرین اخبار، رویدادها و مطالب آموزشی برج طلایی را دنبال کنید
          </Typography>
        </Box>

        {/* Filter Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {filterTabs.map((filter, index) => (
            <Button
              key={index}
              onClick={() => handleFilterChange(filter)}
              sx={{
                bgcolor: activeFilter === filter ? '#d4af37' : '#333',
                color: activeFilter === filter ? '#1a1a1a' : '#f5f5dc',
                borderRadius: '25px',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#d4af37',
                  color: '#1a1a1a',
                },
              }}
            >
              {filter}
            </Button>
          ))}
        </Box>

        {/* Featured Post */}
        {featuredPost && activeFilter === 'همه' && (
          <Card sx={{ bgcolor: '#2a2a2a', borderRadius: '20px', overflow: 'hidden', mb: 4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', border: '2px solid #d4af37' }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  image={featuredPost.img}
                  alt={featuredPost.title}
                  sx={{ height: { xs: 300, md: 400 }, width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography sx={{ bgcolor: '#d4af37', color: '#1a1a1a', padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', width: 'fit-content', mb: 2 }}>
                  مطلب ویژه
                </Typography>
                <Typography variant="h5" sx={{ color: '#f5f5dc', fontWeight: 'bold', mb: 2 }}>
                  {featuredPost.title}
                </Typography>
                <Typography sx={{ color: '#ccc', mb: 3 }}>
                  {featuredPost.excerpt}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Blog Grid */}
        <Grid container spacing={3}>
          {currentPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ 
                bgcolor: '#2a2a2a', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', 
                transition: 'all 0.3s ease', 
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                },
                height: '100%' 
              }}>
                <img
                  // component="img"
                  src={post.img}
                  alt={post.title}
                  sx={{ height: 250 }}
                />
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ color: '#f5f5dc', fontWeight: 'bold', mb: 2 }}>
                    {post.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, fontSize: '12px', color: '#888' }}>
                    <Typography>{post.author}</Typography>
                    <Typography><i className="fas fa-eye"></i> {post.views}</Typography>
                  </Box>
                  <Typography sx={{ color: '#ccc', mb: 3 }}>
                    {post.excerpt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            sx={{ mt: 4, display: 'flex', justifyContent: 'center', '& .MuiPaginationItem-root': { color: '#f5f5dc' }, '& .Mui-selected': { bgcolor: '#d4af37', color: '#1a1a1a' } }}
          />
        )}
      </Container>
    </Box>
  );
};

export default News;