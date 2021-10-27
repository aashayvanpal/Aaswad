// import 'bootstrap/dist/css/bootstrap.css';
import buffet1 from '../images/landing-page-images/buffet1.jpg'
import buffet2 from '../images/landing-page-images/buffet2.jpg'
import buffet3 from '../images/landing-page-images/buffet3.jpg'
import buffet4 from '../images/landing-page-images/buffet4.jpg'
import buffet5 from '../images/landing-page-images/buffet5.jpg'

import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const items = [
  {
    src: buffet1,
    altText: '',
    caption: ''
  },
  {
    src: buffet2,
    altText: '',
    caption: ''
  },

  {
    src: buffet3,
    altText: '',
    caption: ''
  },
  {
    src: buffet4,
    altText: '',
    caption: ''
  },
  {
    src: buffet5,
    altText: '',
    caption: ''
  }
];

const ShowCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} id="carosel-styling"/>
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

export default ShowCarousel;