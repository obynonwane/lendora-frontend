"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import img1 from "@/images/8983.jpg";
import Image from "next/image";

function Page() {
  const [searchQuery, setSearchQurey] = useState<string>();

  return (
    <main className="my-10">
      {/* <section className=" h-56 aspect-video bg-zinc-900 w-full mb-12">
        <section className="max-w-7xl p-3 flex h-full mx-auto relative items-center justify-center ">
          <h1 className="text-white lg:text-3xl text-2xl font-semibold">
            ABC STORE
          </h1>
          <div className="size-32 bg-gradient-to-r from-lendora-500 rounded-full absolute left-3 -bottom-10 bg-red-100 "></div>

          <Link
            href={"/lendora-for-business"}
            className="absolute right-3 bottom-2 hover:text-white/70 text-white/50 text-sm"
          >
            Powered by Lendora
          </Link>
        </section>
      </section> */}
      <section className="max-w-7xl p-3 mx-auto">
        <h1 className="text-center text-2xl font-medium pt-8  mb-3">
          Businesses on Lendora!
        </h1>
        <div className="flex items-center h-12 border overflow-hidden rounded  justify-center   lg:max-w-lg w-full mx-auto">
          <input
            className="h-ful px-4  w-full py-3  border-none outline-none"
            type="text"
            // ref={inputRef}
            placeholder="Press Enter to search..."
            // placeholder="I am looking to rent..."
            value={searchQuery}
            onChange={(e) => setSearchQurey(e.target.value)}
          />

          <button
            // onClick={handleSearch}
            className=" items-center px-3 block    h-full bg-lendora-500 text-white "
          >
            <IoSearch />{" "}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-x-5 gap-y-7 mt-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <Link
              key={item}
              href={`/businesses/${item}`}
              className="rounded col-span-12 md:col-span-6 lg:col-span-4 overflow-hidden aspect-video relative  bg-white"
            >
              {/* <div className="aspect-square relative w-full overflow-hidden shadow"> */}
              {/* <img
                  src={img1}
                  alt="Product"
                  // className="object-cover  h-full w-full rounded-md product-card-image"
                  className="w-full h-full max-w-full absolute object-cover  border-zinc-100 rounded-md "
                /> */}
              <Image
                src={img1}
                alt=""
                className="absolute  inset-0 w-full h-full z-10 object-cover lg:object-right object-top"
              />
              <div
                className="z-20 overflow-hidden rounded group flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black to-transparent
 p-2 text-white"
              >
                <span className="font-light w-fit px-2 text-sm absolute top-2 right-2 bg-black/60  border rounded-full group-hover:border group-hover:border-lendora-500   shadow text-white">
                  Fashion
                </span>
                <h3 className="text-lg font-medium group-hover:text-lendora-500 transition-all ease-in-out ">
                  Cool Store
                </h3>
                <p className="text-white/90 font-light">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Recusandae ut officiis quibusdam earum quas
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Page;
