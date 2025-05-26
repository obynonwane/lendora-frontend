"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Category_TYPE, SubCategory_TYPE } from "../types";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CategoryList() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category_TYPE[] | null>([
    {
      id: "2e290752-95ed-4408-ac54-ba06d335a604",
      name: "Electronics \u0026 Gadgets",
      description:
        "Devices and gadgets for rent, including phones, cameras, laptops, and more.",
      icon_class: "fa-solid fa-laptop",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "22298e70-6795-449e-a4e4-e200e3bdc24d",
      name: "Vehicles \u0026 Transportation",
      description:
        "Various types of vehicles including cars, bikes, scooters, and boats for rent.",
      icon_class: "fa-solid fa-car",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "a6d0b2f9-4209-4a9b-86f6-9055a46a166a",
      name: "Tools \u0026 Equipment",
      description:
        "Tools and machines for construction, repair, gardening, and more.",
      icon_class: "fa-solid fa-wrench",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "21a235e2-1b08-49f6-8acb-2846904587fa",
      name: "Home \u0026 Living",
      description:
        "Furniture, home appliances, and other living essentials available for rent.",
      icon_class: "fa-solid fa-couch",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "e4702594-b361-4a7a-9b4c-2dce2e7fcfcb",
      name: "Events \u0026 Party Supplies",
      description: "All items needed for events, parties, and gatherings.",
      icon_class: "fa-solid fa-birthday-cake",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "0e54853b-bce1-4d45-b533-9cbfd1182f3b",
      name: "Fashion \u0026 Accessories",
      description:
        "Clothing, jewelry, and accessories for rent for various occasions.",
      icon_class: "fa-solid fa-tshirt",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "56141970-46f1-46ce-91f0-96c82b07e8b5",
      name: "Sports \u0026 Outdoors",
      description:
        "Sporting gear and outdoor equipment including camping, fitness, and adventure gear.",
      icon_class: "fa-solid fa-football-ball",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "023fa990-6d37-41c2-9c97-1e7c7f0f22c9",
      name: "Media \u0026 Entertainment",
      description:
        "Musical instruments, books, video games, and other entertainment-related rentals.",
      icon_class: "fa-solid fa-gamepad",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "3bd94a54-e4dd-44db-b115-505dee98efef",
      name: "Professional Services Equipment",
      description:
        "Specialized equipment used for business, medical, or creative services.",
      icon_class: "fa-solid fa-briefcase",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
    {
      id: "f8fec0f8-2c4a-42e4-b38d-fd884445f7af",
      name: "Miscellaneous",
      description:
        "Miscellaneous items for rent including baby gear, pet supplies, and seasonal items.",
      icon_class: "fa-solid fa-box-open",
      created_at_human: "2024-12-06 11:53:20",
      updated_at_human: "2024-12-06 11:53:20",
    },
  ]);
  const [subCategories, setSubCategories] = useState<SubCategory_TYPE[]>([]);
  const [isGetingSubCategories, setIsGetingSubCategories] = useState(false);
  const [hovered, setHovered] = useState<Category_TYPE | null>(null);

  useEffect(() => {
    const fetchLGAs = async () => {
      setIsGetingSubCategories(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/category/subcategory/${hovered?.id}`
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

    fetchLGAs();
  }, [hovered]);

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

  if (loading) {
    return (
      <div className=" text-center  pt-20 flex justify-center">
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
    <aside className="w-full text-sm rounded bg-white relative border">
      {categories?.map((category) => (
        // categories
        <div
          onClick={() => router.push(`/catalog?category-id=${category.id}`)}
          key={category.id + category.name}
          className={`flex items-center gap-3 hover:bg-zinc-100 border-t group cursor-pointer  px-3 py-2 rounded`}
          onMouseEnter={() => {
            console.log(category);
            setHovered(category);
          }}
        >
          <span className="w-5 h-5 flex-shrink-0 bg-zinc-200 rounded"></span>{" "}
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            {category.name}{" "}
          </span>
          <section className="pl-2 absolute left-[100%] top-0 w-40 h-full group-hover:block hidden ">
            <div className=" w-full h-full bg-white rounded">
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
    </aside>
  );
}

export default CategoryList;
