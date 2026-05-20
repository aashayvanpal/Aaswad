import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import buffet1 from '../images/landing-page-images/buffet1.jpg'
import buffet2 from '../images/landing-page-images/buffet2.jpg'
import buffet3 from '../images/landing-page-images/buffet3.jpg'
import buffet4 from '../images/landing-page-images/buffet4.jpg'
import buffet5 from '../images/landing-page-images/buffet5.jpg'

const images = [buffet1, buffet2, buffet3, buffet4, buffet5];

const ShowCarousel = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img src={src} alt={`buffet-${i + 1}`} id="carosel-styling" style={{ width: '100%', display: 'block' }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ShowCarousel;
