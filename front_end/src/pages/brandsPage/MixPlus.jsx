import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CardMedia, Typography } from '@mui/material';
import ImageSlider from '../../components/ImageSlider';


//images
import min1 from "../../assets/mixPlus/min1.jpg";
import min2 from "../../assets/mixPlus/min2.jpg";
import min3 from "../../assets/mixPlus/min3.png";

//icons
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import logoHood from '../../assets/mixPlus/logoHood.svg';
import logosink from '../../assets/mixPlus/logoSink.svg';
import logoGaz from '../../assets/mixPlus/logoGaz.svg';
import logoFer from '../../assets/mixPlus/logoFer.svg';

const images = [
    min1,
    min2
];

const categories = [
    { name: 'فر', title: 'fer', color: '#291e1eff', icon: logoFer },
    { name: 'سینک', title: 'sink', color: '#333333ff', icon: logosink },
    { name: 'اجاق گاز', title: 'gaz', color: '#444444ff', icon: logoGaz },
    { name: 'هود', title: 'hood', color: '#5c5c5cff', icon: logoHood },
];

export default function MixPlus() {
    const navigate = useNavigate()

    const handlecategoriesClick = useCallback(
        (title) => navigate(`/products/mixplus/${title}`),
        [navigate]
    )

    return (
        <>
            <ImageSlider images={images} size='500px'/>
            <Box sx={{ marginTop: 10 }}>
                {categories.map(c => (
                    <Box key={c.name}
                        onClick={() => handlecategoriesClick(c.title)}
                        sx={{ width: "90%", height: 70, margin: 'auto', backgroundColor: c.color, color: 'white', paddingLeft: 3, display: 'flex', alignItems: 'center' }}
                    >
                        <NavigateBeforeIcon fontSize='large' sx={{ border: '1px solid white', borderRadius: 3, marginRight: 2 }} />
                        <Typography variant='h4' >{c.name}</Typography>
                    </Box>
                ))
                }
            </Box>
            <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h4' textAlign='center' sx={{ width: 250 }}>
                    برند جدید کوروش صنعت آذین
                </Typography>
                <Typography variant='body1' mt={3} mb={5} sx={{ width: 350 }}>
                    در راستای توسعه‌ی بازار بعنوان یکی از عوامل کلیدی و تاثیرگذار، خلاقیت و تولید محصولات در سطح بالا شرکت کوروش صنعت آذین بابیش از 40 سال سابقه در صنعت لوازم خانگی آشپزخانه برآن است، با برند جدید MIXPLUS فعالیت خود را از سر گرفته، تا بتواند با ارزیابی و تحلیل بازار، نیاز مصرف کننده نهایی را شناسایی و با همراهی شما عزیزان آنرا اجرا و پیاده سازی نماید.
                </Typography>
                <CardMedia
                    component="img"
                    image={min3}
                    alt={'40 سال تجربه'}
                    sx={{ width: 350, marginBottom: 10 }}
                />
            </Box>
            <Box sx={{ backgroundColor: 'black', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', position: 'sticky', bottom: 0}}>
                {
                    categories.map(c => (
                        <Box onClick={() => handlecategoriesClick(c.title)}>
                            <CardMedia
                                component="img"
                                image={c.icon}
                                alt={`${c.name}`}
                                sx={{ height: 40, mt: 2 }}
                            />
                            <Typography variant='body1' textAlign='center' sx={{ color: 'white', height: 40, mt: 1 }}>
                                {c.name}
                            </Typography>
                        </Box>
                    ))
                }
            </Box>
        </>
    );
};