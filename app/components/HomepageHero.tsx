"use client";
import { useState, useEffect, useRef } from "react";
import LocationSelectModal from "./LocationSelectModal";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

type State = {
  id: string;
  name: string;
};

type LGA = {
  id: string;
  name: string;
};

export default function Home() {
  const [isShowSelectStateModal, setIsShowSelectStateModal] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<LGA | null>(null);
  const [searchQuery, setSearchQurey] = useState<string>("");
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isShowSelectStateModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowSelectStateModal]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current && e.key === "Enter") {
        // handleSearch();
        router.push(
          `/search?s=${searchQuery}&state=${selectedState?.id}&lga=${selectedLGA?.id}`
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, searchQuery, selectedState?.id, selectedLGA?.id]);

  return (
    <>
      <section className="py-40 w-full relative home-hero-section  border-y-orange-400 border-y-[8px]">
        <h1 className="mb-4 text-white text-xl text-center font-semibold ">
          What are you looking to rent?
        </h1>
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
