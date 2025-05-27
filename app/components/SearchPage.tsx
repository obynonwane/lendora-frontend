"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
// import CategoryList from "./CategoryList";
import HomepageHero from "./HomepageHero";
import ProductCard from "./ProductCard";
const PAGE_SIZE = 5;

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

function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("s") || "";
  const stateId = searchParams.get("state_id");
  const lgaId = searchParams.get("lga_id");

  const state = stateId === "undefined" ? null : stateId;
  const lga = lgaId === "undefined" ? null : lgaId;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/search`,
      {
        // country_id: "d147b57a-e5b3-4a6a-a021-a3aa042e0888",
        state_id: state,
        lga_id: lga,
        text: query,
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

  return (
    <main className="">
      <HomepageHero isHomepage={false} />

      {/* <h1 className="text-xl font-semibold mb-4 col text-center -mt-10 z-30">
        Search: {query}
      </h1> */}

      <section className="bg-white w-full pt-10 flex flex-wrap max-w-7xl mx-auto">
        {/* <div className="lg:w-[20%] w-full lg:pl-3 lg:sticky lg:top-20 self-start">
          <CategoryList />
        </div> */}
        <div className="w-full lg:pl-5 rounded px-3 grid grid-cols-12 gap-x-5 gap-y-7">
          {/* <div className="lg:w-[80%] w-full lg:pl-5 rounded px-3 grid grid-cols-12 gap-x-5 gap-y-7"> */}
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

          {/* {[...Array(50)].map((_, index) => (
            <ProductCard key={index} />
          ))} */}
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <Search />
    </Suspense>
  );
}
