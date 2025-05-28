"use client";
import { useState, useEffect, useRef } from "react";
import LocationSelectModal from "./LocationSelectModal";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";

type State = {
  id: string;
  name: string;
};

type LGA = {
  id: string;
  name: string;
};

export default function Home({ isHomepage }: { isHomepage: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const state_id = searchParams.get("state_id") || "";
  const lga_id = searchParams.get("lga_id") || "";
  const category_id = searchParams.get("category_id") || "";
  const subcategory_id = searchParams.get("subcategory_id") || "";
  const s = searchParams.get("s") || "";

  const [isShowSelectStateModal, setIsShowSelectStateModal] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(
    state_id ? { id: state_id, name: "" } : null
  );
  const [selectedLGA, setSelectedLGA] = useState<LGA | null>(
    lga_id ? { id: lga_id, name: "" } : null
  );
  const [searchQuery, setSearchQurey] = useState<string>(s || "");
  // const [categoryId, setCategoryId] = useState<{
  //   id: string;
  //   name: string;
  // } | null>(category_id ? { id: category_id, name: "" } : null);
  // const [subcategoryId, setSubcategoryId] = useState<{
  //   id: string;
  //   name: string;
  // } | null>(subcategory_id ? { id: subcategory_id, name: "" } : null);

  const router = useRouter();

  const handleSearch = () => {
    router.push(
      `/?s=${searchQuery}&category_id=${category_id}&subcategory_id=${subcategory_id}&state_id=${selectedState?.id}&lga_id=${selectedLGA?.id}`
    );
  };

  useEffect(() => {
    if (!isShowSelectStateModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowSelectStateModal]);
  useEffect(() => {
    if (searchQuery.length === 0) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current && e.key === "Enter") {
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, searchQuery, selectedState?.id, selectedLGA?.id]);

  return (
    <>
      <section
        className={` w-full relative   ${
          isHomepage
            ? "home-hero-section py-40 border-y-orange-400 border-y-[8px] "
            : "bg-zinc-100 py-16"
        } `}
      >
        {isHomepage ? (
          <h1 className="mb-4 text-white text-xl text-center font-semibold ">
            What are you looking to rent?
          </h1>
        ) : (
          <h1 className="mb-4 text-black text-xl text-center font-semibold ">
            Search{" "}
          </h1>
        )}
        <div className="flex items-center justify-center px-5   max-w-md mx-auto">
          <button
            onClick={() => setIsShowSelectStateModal(true)}
            className="flex items-center hover:bg-[#FFAB4E] hover:shadow-lg shadow bg-orange-400 rounded py-4 text-white pr-2 max-w-[200px]"
          >
            <span className="truncate block whitespace-nowrap text-sm overflow-hidden text-ellipsis w-[70px] pl-2">
              {!selectedState ? "Nigeria" : selectedState.name}
            </span>
            <FaCaretDown />
          </button>

          <div className="flex bg-white overflow-hidden border items-center order-slate-400 text-slate-700  ml-4 pr-3 focus:border-amber-500 w-full   rounded">
            <input
              className="e py-3 px-4  w-full  border-none outline-none"
              type="text"
              ref={inputRef}
              placeholder="Press Enter to search..."
              // placeholder="I am looking to rent..."
              value={searchQuery}
              onChange={(e) => setSearchQurey(e.target.value)}
            />
            <IoSearch className="text-base text-slate-700" />
          </div>
        </div>
        {isShowSelectStateModal && (
          <LocationSelectModal
            setSelectedLGA={setSelectedLGA}
            selectedLGA={selectedLGA}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setIsShowSelectStateModal={setIsShowSelectStateModal}
          />
        )}
      </section>
    </>
  );
}
