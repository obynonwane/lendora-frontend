"use client";
import React, { useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import { IoLocation } from "react-icons/io5";
import ProductGallery from "./ProductGallery";
import { RiUserSmileFill } from "react-icons/ri";
import useSWRInfinite from "swr/infinite";
const PAGE_SIZE = 5;

export interface InventoryUserResponse {
  inventory: {
    id: string;
    name: string;
    description: string;
    user_id: string;
    category_id: string;
    subcategory_id: string;
    created_at_human: string;
    updated_at_human: string;
  };
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    verified: boolean;
    created_at_human: string;
    updated_at_human: string;
  };
  images: {
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
  }[];
}

function ProductPage({ product }: { product: InventoryUserResponse }) {
  // const similarProducts: Product[] = Array(12)
  //   .fill(product)
  //   .map((p, i) => ({
  //     ...p,
  //     id: i + 100,
  //     title: `${p.title} ${i + 1}`,
  //   }));

  const fetcher = async ([url, body]: [string, unknown]) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const json = await res.json();
    return json.data.inventories;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/search`,
      {
        // country_id: "d147b57a-e5b3-4a6a-a021-a3aa042e0888",
        state_id: "",
        lga_id: "",
        text: "",
        category_id: product.inventory.category_id,
        subcategory_id: product.inventory.subcategory_id,
        limit: PAGE_SIZE.toString(),
        offset: (pageIndex * PAGE_SIZE).toString(),
      },
    ];
  };

  const { data, size, setSize, isLoading, isValidating, error } =
    useSWRInfinite(getKey, fetcher);

  const results = data ? data.flat() : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isReachingEnd || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSize((prev) => prev + 1);
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isReachingEnd, isLoadingMore, setSize]);

  // console.log(product.data);
  return (
    <div className="max-w-7xl mx-auto p-3">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image + Info */}
        <div className="lg:col-span-2 bg-white  border p-3 rounded">
          {/* <img
            src="https://cdn.dribbble.com/userupload/14784546/file/still-f6768b0524bebb144d9b51aa25531b7a.png?format=webp&resize=400x300&vertical=center"
            // src={product.image}
            alt={product.title}
            className="w-full h-[400px] bg-gray-50 rounded"
          /> */}

          <ProductGallery images={product.images} />
          <h1 className="text-2xl font-bold mt-4">{product.inventory.name}</h1>
          <p className="text-gray-700 mt-2">{product.inventory.description}</p>
          {/* <p className="text-gray-700 mt-4">{product.description}</p> */}
        </div>

        {/* Right: Sticky Actions */}
        <div className="lg:col-span-1 ">
          <div className="sticky top-20  rounded  ">
            <div className="bg-white p-3 rounded border ">
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
                    {product.user.first_name + " " + product.user.last_name}
                  </span>
                  <span className="text-sm block">1y 1m on Lendora</span>
                </p>
              </div>
            </div>

            <div className=" bg-white p-3 rounded  mt-5 border">
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
          {/* {similarProducts.map((item) => (
            <ProductCard key={item.id} />
          ))} */}
          <>
            {error && (
              <p className="text-red-500 col-span-12">
                Failed to load results.
              </p>
            )}

            {results.length === 0 && !isLoading ? (
              <p className="col-span-12">No results found.</p>
            ) : (
              <>
                {results.map((item) =>
                  item.id === product.inventory.id ? null : (
                    <ProductCard product={item} key={item.id} />
                  )
                )}
              </>
            )}

            {/* Infinite Scroll Loader Trigger */}
            <div
              ref={loaderRef}
              className="h-10 my-3 flex justify-center items-center col-span-12"
            >
              {!isReachingEnd && isValidating && <p>Loading...</p>}
            </div>
          </>{" "}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
