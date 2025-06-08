"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import Footer from "./components/Footer";
// import { FaFilter } from "react-icons/fa";

// import CategoryList from "./CategoryList";
// import HomepageHero from "./components/HomepageHero";
import ProductCard from "./components/ProductCard";
import HomepageSlider from "./components/HomepageSlider";
import CategorySlider from "./components/CategorySlider";
const PAGE_SIZE = 5;

function Home() {
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
  const query = searchParams.get("s") || "";
  const stateId = searchParams.get("state_id") || "";
  const lgaId = searchParams.get("lga_id") || "";

  // const state = stateId === "undefined" ? null : stateId;
  // const lga = lgaId === "undefined" ? null : lgaId;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/search`,
      {
        // country_id: "d147b57a-e5b3-4a6a-a021-a3aa042e0888",
        // category_slug: stateId,
        state_id: stateId,
        lga_id: lgaId,
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

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isReachingEnd, isLoadingMore, setSize]);

  return (
    <>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <main className="">
          {/* <HomepageHero isHomepage /> */}

          {/* <div className="bg-gradient-to-br from-orange-500 to-red-500  min-h-[500px] flex items-center justify-center banner"></div> */}
          <HomepageSlider />
          <section className="bg-white w-full pt-10 max-w-7xl mx-auto">
            {/* <div className="lg:w-[20%] w-full lg:pl-3 lg:sticky z-30 lg:top-20 self-start">
            </div> */}
            <CategorySlider />
            {/* <CategoryList isMobileOnly={true} /> */}
            <div className="lgg:w-[80%] w-full   rounded px-3 grid grid-cols-12 gap-x-5 gap-y-7">
              {/* <div className="  flex z-10 col-span-12 sticky bg-white top-[57px] p-2 justify-end">
                <span className="flex gap-2 text-slate-600 items-center justify-center">
                  <FaFilter />
                  Filter
                </span>
              </div> */}
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
        <Footer />
      </Suspense>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <Home />
    </Suspense>
  );
}
