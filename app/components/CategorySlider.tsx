"use client";
// import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import axios from "axios";
import { Category_TYPE } from "../types";
// import { Category_TYPE, SubCategory_TYPE } from "../types";
// import Link from "next/link";
import { useRouter } from "next/navigation";
// import buildFilteredQueryString from "../utils/buildFilteredQueryString";
// import { usePathname } from "next/navigation";
import { localCategories } from "../categories";

function CategorySlider() {
  const router = useRouter();

  const categories: Category_TYPE[] = localCategories;

  return (
    <section className="w-full text-sm rounded bg-white mb-10  relative px-3 ">
      <h3 className="text-xl text-slate-900 mb-3 lg:pl-0 pl-3">Categories</h3>
      {/* modal to select sub category for mobile */}

      <div>
        <Carousel
          additionalTransfrom={0}
          arrows={false}
          autoPlaySpeed={3000}
          centerMode={false}
          className="flex gap-10 min-h-[176px] bg-slate-100"
          containerClass="container-with-dots min-h-[176px] bg-white "
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass="mr-2"
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover={true}
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 5,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 2,
              partialVisibilityGutter: 100,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={true}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          autoPlay={true}
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {categories?.map((category) => (
            <div
              onClick={() =>
                router.push(`/categories/${category.category_slug}`)
              }
              key={category.id + category.name}
              className={`flex flex-col   items-center gap-2    group cursor-pointer   rounded`}
              // onClick={() => {
              //   console.log(category);
              //   //   setHovered(category);
              //   // set selected category for mobile
              //   setSelectedCategoryForMobile(category);
              //   // open modal
              //   fetchSubcategories(category?.id);
              //   setIsShowMobleCategorySelectModal(true);
              // }}
            >
              <span className="w-full h-32 flex-shrink-0 flex items-center justify-center bg-orange-50 rounded">
                <i
                  className={`${category.icon_class} group-hover:animate-bounce  text-3xl text-orange-400`}
                ></i>
              </span>{" "}
              <span className="text-center  text-sm">
                {/* <span className="lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis"> */}
                {category.name}{" "}
              </span>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default CategorySlider;
