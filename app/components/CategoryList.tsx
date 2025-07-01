"use client";
import { useState, useEffect } from "react";

// import axios from "axios";
import { Category_TYPE, SubCategory_TYPE } from "../types";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import buildFilteredQueryString from "../utils/buildFilteredQueryString";
import { usePathname } from "next/navigation";
import { IoMenu } from "react-icons/io5";
import { localCategories } from "../categories";
import { RxCaretDown } from "react-icons/rx";
import { RiCloseLine } from "react-icons/ri";

function CategoryList() {
  const router = useRouter();
  const pathname = usePathname();

  // const [loading, setLoading] = useState<boolean>(false);
  // const [categories, setCategories] = useState<Category_TYPE[] | null>([]);
  const categories: Category_TYPE[] = localCategories;
  // const [isShowMobleCategorySelectModal, setIsShowMobleCategorySelectModal] =
  //   useState(false);
  // const [subCategories, setSubCategories] = useState<SubCategory_TYPE[]>([]);
  // const [isGetingSubCategories, setIsGetingSubCategories] = useState(false);
  const [selectedCategoryForMobile, setSelectedCategoryForMobile] =
    useState<Category_TYPE | null>(null);

  // const state_id = searchParams.get("state_id") || "";
  // const lga_id = searchParams.get("lga_id") || "";
  // const category_id = searchParams.get("category_id") || "";
  // const subcategory_id = searchParams.get("subcategory_id") || "";
  // const s = searchParams.get("s") || "";
  const [isOpenAllcategoriesModal, setIsOpenAllcategoriesModal] =
    useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  function useScreenWidth() {
    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenWidth;
  }
  useScreenWidth();
  // console.log(useScreenWidth());
  const handleSubCategoryCLick = (
    sub_category: SubCategory_TYPE,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // setIsShowMobleCategorySelectModal(false);
    e.stopPropagation(); // prevent bubbling
    e.preventDefault(); // prevent link navigation

    // const rawQuery: Record<string, string | number | undefined | null> = {
    //   category_id: selectedCategoryForMobile?.category_slug,
    //   subcategory_id: sub_category.id,
    //   state_id,
    //   lga_id,
    //   s,
    // };

    // const queryString = buildFilteredQueryString(rawQuery);
    // router.push(`/?${queryString}`);
    router.push(
      `/categories/${selectedCategoryForMobile?.category_slug}?subcategory_id=${sub_category.subcategory_slug}`
    );
    setIsOpenAllcategoriesModal(false);
    // console.log(queryString, "queryString");
  };

  return (
    <section className="lg:w-full text-sm rounded lg:bg-white   relative  category-list  ">
      {/* desktop only */}
      <div className=" overflow-x-auto  flex ">
        {/* {loading ? (
          <div className=" text-center  w-full mb-5   py-4 flex justify-center">
            {" "}
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-lendora-500"
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
        ) : ( */}
        <>
          {/* all categories button */}
          <div
            className=" group/categories"
            onMouseEnter={() =>
              screenWidth >= 1024 && setIsOpenAllcategoriesModal(true)
            }
            onMouseLeave={() =>
              screenWidth && setIsOpenAllcategoriesModal(false)
            }
          >
            <button
              className="flex items-center relative gap-3  cursor-pointer lg:py-2 lg:pr-2 "
              onClick={() =>
                screenWidth < 1024 && setIsOpenAllcategoriesModal(true)
              }
            >
              <span className="whitespace-nowrap flex items-center gap-2">
                <IoMenu className="lg:text-xl text-3xl" />
                <span className="hidden lg:block"> All Categories</span>
              </span>
            </button>

            {/* Categories Dropdown */}
            {isOpenAllcategoriesModal && (
              <>
                <div className="bg-white fixed h-screen w-screen bottom-0 top-0 left-0 right-0 z-40 lg:hidden flex "></div>
                <></>
                <div
                  className={
                    "lg:absolute fixed top-0 lg:top-full lg:bottom-px bottom-0  left-0 lg:right-px right-0 z-50 hidden lg:w-[300px] bg-white group-hover/categories:block shadow-md"
                  }
                >
                  <h3 className="text-lg lg:hidden flex pt-2 justify-between items-center px-3 font-medium text-slate-900 mb-2">
                    All Categories
                    <span
                      onClick={() => {
                        setIsOpenAllcategoriesModal(false);
                      }}
                    >
                      <RiCloseLine className="text-2xl" />
                    </span>
                  </h3>
                  {categories?.map((category) => (
                    <div
                      key={category.id}
                      className=" group/category "
                      onMouseEnter={() =>
                        screenWidth >= 1024 &&
                        setSelectedCategoryForMobile(category)
                      }
                    >
                      <Link
                        href={`/categories/${category.category_slug}`}
                        onNavigate={() => {
                          setIsOpenAllcategoriesModal(false);
                        }}
                        onClick={(e) => {
                          if (screenWidth < 1024) {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedCategoryForMobile(category);
                          }
                        }}
                        className={`flex  items-center gap-3 border-t px-3 py-2 hover:bg-zinc-100 bg-white ${
                          pathname.includes(
                            `/categories/${category.category_slug}`
                          )
                            ? "text-lendora-500"
                            : ""
                        }`}
                      >
                        <span className="w-7 h-7 flex items-center justify-center bg-zinc-100 rounded">
                          <i
                            className={`${category.icon_class} text-[0.8rem] text-gray-500`}
                          ></i>
                        </span>
                        <span className="whitespace-nowrap">
                          {category.name}
                        </span>

                        <span className="ml-auto lg:hidden">
                          <RxCaretDown className="text-base" />
                        </span>
                      </Link>

                      {/* Subcategories Panel */}
                      <div className="lg:absolute lg:inset-y-0 lg:left-full z-50 hidden lg:min-w-[200px] bg-white h-full group-hover/category:block lg:border-x  ">
                        <div className="bg-zinc-50/50">
                          {" "}
                          <>
                            {category.subcategories.map((sub_category) => (
                              <div
                                onClick={(e) =>
                                  handleSubCategoryCLick(sub_category, e)
                                }
                                key={sub_category.id}
                                className={`flex border-t lg:pl-3 pl-12 last:mb-5 last:lg:mb-0 items-center gap-2 cursor-pointer hover:bg-gray-100 lg:bg-white px-3 py-2 `}
                              >
                                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-zinc-100 rounded">
                                  <i
                                    className={`${sub_category.icon_class}  text-[0.8rem] text-gray-500`}
                                  ></i>
                                </span>{" "}
                                <span className="text-slate-700">
                                  {/* <span className="whitespace-nowrap overflow-hidden text-ellipsis"> */}
                                  {sub_category.name}{" "}
                                </span>
                                {/* <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {sub_category.name}{" "}
                            </span> */}
                              </div>
                            ))}
                          </>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {categories?.slice(0, 6).map((category) => (
            // categories
            <Link
              href={`/categories/${category.category_slug}`}
              key={category.id + category.name}
              className={`lg:flex hidden items-center gap-3 ${
                pathname.includes(`/categories/${category.category_slug}`)
                  ? "text-lendora-500"
                  : ""
              }  hover:bg-zinc-100 group cursor-pointer  px-3 py-2 `}
              onMouseEnter={() => {
                // console.log(category);
                setSelectedCategoryForMobile(category);
                //   setHovered(category);
                // fetchSubcategories(category?.id);
              }}
            >
              {/* <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-zinc-100 rounded">
                  <i
                    className={`${category.icon_class}  text-[0.8rem] text-gray-500`}
                  ></i>
                </span>{" "} */}
              {/* <span className=""> */}
              <span className="whitespace-nowrap ">{category.name} </span>
              <section className=" absolute top-full  z-50 min-w-[200px]  lg:group-hover:block hidden ">
                <div className="  h-full bg-white mt-0 -ml-3   shadow-md">
                  <>
                    {category.subcategories.map((sub_category) => (
                      <div
                        onClick={(e) => handleSubCategoryCLick(sub_category, e)}
                        key={sub_category.id}
                        className={`flex border-t  items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 `}
                      >
                        <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-zinc-100 rounded">
                          <i
                            className={`${sub_category.icon_class}  text-[0.8rem] text-gray-500`}
                          ></i>
                        </span>{" "}
                        <span className="text-slate-700">
                          {/* <span className="whitespace-nowrap overflow-hidden text-ellipsis"> */}
                          {sub_category.name}{" "}
                        </span>
                        {/* <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {sub_category.name}{" "}
                            </span> */}
                      </div>
                    ))}
                  </>
                </div>
              </section>
            </Link>
          ))}
        </>
        {/* )} */}
      </div>
      {/* mobile */}
    </section>
  );
}

export default CategoryList;
