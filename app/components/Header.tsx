"use client";
// import { useAuth } from "../auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "../../images/logo-icon.png";
import Search from "./Search";
import CategoryList from "./CategoryList";
import { PiUserCircle } from "react-icons/pi";
import { Popover } from "radix-ui";
import { useRouter } from "next/navigation";
import { useUserStore } from "../utils/useUserStore";
import { BsChatLeftDots } from "react-icons/bs";
import { IoStorefrontOutline } from "react-icons/io5";
import { RxCaretDown } from "react-icons/rx";

export default function Header() {
  // const { isLoggedIn, isAuthChecked } = useAuth();

  // const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const router = useRouter();
  const logout = useUserStore((s) => s.logout);

  const authStateLoaded = useUserStore((s) => s.authStateLoaded);
  const logoutUser = () => {
    localStorage.removeItem("lendora_ac_tk");
    localStorage.removeItem("lendora_user");

    logout();

    router.push("/login");
  };

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const halfViewport = window.innerHeight / 2;

      if (scrollY >= halfViewport && !isFixed) {
        console.log("midpoint reached");
        setIsFixed(true);
      } else if (scrollY < halfViewport && isFixed) {
        console.log("okay");
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed]);

  return (
    <header
      className={`bg-white   text-slate-700  ${
        isFixed ? "fixed inset-x-0" : "sticky"
      } top-0 z-40 drop-shadow-md lg:pb-0 pb-2`}
    >
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

        {!authStateLoaded ? (
          <span className="w-32 py-5 rounded bg-zinc-100 animate-pulse order-2 lg:order-3"></span>
        ) : (
          <div className="flex items-center gap-5 order-2 lg:order-3">
            <Link
              className=" text-[22px]  flex items-center gap-1  hover:text-orange-400 "
              href="/businesses"
            >
              <IoStorefrontOutline />{" "}
              <span className="hidden lg:block text-sm"> All Stores</span>
            </Link>
            {isAuthenticated && (
              <Link
                href="/chat"
                className="IconButton  text-2xl flex items-center gap-[6px]  hover:text-orange-400"
                aria-label="Update dimensions"
              >
                <BsChatLeftDots className=" text-xl" />{" "}
                <span className="hidden lg:block text-sm"> Chat</span>
              </Link>
            )}

            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="IconButton  text-2xl flex items-center gap-1  hover:text-orange-400 "
                  aria-label="Update dimensions"
                >
                  <PiUserCircle className="" />{" "}
                  <span className="text-sm lg:block hidden">Account</span>
                  <RxCaretDown className="text-base -ml-1" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="PopoverContent text-slate-700 text-sm z-[999999] bg-white"
                  sideOffset={5}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // gap: 1,
                    }}
                  >
                    {!isAuthenticated && (
                      <>
                        <Popover.Close
                          className="w-full hover:bg-gray-100 py-2 px-2 text-left rounded"
                          aria-label="Close"
                        >
                          <Link className="block" href="/login">
                            Login
                          </Link>
                        </Popover.Close>
                        <Popover.Close
                          className="w-full hover:bg-gray-100 py-2 px-2 text-left rounded"
                          aria-label="Close"
                        >
                          <Link className="block" href="/signup">
                            Signup
                          </Link>
                        </Popover.Close>
                      </>
                    )}
                    {isAuthenticated && (
                      <>
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
                          <span
                            onClick={logoutUser}
                            className="  py-2 px-2 block"
                          >
                            Logout
                          </span>
                        </Popover.Close>
                      </>
                    )}
                  </div>

                  <Popover.Arrow className="PopoverArrow" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            {isAuthenticated && (
              <Link
                className="bg-orange-400 text-white px-4 hover:bg-orange-500 py-2 rounded"
                href="/create"
              >
                Create
              </Link>
            )}
          </div>
        )}

        <div className="lg:w-full relative order-0 lg:-ml-0 -ml-3 lg:order-4 lg:bg-white bg-transparent  z-[40]  ">
          <div className="lg:max-w-7xl lg:mx-auto w-fit lg:w-full relative lg:px-0 px-3 z-[40] ">
            <CategoryList />
          </div>
        </div>
      </nav>{" "}
    </header>
  );
}
