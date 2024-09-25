import React from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";



import { Pagination, Navigation, Autoplay, EffectCards } from "swiper";

import img1 from '../assets/Nfts/floresta.jpg';
import img2 from '../assets/Nfts/floresta-1.jpg';
import img3 from '../assets/Nfts/floresta-2.jpg';
import img4 from '../assets/Nfts/floresta-3.jpg';
import img5 from '../assets/Nfts/floresta-4.jpg';
import img6 from '../assets/Nfts/floresta-5.jpg';
import img7 from '../assets/Nfts/floresta-6.jpg';
import img8 from '../assets/Nfts/floresta-7.jpg';
import img9 from '../assets/Nfts/floresta-8.jpg';
import img10 from '../assets/Nfts/floresta-9.jpg';
import img11 from '../assets/Nfts/floresta-10.jpg';
import img12 from '../assets/Nfts/floresta-11.jpg';
import img13 from '../assets/Nfts/floresta-12.jpg';
import img14 from '../assets/Nfts/floresta-13.jpg';


import Arrow from '../assets/Arrow.svg';



const Container = styled.div`
width: 25vw;
height: 70vh;

@media (max-width: 70em){
    height: 60vh;
}

@media (max-width: 64em){
    height: 50vh;
    width: 30vw;
}
@media (max-width: 48em){
    height: 50vh;
    width: 40vw;
}
@media (max-width: 30em){
    height: 45vh;
    width: 60vw;
}

.swiper{
    width: 100%;
    height: 100%;
}

.swiper-slide{
    background-color: ${props => props.theme.carouselColor};

    border-radius: 4px; 

    display: flex;
    justify-content: center;
    align-items: center;

    img{
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
    }
}

.swiper-button-next{
    color: ${props => props.theme.text};
    right: 0;
    width: 4rem;
    top: 60%;
    
    background-image: url(${Arrow});
    background-position: center;
    background-size: cover;

    &:after{
        display: none;
    }

    @media (max-width: 64em){
    width: 3rem;

    }
    @media (max-width: 30em){
    width: 2rem;

    }
}
.swiper-button-prev{
    color: ${props => props.theme.text};
    left: 0;
    top: 60%;
    width: 4rem;
    transform: rotate(180deg);
    background-image: url(${Arrow});
    background-position: center;
    background-size: cover;

    &:after{
        display: none;
    }
    @media (max-width: 64em){
    width: 3rem;

    }
    @media (max-width: 30em){
    width: 2rem;

    }


}

`

const Carousel = () => {
  return (
    <Container>
        <Swiper
        autoplay={{
            delay:2000,
            disableOnInteraction:false,
        }}
        pagination={{
            type:'fraction',
        }}
        scrollbar={{
            draggable:true
        }}
        modules={[EffectCards,Pagination, Navigation, Autoplay]}
        navigation={true}
        effect={"cards"}
        grabCursor={true}
        
        className="mySwiper"
      >
        <SwiperSlide>  <img width={400} height={500}  src={img1} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img2} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img3} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img4} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img5} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img6} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img7} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img8} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img9} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img10} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img11} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img12} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img13} alt="smart co2" />   </SwiperSlide>
        <SwiperSlide>  <img width={400} height={500}  src={img14} alt="smart co2" />   </SwiperSlide>

      </Swiper>
    </Container>
  )
}

export default Carousel