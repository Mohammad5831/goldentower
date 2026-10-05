import React from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';

//images
import slide1 from '../../assets/darakar/slide1.jpg';
import slide2 from '../../assets/darakar/slide2.jpg';
import slide3 from '../../assets/darakar/slide3.jpg';
import slide4 from '../../assets/darakar/slide4.jpg';
import slide5 from '../../assets/darakar/slide5.jpg';
import logo from '../../assets/darakar/darakarLogo.png';
import ImageSlider from '../../components/ImageSlider';

const sliderImages = [
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
];
const categories = [
  {name: 'آبرسانی تحت فشار', title: 'water-supply'},
  {name: 'فاضلاب شهری', title: 'urban-sewage'},
  {name: 'فاضلاب ساختمانی', title: 'building-sewage'},
  {name: 'استخری', title: 'pool-plumbing'},
];

export default function DarakarPage() {


  return (
    <>
      <Box>
        <CardMedia
          component="img"
          image={logo}
          alt={'Darakar Logo'}
          sx={{ mt: 5, width: 200, }}
        />
      </Box>
      <Box
        sx={{
          width: '90%',
          height: 1.1,
          backgroundColor: 'black',
          margin: 'auto',
          marginTop: 1
        }}
      />
      <ImageSlider images={sliderImages} size='180px' speed={400} />
        <Typography variant='h6' fontWeight='bold' sx={{margin: 3}}>محصولات داراکار :</Typography>
        <Box sx={{maxWidth: '85%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', }}>
          {
            categories.map((cat) => (
              <Box  sx={{width: 200, height: 200}}>
                {cat.name}
              </Box>
            ))
          }
        </Box>
    </>
  );
};