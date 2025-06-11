"use client";
import React, { useState, useMemo } from "react";

type ProductImage = {
  id: string;
  live_url: string;
  local_url: string;
  inventory_id: string;
  created_at: {
    seconds: number;
  };
  updated_at: {
    seconds: number;
  };
};

interface ProductGalleryProps {
  images: ProductImage[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive the currently active image for clearer rendering
  const activeImage = useMemo(() => {
    return images[activeIndex];
  }, [activeIndex, images]);

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No images available.
      </div>
    );
  }

  return (
    <div className="lg:flex flex-row-reverse gap-3">
      {/* Main Image Area */}
      <a
        href={activeImage.live_url}
        target="_blank"
        className="relative flex-1 aspect-square cursor-zoom-in shadow bg-gray-100 overflow-hidden mb-4 rounded"
      >
        {activeImage && (
          <img
            src={activeImage.live_url}
            alt={`Product Image ${activeIndex + 1}`}
            className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
          />
        )}
      </a>

      {/* Thumbnails */}
      <div className="flex lg:flex-col relative flex-nowrap lg:mt-0 mt-3  gap-3 lg:overflow-y-auto lg:overflow-x-hidden overflow-x-auto ">
        {images.map((img, idx) => (
          <button
            key={img.id} // Use a unique ID for the key if available, otherwise fall back to idx
            onClick={() => setActiveIndex(idx)}
            className={`border rounded  lg:w-full w-20 h-20 overflow-hidden shrink-0 ${
              activeIndex === idx
                ? "border-orange-400"
                : "border-transparent hover:border-gray-300"
            }`}
            aria-label={`View image ${idx + 1}`} // Added for accessibility
          >
            <img
              src={img.live_url}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
