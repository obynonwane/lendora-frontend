"use client";
import { useAuth } from "../auth-context";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "../../images/logo-icon.png";
import Search from "./Search";
import CategoryList from "./CategoryList";

export default function Header() {
  const { isLoggedIn, isAuthChecked } = useAuth();

  return (
    <header className="bg-white   text-slate-700  sticky top-0 z-50 drop-shadow-md lg:pb-0 pb-2">
      <div className="h-7 text-center bg-orange-500 text-sm text-white flex items-center justify-center gap-3 p-1">
        Lendora for business{" "}
        <span className="block h-full bg-white w-[1px]"></span>{" "}
        <a href="#" className="underline">
          Learn More!
        </a>
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
            <Link className="hover:text-orange-400" href="/">
              Explore
            </Link>
            <Link className="hover:text-orange-400" href="/profile">
              Profile
            </Link>
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
            <CategoryList isMobileOnly={false} />
          </div>
        </div>
      </nav>{" "}
    </header>
  );
}
