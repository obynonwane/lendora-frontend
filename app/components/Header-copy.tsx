"use client";
import { useAuth } from "../auth-context";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "../../images/logo-icon.png";
import Search from "./Search";
import CategoryList from "./CategoryList";
import { PiUserCircle } from "react-icons/pi";
import { Popover } from "radix-ui";

export default function Header() {
  const { isLoggedIn, isAuthChecked } = useAuth();

  return (
    <header className="bg-white   text-slate-700  sticky top-0 z-50 drop-shadow-md lg:pb-0 pb-2">
      <div className="h-7 text-center bg-orange-500 text-sm text-white flex items-center justify-center gap-3 p-1">
        Lendora for business{" "}
        <span className="block h-full bg-white w-[1px]"></span>{" "}
        <Link href="/lendora-for-business" className="underline">
          Learn More!
        </Link>
      </div>
      <nav className="max-w-7xl mx-auto z-10  w-full flex lg:gap-4 relative flex-wrap items-center justify-between  px-3 pt-3">
        <Link
          href="/"
          className="lg:-pl-0 z-[10] mr-auto -pl-24 order-1 lg:order-0"
        >
          <Image src={logoIcon} alt="logo-icon" className="w-10" />
        </Link>
        {/* <span className="lg:hidden w-1/2"></span> */}
        <div className="lg:flex-1 lg:order-1 order-4  header-search-container relative lg:pt-0 pt-2 mt-2 lg:mt-0 w-full">
          <Search />
        </div>
        {!isAuthChecked ? (
          <span className="w-32 py-5 rounded bg-zinc-100 animate-pulse order-2 lg:order-3"></span>
        ) : !isLoggedIn ? (
          <div className="flex items-center gap-5 order-2 lg:order-3">
            <Link className="hover:text-orange-400" href="/login">
              Login
            </Link>
            <Link className="hover:text-orange-400" href="/signup">
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5 order-2 lg:order-3">
            {/* <Link className="hover:text-orange-400" href="/">
              Explore
            </Link> */}
            {/* <Link className="hover:text-orange-400 text-2xl" href="/login">
              <FaRegUserCircle />
            </Link> */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="IconButton hover:text-orange-400 text-2xl"
                  aria-label="Update dimensions"
                >
                  <PiUserCircle className="text-slate-500" />{" "}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="PopoverContent text-slate-700 text-sm z-[9999999999999999999] bg-white"
                  sideOffset={5}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // gap: 1,
                    }}
                  >
                    <Popover.Close
                      className="w-full hover:bg-gray-100 py-2 px-2 text-left rounded"
                      aria-label="Close"
                    >
                      <Link className=" block" href="/profile">
                        Profile
                      </Link>
                    </Popover.Close>
                    <Popover.Close
                      className="w-full hover:bg-gray-100  text-left rounded"
                      aria-label="Close"
                    >
                      <span className="  py-2 px-2 block">Logout</span>
                    </Popover.Close>
                  </div>
                  {/* <Popover.Close className="PopoverClose" aria-label="Close">
                    x
                  </Popover.Close> */}
                  <Popover.Arrow className="PopoverArrow" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <Link
              className="bg-orange-400 text-white px-4 hover:bg-orange-500 py-2 rounded"
              href="/create"
            >
              Create
            </Link>
          </div>
        )}

        <div className="lg:w-full relative order-0 lg:-ml-0 -ml-3 lg:order-4 lg:bg-white bg-transparent  z-[99999]  ">
          <div className="lg:max-w-7xl lg:mx-auto w-fit lg:w-full relative lg:px-0 px-3 z-[99999] ">
            <CategoryList />
          </div>
        </div>
      </nav>{" "}
    </header>
  );
}
