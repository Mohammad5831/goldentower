import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";


const ImageSlider = ({ images = [], size = "", type = "", speed }) => {
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: speed || 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        appendDots: dots => (
            <div style={{ direction: "rtl" }}>
                <ul style={{ margin: "0px" }}>{dots}</ul>
            </div>
        ),
    };

    return (
        <Box sx={{ maxWidth: "90%", height: size || 400, margin: "auto", mt: 4, mb: 10, bgcolor: "red" }}>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <Card key={index} sx={{ borderRadius: 0, overflow: "hidden" }}>
                        <CardMedia
                            component="img"
                            image={type || img}
                            alt={`slide-${index}`}
                            sx={{ height: size || 500, objectFit: "cover" }}
                        />
                    </Card>
                ))}
            </Slider>
        </Box>
    )
};

export default ImageSlider;
