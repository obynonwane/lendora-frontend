"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { IoLocation } from "react-icons/io5";
import ProductGallery from "./ProductGallery";
import { RiUserSmileFill } from "react-icons/ri";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function ProductPage({ product }: { product: Product }) {
  const similarProducts: Product[] = Array(12)
    .fill(product)
    .map((p, i) => ({
      ...p,
      id: i + 100,
      title: `${p.title} ${i + 1}`,
    }));

  return (
    <div className="max-w-7xl mx-auto p-3">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image + Info */}
        <div className="lg:col-span-2 bg-white p-3 rounded">
          {/* <img
            src="https://cdn.dribbble.com/userupload/14784546/file/still-f6768b0524bebb144d9b51aa25531b7a.png?format=webp&resize=400x300&vertical=center"
            // src={product.image}
            alt={product.title}
            className="w-full h-[400px] bg-gray-50 rounded"
          /> */}
          <ProductGallery
            images={[
              "https://cdn.dribbble.com/userupload/14784546/file/still-f6768b0524bebb144d9b51aa25531b7a.png?format=webp&resize=400x300&vertical=center",
              "https://a0.muscache.com/im/pictures/d0ca15e5-87bc-4912-bbc0-6c564e42afc7.jpg?im_w=1200",
              "https://a0.muscache.com/im/pictures/d0ca15e5-87bc-4912-bbc0-6c564e42afc7.jpg?im_w=1200",
              "https://a0.muscache.com/im/pictures/d0ca15e5-87bc-4912-bbc0-6c564e42afc7.jpg?im_w=1200",
            ]}
          />
          <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
          <p className="text-gray-700 mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
          {/* <p className="text-gray-700 mt-4">{product.description}</p> */}
        </div>

        {/* Right: Sticky Actions */}
        <div className="lg:col-span-1 ">
          <div className="sticky top-20  rounded  ">
            <div className="bg-white p-3 rounded">
              <p className=" flex justify-between items-center mt-3">
                <span className="text-3xl  font-bold text-[#FFAB4E]">
                  $19.99
                </span>
                <span className="flex items-center text-slate-500">
                  <IoLocation /> <span className="text-xs ">Lagos, Ikeja</span>
                </span>
              </p>
              <button
                className={`flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white mt-5 py-3 `}
              >
                ACTION
              </button>
              <button
                className={`flex w-full justify-center rounded font-semibold border border-orange-400 hover:bg-[#FFAB4E20]  hover:shadow-lg shadow text-orange-400 mt-3 py-3 `}
              >
                ACTION
              </button>

              <div className="flex mt-6 border-t pt-3 gap-2">
                <RiUserSmileFill className="text-slate-400 text-5xl" />
                <p className="text-slate-500 ">
                  <span className="font-semibold block text-slate-700 ">
                    User123
                  </span>
                  <span className="text-sm block">1y 1m on Lendora</span>
                </p>
              </div>
            </div>

            <div className=" bg-white p-3 rounded  mt-5">
              <button
                className={`flex w-full justify-center rounded font-semibold border border-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg hover:text-white text-sm shadow text-orange-400  py-2 `}
              >
                Post an Ad like this!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
        <div className="grid grid-cols-12  gap-4">
          {similarProducts.map((item) => (
            <ProductCard key={item.id} />
          ))}
        </div>

        <p className="text-center my-4 underline">Loading More Products!!!</p>
      </div>
    </div>
  );
}

export default ProductPage;
