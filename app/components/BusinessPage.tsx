"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import ProductCard from "./ProductCard";
import Link from "next/link";
import PopupChatModal from "./PopupChatModal";

function BusinessPage() {
  const [searchQuery, setSearchQurey] = useState<string>();

  return (
    <main className="mb-10">
      <PopupChatModal />
      <section className=" h-56 aspect-video bg-zinc-900 w-full mb-12">
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
      </section>
      <section className="max-w-7xl p-3 mx-auto">
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
            <ProductCard
              key={item}
              product={{
                primary_image:
                  "https://res.cloudinary.com/dxec82vds/image/upload/v1749233120/rentalsolution/inventories/1749233120067832460.jpg", // fallback to first image
                category_slug: "home-living",
                id: "5d783f82-ee4d-4cc2-b165-aed29979f227",
                name: "ewewewewe wewewewe",
                description:
                  "ewewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwewewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwewewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwewewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
                user_id: "ccff97be-ed65-4562-a640-022e85615637",
                category_id: "ff3be795-41f4-44df-b4b5-b7b6ed1ae02b",
                subcategory_id: "8ae323cf-1977-433a-91bb-9a92fab31b99",
                created_at: {
                  seconds: 1749233121,
                  nanos: 103443000,
                },
                updated_at: {
                  seconds: 1749233121,
                  nanos: 103443000,
                },
                country_id: "e69646c4-a076-45bf-841c-c8e81eb3e03e",
                rental_duration: "daily",
                state_id: "b1f408a4-d264-4384-a28a-596f9fca67b7",
                lga_id: "cd2a8c0a-92d5-4b46-954c-ddac3773f0ed",
                country: {
                  id: "e69646c4-a076-45bf-841c-c8e81eb3e03e",
                  name: "Nigeria",
                },
                quantity: item,
                minimum_price: 0,
                security_deposit: 0,
                state: {
                  id: "b1f408a4-d264-4384-a28a-596f9fca67b7",
                  name: "Abia",
                },
                lga: {
                  id: "cd2a8c0a-92d5-4b46-954c-ddac3773f0ed",
                  name: "Aba South",
                },
                is_available: "yes",
                negotiable: "no",
                product_purpose: "rental",
                images: [
                  {
                    id: "2b55b360-c0ea-42e5-a0cd-c8b974c2e27d",
                    live_url:
                      "https://res.cloudinary.com/dxec82vds/image/upload/v1749233120/rentalsolution/inventories/1749233120067832460.jpg",
                    local_url:
                      "https://res.cloudinary.com/dxec82vds/image/upload/v1749233120/rentalsolution/inventories/1749233120067832460.jpg",
                    inventory_id: "5d783f82-ee4d-4cc2-b165-aed29979f227",
                    created_at: {
                      seconds: 1749233121,
                      nanos: 103443000,
                    },
                    updated_at: {
                      seconds: 1749233121,
                      nanos: 103443000,
                    },
                  },
                  {
                    id: "633e0271-39e2-4432-8031-3600b54ab329",
                    live_url:
                      "https://res.cloudinary.com/dxec82vds/image/upload/v1749233120/rentalsolution/inventories/1749233120067826472.jpg",
                    local_url:
                      "https://res.cloudinary.com/dxec82vds/image/upload/v1749233120/rentalsolution/inventories/1749233120067826472.jpg",
                    inventory_id: "5d783f82-ee4d-4cc2-b165-aed29979f227",
                    created_at: {
                      seconds: 1749233121,
                      nanos: 103443000,
                    },
                    updated_at: {
                      seconds: 1749233121,
                      nanos: 103443000,
                    },
                  },
                ],
                user: {
                  id: "ccff97be-ed65-4562-a640-022e85615637",
                  email: "chibuikennaji306+22@gmail.com",
                  first_name: "Nnaji",
                  last_name: "Chibuike",
                  phone: "07080961583",
                },
                created_at_human: "2025-06-06 18:05:21",
                updated_at_human: "2025-06-06 18:05:21",
                offer_price: "10000",
                slug: "ewewewewe-wewewewe-01JX36PDVXG0HK95M6399E533K",
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default BusinessPage;
