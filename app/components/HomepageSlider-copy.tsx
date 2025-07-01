"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/scss/navigation";

import hero2_img from "../../images/hero2_img.jpg";
import hero12_img from "../../images/1343.jpg";
import Image from "next/image";
import Link from "next/link";

function HomepageSlider() {
  return (
    <div className="h-[70vh] min-h-[550px] relative homepage-hero-slider">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 100,
          disableOnInteraction: false,
        }}
        navigation
        modules={[Autoplay, Navigation]}
        className="h-full"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="h-[70vh] min-h-[550px] flex flex-col justify-center relative">
            <Image
              src={hero12_img}
              alt=""
              className="absolute inset-0 w-full h-full z-10 object-cover lg:object-right object-top"
            />
            <span className="absolute inset-0 w-full h-full z-20 bg-black/40"></span>
            <div className="z-30 relative max-w-7xl w-full mx-auto flex items-center h-full">
              <div className="text-white p-3 rounded w-fit">
                <h3 className="text-5xl mb-2 font-semibold">
                  Lendora for business!
                </h3>
                <p className="text-base mb-5 max-w-lg">
                  Boost your business with Lendora! Get featured placement, your
                  own branded storefront, powerful analytics, and dedicated
                  support. Elevate your brand and streamline operations for
                  ultimate growth.
                </p>
                <Link
                  href="/signup?business=true"
                  className="px-10 py-4 block font-semibold hover:shadow-lg rounded bg-lendora-500 w-fit text-white"
                >
                  Get Started!
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="h-[70vh] min-h-[550px] flex flex-col justify-center relative">
            <Image
              src={hero2_img}
              alt=""
              className="absolute inset-0 w-full h-full z-10 object-cover object-left"
            />
            <span className="absolute inset-0 w-full h-full z-20 bg-black/40"></span>
            <div className="z-30 relative max-w-7xl w-full mx-auto flex items-center h-full">
              <div className="text-white p-3 rounded w-fit">
                <h3 className="text-5xl mb-2 font-semibold">
                  Make money renting on Lendora
                </h3>
                <p className="text-base mb-5">
                  Rent your items fast—millions of people are waiting.
                </p>
                <Link
                  href="/create"
                  className="px-10 py-4 font-semibold block hover:shadow-lg rounded bg-lendora-500 w-fit text-white"
                >
                  List for free
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default HomepageSlider;
