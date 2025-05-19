"use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
import { useEffect } from "react";
// import Image from "next/image";
// import logoIcon from "../images/logo-icon.png";
// import LocationSelectModal from "./components/LocationSelectModal";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
// import axios from "axios";

export default function Home() {
  // const [isShowSelectStateModal, setIsShowSelectStateModal] = useState(false);
  // const [selectedState, setSelectedState] = useState(null);
  // const [allStates, setAllStates] = useState(null);

  useEffect(() => {
    const getStates = async () => {
      try {
        // const response = await axios.get(
        //   `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/states`
        // );
        // setAllStates(response.data);
        // navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    };

    getStates();
  }, []);

  return (
    <>
      {/* <header className=" bg-white sticky top-0 border-b text-slate-700">
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-2 px-3">
          <Link className=" " href="/">
            <Image src={logoIcon} alt="logo-icon" className="w-10 " />
          </Link>

          <div className="flex items-center gap-5">
            <Link className=" hover:text-[#F7972D]" href="/login">
              Login
            </Link>
            <Link className=" hover:text-[#F7972D]" href="/signup">
              Signup
            </Link>
          </div>
        </nav>
      </header> */}

      <main className="flex flex-col gap-8 items-center">
        <section className="py-40 w-full relative home-hero-section  border-y-[#F7972D] border-y-[8px]">
          <h1 className="mb-4 text-white text-xl text-center font-semibold ">
            What are you looking to rent?
          </h1>
          <div className="flex items-center justify-center px-5   max-w-md mx-auto">
            <button
              // onClick={() => setIsShowSelectStateModal(true)}
              className="flex items-center hover:bg-[#FFAB4E] hover:shadow-lg shadow   bg-[#F7972D] rounded p-3  text-white gap-x-2"
            >
              Lagos <FaCaretDown />
            </button>

            <div className="flex bg-white overflow-hidden border items-center order-slate-400 text-slate-700  ml-4 pr-3 focus:border-amber-500 w-full   rounded">
              <input
                className="e py-3 px-4  w-full  border-none outline-none"
                type="text"
                placeholder="I am looking to rent..."
                // value={confirmPassword}
                // onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <IoSearch className="text-base text-slate-700" />
            </div>
          </div>
          {/* {isShowSelectStateModal && (
            <LocationSelectModal
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              setIsShowSelectStateModal={setIsShowSelectStateModal}
              allStates={allStates}
            />
          )} */}
        </section>
      </main>
    </>
  );
}
