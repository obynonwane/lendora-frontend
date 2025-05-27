import Link from "next/link";
import React from "react";
import { IoLocation } from "react-icons/io5";
import { InventoryItem } from "../types";

function ProductCard({ product }: { product: InventoryItem }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="rounded col-span-6 md:col-span-3 overflow-hidden  bg-white"
    >
      <img
        src={product?.images[0].live_url}
        alt="Product"
        className="w-full h-48 object-cover border border-0.5 border-zinc-100 rounded-md "
      />
      <div className="px-0 pb-1 mt-2">
        <h3 className="text-sm font-medium text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
          {product.name}{" "}
        </h3>
        <p className=" flex justify-between items-center">
          <span className="text-lg font-bold text-orange-400">$19.99</span>
          <span className="flex items-center text-slate-500">
            <IoLocation />{" "}
            <span className="text-xs ">
              {product.state.name}, {product.lga.name}
            </span>
          </span>
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
