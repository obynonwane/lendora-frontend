import Link from "next/link";
import React from "react";
import { IoLocation } from "react-icons/io5";
import { InventoryItem } from "../types";
import { structureRentalDuration } from "@/app/utils/structureRentalDuration";

function ProductCard({ product }: { product: InventoryItem }) {
  // console.log(product.category_slug.split("-").concat());
  return (
    <Link
      href={`/product/${product.slug}`}
      className="rounded col-span-6 md:col-span-3 overflow-hidden   bg-white"
    >
      {/* <div className="aspect-square relative w-full overflow-hidden shadow"> */}
      <div className="aspect-square relative lg:max-h-[250px] product-card-image-container w-full overflow-hidden shadow">
        <img
          src={product?.primary_image}
          alt="Product"
          className="object-cover  h-full w-full rounded-md product-card-image"
          // className="w-full h-full max-w-full absolute object-cover  border-zinc-100 rounded-md "
        />
        <div className="text-xs  capitalize absolute bottom-0 left-0 right-0 overflow-hidden flex flex-wrap items-center gap-1  p-2">
          <span className="lg:py-1 px-2 rounded-full border-lendora-500 border shadow bg-white">
            {product.product_purpose}
          </span>{" "}
          {product.negotiable === "yes" && (
            <span className="lg:py-1 px-2 rounded-full border-lendora-500 border shadow bg-white">
              Negotiable
            </span>
          )}
        </div>
      </div>
      <div className="px-0 pb-1 mt-2">
        <p>
          <span className=" font-semibold text-sm text-lendora-500">
            {" "}
            {/* {product.category_slug.split("-").map((cs)=>{
              <span>
              
              </span>
            })} */}
          </span>
        </p>
        <h3 className="text-sm font-medium text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
          {product.name}{" "}
        </h3>
        <p className=" flex flex-wrap items-center">
          <span className=" font-semibold text-sm text-lendora-500">
            {" "}
            ₦{product.offer_price.toLocaleString()}
          </span>
          {product.product_purpose === "rental" && (
            <span className=" text-xs mr-5">
              /{structureRentalDuration(product.rental_duration)}
            </span>
          )}

          <span className="flex md:ml-auto items-center text-slate-500">
            <IoLocation className="text-xs" />{" "}
            <span className="text-xs text-nowrap">
              {product.state.name}, {product.lga.name}
            </span>
          </span>
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
