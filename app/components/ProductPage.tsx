"use client";
import React, { useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductGallery from "./ProductGallery";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { ProductPageProduct } from "@/app/types";
const PAGE_SIZE = 5;
import ProductPageSidebar from "@/app/components/ProductPageSidebar";
// export interface ProductPageProduct {
//   inventory: InventoryItem;
//   user: {
//     id: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     phone: string;
//     verified: boolean;
//     created_at_human: string;
//     updated_at_human: string;
//   };
//   category: {
//     id: string;
//     name: string;
//     description: string;
//     icon_class: string;
//     category_slug: string;
//   };
//   subcategory: {
//     id: string;
//     name: string;
//     description: string;
//     icon_class: string;
//     subcategory_slug: string;
//   };
//   images: {
//     id: string;
//     live_url: string;
//     local_url: string;
//     inventory_id: string;
//     created_at: {
//       seconds: number;
//     };
//     updated_at: {
//       seconds: number;
//     };
//   }[];
// }

function ProductPage({ product }: { product: ProductPageProduct }) {
  const restructureProductImages = () => {
    const store = [
      {
        id: "1",
        inventory_id: "s",
        live_url: product.inventory.primary_image,
        local_url: "",
        created_at: { seconds: 1234 },
        updated_at: { seconds: 134 },
      },
      ...product.images,
    ];
    return store;
  };

  console.log(product);

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

  console.log(product);
  return (
    <div className="max-w-7xl mx-auto p-3">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image + Info */}
        <div className="lg:col-span-2 bg-white   lg:pt-3 rounded">
          {/* <img
            src="https://cdn.dribbble.com/userupload/14784546/file/still-f6768b0524bebb144d9b51aa25531b7a.png?format=webp&resize=400x300&vertical=center"
            // src={product.image}
            alt={product.title}
            className="w-full h-[400px] bg-gray-50 rounded"
          /> */}

          <ProductGallery images={restructureProductImages()} />
          <p className="flex text-sm text-lendora-500 mt-6 gap-x-1">
            <Link
              className="hover:text-lendora-600"
              href={`/categories/${product.category.category_slug}`}
            >
              {" "}
              {product.category.name}
            </Link>{" "}
            &gt;
            <Link
              className="hover:text-lendora-600"
              href={`/categories/${product.category.category_slug}?subcategory_id=${product.subcategory.subcategory_slug}`}
            >
              {product.subcategory.name}
            </Link>
          </p>
          <h1 className="text-2xl font-bold mt-2">{product.inventory.name}</h1>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap break-words">
            {product.inventory.description}
          </p>
          {/* <textarea
            name=""
            value={product.inventory.description}
            id=""
            className="w-full disabled h-fit"
          ></textarea> */}
          {/* <p className="text-gray-700 mt-4">{product.description}</p> */}
        </div>

        {/* Right: Sticky Actions */}
        <ProductPageSidebar product={product} />
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
