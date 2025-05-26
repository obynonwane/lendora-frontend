"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Category_TYPE, SubCategory_TYPE } from "../types";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CategoryList() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category_TYPE[] | null>([]);
  const [isShowMobleCategorySelectModal, setIsShowMobleCategorySelectModal] =
    useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory_TYPE[]>([]);
  const [isGetingSubCategories, setIsGetingSubCategories] = useState(false);
  //   const [hovered, setHovered] = useState<Category_TYPE | null>(null);
  const [selectedCategoryForMobile, setSelectedCategoryForMobile] =
    useState<Category_TYPE | null>(null);

  //   useEffect(() => {
  const fetchSubcategories = async (id: string) => {
    setIsGetingSubCategories(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/category/subcategory/${id}`
      );
      // setTimeout(() => {
      setSubCategories(response.data.data);
      setIsGetingSubCategories(false);
      // }, 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // setError(err.message || "Failed to fetch LGAs");
      } else {
        // setError("Failed to fetch LGAs");
      }
    } finally {
      setLoading(false);
    }
  };

  // fetchSubcategories(hovered?.id);
  //   }, [hovered, selectedCategoryForMobile]);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/all-categories`
        );
        console.log(response.data.data, "response");
        setCategories(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message || "Failed to fetch categories");
        } else {
          // setError("Failed to fetch states");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const mobileCategoryModal = () => (
    <>
      <div
        onClick={() => setIsShowMobleCategorySelectModal(false)}
        className="fixed lg:hidden block z-[299] cursor-pointer inset-0 bg-black/50"
      ></div>
      <div className="bg-[#EBF2F7] z-[300] fixed lendora-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[400px] h-[90%] md:h-[80%] overflow-x-hidden rounded-md">
        <div className=" w-full h-full bg-white rounded border">
          {/* hello {category.name} */}
          {isGetingSubCategories ? (
            // subcategories loader
            <>
              <div className=" text-center  pt-10 flex justify-center">
                {" "}
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-400 fill-orange-400"
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
            </>
          ) : (
            // sub categories list
            <>
              {subCategories.map((sub_category) => (
                <Link
                  href={`/catalog?category-id=${selectedCategoryForMobile?.id}&sub_category_id=${sub_category.id}`}
                  key={sub_category.id}
                  className={`flex border-t  items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded`}
                >
                  <span className="w-5 h-5 flex-shrink-0 bg-zinc-200 rounded"></span>{" "}
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {sub_category.name}{" "}
                  </span>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <aside className="w-full text-sm rounded bg-white  relative lg:border mb-10">
      {/* desktop only */}
      <div className="hidden lg:block min-h-60">
        {loading ? (
          <div className=" text-center  w-full mb-5   py-20 flex justify-center">
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
        ) : (
          <>
            {categories?.map((category) => (
              // categories
              <div
                onClick={() =>
                  router.push(`/catalog?category-id=${category.id}`)
                }
                key={category.id + category.name}
                className={`flex items-center gap-3 hover:bg-zinc-100 border-t group cursor-pointer  px-3 py-2 rounded`}
                onMouseEnter={() => {
                  console.log(category);
                  //   setHovered(category);
                  fetchSubcategories(category?.id);
                }}
              >
                <span className="w-5 h-5 flex-shrink-0 bg-zinc-200 rounded"></span>{" "}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {category.name}{" "}
                </span>
                <section className="pl-2 absolute left-[100%] top-0 w-40 h-full lg:group-hover:block hidden ">
                  <div className=" w-full h-full bg-white rounded border">
                    {/* hello {category.name} */}
                    {isGetingSubCategories ? (
                      // subcategories loader
                      <>
                        <div className=" text-center  pt-10 flex justify-center">
                          {" "}
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-400 fill-orange-400"
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
                      </>
                    ) : (
                      // sub categories list
                      <>
                        {subCategories.map((sub_category) => (
                          <Link
                            href={`/catalog?category-id=${category.id}&sub_category_id=${sub_category.id}`}
                            key={sub_category.id}
                            className={`flex border-t  items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded`}
                          >
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {sub_category.name}{" "}
                            </span>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                </section>
              </div>
            ))}
          </>
        )}
      </div>

      {/* mobile */}
      <div className="lg:hidden block">
        {/* modal to select sub category for mobile */}
        <> {isShowMobleCategorySelectModal && mobileCategoryModal()}</>
        {loading ? (
          <div className=" text-center  w-full mb-5   py-20 flex justify-center">
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
        ) : (
          <div className="grid grid-cols-12 gap-x-5 ">
            {categories?.map((category) => (
              // categories
              <div
                // onClick={() =>
                //   router.push(`/catalog?category-id=${category.id}`)
                // }
                key={category.id + category.name}
                className={`flex flex-col col-span-4  items-center gap-3 hover:bg-zinc-100  group cursor-pointer  px-3 py-2 rounded`}
                onClick={() => {
                  console.log(category);
                  //   setHovered(category);
                  // set selected category for mobile
                  setSelectedCategoryForMobile(category);
                  // open modal
                  fetchSubcategories(category?.id);
                  setIsShowMobleCategorySelectModal(true);
                }}
              >
                <span className="w-10 h-10 flex-shrink-0 bg-zinc-200 rounded"></span>{" "}
                <span className="text-center">
                  {/* <span className="lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis"> */}
                  {category.name}{" "}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default CategoryList;
