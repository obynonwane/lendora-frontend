"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import LocationSelectModal from "./LocationSelectModal";
import { IoSearch } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import buildFilteredQueryString from "../utils/buildFilteredQueryString";
import { IoLocationSharp } from "react-icons/io5";

type LGA = {
  id: string;
  name: string;
  lga_slug: string;
};

type State = {
  id: string;
  name: string;
  state_slug: string;
  lgas: LGA[];
};

function SearchComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const state_id = searchParams.get("state_id") || "";
  const lga_id = searchParams.get("lga_id") || "";
  const category_id = searchParams.get("category_id") || null;
  const subcategory_id = searchParams.get("subcategory_id") || null;
  const s = searchParams.get("s") || "";

  const [isShowSelectStateModal, setIsShowSelectStateModal] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(
    state_id ? { id: state_id, name: "", state_slug: "", lgas: [] } : null
  );
  const [selectedLGA, setSelectedLGA] = useState<LGA | null>(
    lga_id ? { id: lga_id, name: "", lga_slug: "" } : null
  );
  const [searchQuery, setSearchQurey] = useState<string>(s || "");

  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.length === 0) {
      return;
    }
    const rawQuery = {
      s: searchQuery,

      category_id,
      subcategory_id,
      state_id: selectedState?.id,
      lga_id: selectedLGA?.id,
    };

    const queryString = buildFilteredQueryString(rawQuery);
    router.push(`/search/?${queryString}`);
  };

  useEffect(() => {
    if (!isShowSelectStateModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowSelectStateModal]);
  useEffect(() => {
    // if (searchQuery.length === 0) {
    //   return;
    // }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current && e.key === "Enter") {
        console.log("Enter key pressed");
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, searchQuery, selectedState?.id, selectedLGA?.id]);

  return (
    <>
      {/* <div className="bg-red-100 h-full px-2">sas</div> */}

      <>
        <div className="flex items-center h-10 border overflow-hidden rounded  justify-center   lg:max-w-lg w-full mx-auto">
          {/* open location modal */}
          <button
            onClick={() => setIsShowSelectStateModal(true)}
            className="flex items-center pr-2 pl-2 text-slate-500 border-r h-full "
          >
            <IoLocationSharp />{" "}
            <span className="lg:w-fit w-[50px] truncate block whitespace-nowrap text-sm overflow-hidden text-ellipsis pl-1">
              {!selectedState ? "NG" : selectedState.name}
            </span>
          </button>
          <input
            className="h-ful px-4  w-full py-2  border-none outline-none"
            type="text"
            ref={inputRef}
            placeholder="Press Enter to search..."
            // placeholder="I am looking to rent..."
            value={searchQuery}
            onChange={(e) => setSearchQurey(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className=" items-center px-3 block    h-full bg-orange-400 text-white "
          >
            <IoSearch />{" "}
          </button>
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
      </>
    </>
  );
}

export default function Search() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <SearchComponent />
      </Suspense>
    </main>
  );
}
