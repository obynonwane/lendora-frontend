"use client";
import CategoriesSidebar from "./CategoriesSidebar";
import { Category_TYPE } from "@/app/types";
import ProductCard from "./ProductCard";
import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
const PAGE_SIZE = 5;
function Category({ categoryData }: { categoryData: Category_TYPE }) {
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
  const searchParams = useSearchParams();
  // const query = searchParams.get("s") || "";
  // const stateId = searchParams.get("state_id") || "";
  // const lgaId = searchParams.get("lga_id") || "";
  const subcategory_id = searchParams.get("subcategory_id") || "";

  // const state = stateId === "undefined" ? null : stateId;
  // const lga = lgaId === "undefined" ? null : lgaId;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/search`,
      {
        // country_id: "d147b57a-e5b3-4a6a-a021-a3aa042e0888",
        // state_id: stateId,
        subcategory_slug: subcategory_id,
        category_slug: categoryData.category_slug,
        // lga_id: lgaId,
        // text: query,

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

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isReachingEnd, isLoadingMore, setSize]);

  return (
    <section className="bg-white w-full lg:pt-10 pt-5 flex flex-wrap max-w-7xl mx-auto px-3">
      <div className="w-full lg:mb-10 mb-5">
        <h3 className="text-xl font-semibold capitalize">
          Rent {subcategory_id ? subcategory_id : categoryData.name}
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
          veritatis architecto asperiores deserunt iure rerum repellendus,
          minima reprehenderit quidem quasi tempora obcaecati totam magnam vel
          adipisci nemo cupiditate odit velit!
        </p>
      </div>
      <div className="lg:w-[20%] w-full  lg:sticky z-30 lg:top-28 self-start">
        <CategoriesSidebar categoryData={categoryData} />
      </div>

      <div className="lg:w-[80%] w-full">
        <section className="bg-white w-full max-w-7xl mx-auto">
          {/* <div className="lg:w-[20%] w-full lg:pl-3 lg:sticky z-30 lg:top-20 self-start">
            </div> */}
          <div className="lgg:w-[80%] w-full  lg:pl-5 rounded  grid grid-cols-12 gap-x-5 gap-y-7">
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
                  {results.map((item, index) => (
                    <ProductCard product={item} key={index} />
                  ))}
                </>
              )}

              {/* Infinite Scroll Loader Trigger */}
              <div
                ref={loaderRef}
                className="h-10 my-3 flex justify-center items-center col-span-12"
              >
                {!isReachingEnd && isValidating && <p>Loading...</p>}
              </div>
            </>
          </div>
        </section>
      </div>
    </section>
  );
}

export default function CategoriesPage({
  categoryData,
}: {
  categoryData: Category_TYPE;
}) {
  return (
    <Suspense fallback={<div>Loading Category data...</div>}>
      <Category categoryData={categoryData} />
    </Suspense>
  );
}
