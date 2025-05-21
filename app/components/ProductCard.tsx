import Link from "next/link";
import React from "react";
import { IoLocation } from "react-icons/io5";

function ProductCard() {
  return (
    <Link
      href="/product/123456789"
      className="rounded col-span-6 md:col-span-3 overflow-hidden  bg-white"
    >
      <img
        src="https://cdn.dribbble.com/userupload/14784546/file/still-f6768b0524bebb144d9b51aa25531b7a.png?format=webp&resize=400x300&vertical=center"
        alt="Product"
        className="w-full h-48 object-cover border rounded-md shadow"
      />
      <div className="px-2 pb-1 mt-2">
        <h3 className="text-sm font-medium text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
          Zealot S38 Bass Wireless Speaker - really cool one
        </h3>

        {/* <p className="text-gray-600 text-xs">
          Sound: 3D heavy bass. Power: 38W high power output. Battery: 3600mAh
          battery with up to 60 hours of...
        </p> */}

        <p className=" flex justify-between items-center">
          <span className="text-lg font-bold text-orange-400">$19.99</span>
          <span className="flex items-center text-slate-500">
            <IoLocation /> <span className="text-xs ">Lagos, Ikeja</span>
          </span>
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
