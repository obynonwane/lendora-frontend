"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Category_TYPE, SubCategory_TYPE } from "../types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// import { useRouter } from "next/navigation";

function Sidebar({ categoryData }: { categoryData: Category_TYPE }) {
  const searchParams = useSearchParams();
  // const pathname = usePathname();

  //   const [loading, setLoading] = useState<boolean>(false);
  // console.log(categoryData);
  const [subCategories, setSubCategories] = useState<SubCategory_TYPE[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    searchParams.get("subcategory_id") || ""
  );

  // const inputRef = useRef<HTMLInputElement>(null);
  // const state_id = searchParams.get("state_id") || "";
  // const lga_id = searchParams.get("lga_id") || "";
  // const category_id = searchParams.get("category_id") || "";
  // const subcategory_id = searchParams.get("subcategory_id") || "";
  // const s = searchParams.get("s") || "";

  useEffect(() => {
    setSelectedSubCategory(searchParams.get("subcategory_id") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      // setIsGetingSubCategories(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/category/subcategory/${categoryData.id}`
        );
        // setTimeout(() => {
        setSubCategories(response.data.data);
        // setIsGetingSubCategories(false);
        // }, 5000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message || "Failed to fetch LGAs");
        } else {
          // setError("Failed to fetch LGAs");
        }
      } finally {
        // setIsGetingSubCategories(false);
      }
    };

    fetchSubcategories();
  }, []);

  if (!subCategories || subCategories.length === 0) {
    return (
      <div className=" text-center  w-full mb-5   py-10 flex justify-center">
        {" "}
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-orange-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }
  return (
    <aside className="">
      {/* <h1 className="mb-2 pl-1 border-l-4 border-l-orange-400 bg-orange-50 p-1">
        {categoryData.name}
      </h1> */}
      <div className="w-full text-sm rounded bg-white grid  grid-cols-12 gap-3 lg:gap-0  relative lg:border mb-5">
        {subCategories?.map((category) => (
          // categories
          <Link
            onClick={() => setSelectedSubCategory(category.id)}
            href={`/categories/${categoryData.category_slug}?subcategory_id=${category.subcategory_slug}`}
            // href={`/categories/${category.category_slug}`}
            key={category.id + category.name}
            className={`${
              selectedSubCategory === category.subcategory_slug
                ? "font-semibold"
                : " text-slate-700"
            } flex items-center gap-3 lg:col-span-12 col-span-6 first:border-0 hover:bg-zinc-100 lg:bg-white bg-zinc-100 lg:border-t group cursor-pointer  px-3 py-2 rounded`}
          >
            <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-zinc-100 rounded">
              <i
                className={`${category.icon_class}  text-[0.8rem] text-slate-500`}
              ></i>
            </span>{" "}
            <span className="">
              {/* <span className="whitespace-nowrap overflow-hidden text-ellipsis"> */}
              {category.name}{" "}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
function CategoriesSidebar({ categoryData }: { categoryData: Category_TYPE }) {
  return (
    <main>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Sidebar categoryData={categoryData} />
      </Suspense>
    </main>
  );
}
export default CategoriesSidebar;
