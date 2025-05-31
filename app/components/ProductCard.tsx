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
        className="w-full h-52 object-cover border border-0.5 border-zinc-100 rounded-md "
      />
      <div className="px-0 pb-1 mt-2">
        <h3 className="text-sm font-medium text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
          {product.name}{" "}
        </h3>
        <p className=" flex justify-between items-center">
          <span className=" font-semibold text-sm text-orange-400">
            {" "}
            ₦{product.offer_price.toLocaleString()}
          </span>
          <span className="flex items-center text-slate-500">
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
