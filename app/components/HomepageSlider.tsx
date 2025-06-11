import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import hero1_img from "../../images/hero1_img.jpg";
import hero2_img from "../../images/hero2_img.jpg";
import hero12_img from "../../images/1343.jpg";
import Image from "next/image";
import Link from "next/link";
function HomepageSlider() {
  return (
    <>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={10000}
        centerMode={false}
        className="h-[70vh] min-h-[550px] bg-slate-100 homepage-hero-slider"
        containerClass="container-with-dots h-[70vh] min-h-[550px] bg-slate-100"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        autoPlay={true}
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
            partialVisibilityGutter: 30,
          },
        }}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {/* <div className="lg:h-full max-w-7xl mx-auto  flex flex-wrap pt-5  p-3">
          <div className="lg:w-1/2 w-full flex-col justify-center flex h-full lg:order-0 order-1">
            <span className="text-sm  mb-2 bg-orange-100 w-fit rounded flex items-center justify-center text-orange-400 px-2 py-1 eounded-full">
              ✨ Lendora for business!
            </span>
            <h3 className="text-4xl mb-2 font-semibold">
              Lendora for business!
            </h3>
            <p className="text-base mb-5 ">
              Boost your business with Lendora! Get featured placement, your own
              branded storefront, powerful analytics, and dedicated support.
              Elevate your brand and streamline operations for ultimate growth.
            </p>
            <Link
              href="/signup?business=true"
              className="px-10 py-3 rounded bg-orange-400 w-fit text-white"
            >
              Get Started
            </Link>
          </div>
          <div className="lg:w-1/2 w-full  flex-col justify-center flex  lg:order-1 order-0 ">
            <Image src={hero1_img} alt="" className="lg:h-full h-[300px]" />
          </div>
        </div> */}
        <div className="h-[70vh] min-h-[550px] flex flex-col justify-center">
          <Image
            src={hero12_img}
            alt=""
            className="absolute inset-0 w-full h-full z-10 object-cover lg:object-right object-top"
          />
          <span className="absolute inset-0 w-full h-full z-20 object-cover bg-black/40"></span>

          <div className="z-30 relative max-w-7xl w-full mx-auto flex items-center h-full">
            <div className=" text-white  p-3 rounded w-fit">
              {/* <span className="text-sm  mb-2 bg-orange-100 w-fit rounded flex items-center justify-center text-orange-400 px-2 py-1 eounded-full">
                ✨ Lendora for business!
              </span> */}
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
                className="px-10 py-4 block  font-semibold hover:shadow-lg rounded bg-orange-400 w-fit text-white"
              >
                Get Started!
              </Link>
            </div>
          </div>
        </div>
        <div className="h-[70vh] min-h-[550px] flex flex-col justify-center">
          <Image
            src={hero2_img}
            alt=""
            className="absolute inset-0 w-full h-full z-10 object-cover object-left"
          />
          <span className="absolute inset-0 w-full h-full z-20 object-cover bg-black/40"></span>

          <div className="z-30 relative max-w-7xl w-full mx-auto flex items-center h-full">
            <div className=" text-white  p-3 rounded w-fit">
              <h3 className="text-5xl mb-2 font-semibold">
                Make money renting on Lendora
              </h3>
              <p className="text-base mb-5 ">
                Rent your items fast—millions of people are waiting.
              </p>
              <Link
                href="/create"
                className="px-10 py-4 font-semibold  block hover:shadow-lg rounded bg-orange-400 w-fit text-white"
              >
                List for free
              </Link>
            </div>
          </div>
        </div>
      </Carousel>
    </>
  );
}

export default HomepageSlider;
