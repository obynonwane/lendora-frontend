"use client";

import React from "react";

import "swiper/css";
import "swiper/css/autoplay";

import Link from "next/link";
import { Category_TYPE } from "../types";
import { localCategories } from "../categories";

function CategorySlider() {
  const categories: Category_TYPE[] = localCategories;

  return (
    <section className="w-full text-sm rounded bg-white mb-10 relative px-3 md:max-w-7xl md:mx-auto mt-10">
      <h3 className="text-xl text-slate-900 mb-3 lg:pl-0 pl-3">Categories</h3>

      <div className="min-h-[176px] bg-white w-full overflow-x-auto flex gap-5">
        {categories?.map((category) => {
          return (
            <div key={category.id + category.name}>
              <Link
                href={`/categories/${category.category_slug}`}
                className="flex flex-col items-center gap-2  group cursor-pointer rounded"
              >
                <span className="w-48 h-32 flex-shrink-0 flex items-center justify-center bg-zinc-100 rounded">
                  <i
                    className={`${category.icon_class} group-hover:animate-bounce text-3xl text-lendora-300`}
                  ></i>
                </span>
                <span className="text-center group-hover:text-lendora-500 font-medium text-sm">
                  {category.name}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CategorySlider;
