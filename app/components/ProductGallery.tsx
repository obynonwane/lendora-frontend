"use client";
import React, { useState } from "react";
// import "./ProductGallery.css";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Main Image Area */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 overflow-hidden mb-4 rounded">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`gallery-slide  ${idx === activeIndex ? "active" : ""} `}
          >
            <img
              src={img}
              alt={`Image ${idx}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto flex-nowrap">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`border rounded min-w-20 w-20 h-20   overflow-hidden   ${
              activeIndex === idx
                ? "border-orange-400 "
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumb ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
