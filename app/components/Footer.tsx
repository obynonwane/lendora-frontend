import React from "react";
import Link from "next/link";
import logoIcon from "../../images/logo-icon.png";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <>
      <footer className=" border-t bg-white text-sm">
        <div className="mx-auto max-w-7xl py-10 px-3 ">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 md:gap-8 gap-4">
            <div className="flex flex-col flex-shrink-0">
              <div className="lg:-mt-0 -mt-2">
                <Link href="/" className="">
                  <Image src={logoIcon} alt="logo-icon" className="w-10" />
                </Link>
              </div>
              <p className=" leading-none text-gray-800 mt-4 ">
                Copyright © 2025 Lendora.ng
              </p>
              <p className=" leading-none text-gray-800 mt-4 ">
                All rights reserved.
              </p>
            </div>

            <div className="sm:ml-0 ml-8 flex flex-col">
              <h2 className=" font-semibold text-base leading-4 text-gray-800 ">
                Company
              </h2>
              <Link
                href="/about-us"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                About Us
              </Link>
              <Link
                href="/about-us#how-it-works"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                How it works
              </Link>
              <a
                href="https://blog.lendora.ng/"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                Our Blog
              </a>
              {/* <Link
                href="#"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                Contact us
              </Link>
              <Link
                href="#"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                Testimonials
              </Link> */}
            </div>

            <div className="flex flex-col lg:mt-0 mt-10">
              <h2 className=" font-semibold text-base leading-4 text-gray-800 ">
                Policies
              </h2>
              <Link
                href="/privacy-policy"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="focus:outline-none focus:underline hover:text-gray-500  leading-4 mt-6 text-gray-800  cursor-pointer"
              >
                Terms & Conditions
              </Link>
            </div>

            <div className="sm:ml-0 ml-8 flex flex-col lg:mt-0 mt-10">
              <h2 className=" font-semibold text-base leading-4 text-gray-800 ">
                Get Updates
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white mt-5">
                <a
                  href="https://www.instagram.com/lendora.ng/"
                  aria-label="instagram"
                  target="_blank"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  w-8 h-8 flex-shrink-0 bg-gray-500 cursor-pointer hover:bg-orange-400 rounded-full flex items-center justify-center"
                >
                  <AiFillInstagram />
                </a>

                <a
                  href="https://x.com/lendoraNG"
                  aria-label="facebook"
                  target="_blank"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  w-8 h-8 flex-shrink-0 bg-gray-500 cursor-pointer hover:bg-orange-400 rounded-full flex items-center justify-center"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.youtube.com/@lendoraNG"
                  aria-label="twitter"
                  target="_blank"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  w-8 h-8 flex-shrink-0 bg-gray-500 cursor-pointer hover:bg-orange-400 rounded-full flex items-center justify-center"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://x.com/lendoraNG"
                  aria-label="twitter"
                  target="_blank"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  w-8 h-8 flex-shrink-0 bg-gray-500 cursor-pointer hover:bg-orange-400 rounded-full flex items-center justify-center"
                >
                  <FaXTwitter />
                </a>
              </div>
            </div>
          </div>
          {/* <div className="mt-10 lg:hidden">
            <label className="text-xl font-medium leading-5 text-gray-800 ">
              Get updates
            </label>
            <div className="flex items-center justify-between border border-gray-800 dark:border-white mt-4">
              <input
                type="text"
                className=" leading-4 p-4 relative z-0 w-full focus:outline-none text-gray-800 placeholder-gray-800  dark:placeholder-white dark:border-white dark:bg-gray-900"
                placeholder="Enter your email"
              />
              <button
                aria-label="send"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 cursor-pointer mr-4 cursor-pointer relative z-40"
              >
                <svg
                  className="fill-current text-gray-800 hover:text-gray-500  dark:hover:text-gray-200"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.8934 7.39673L14.8884 7.39457L1.54219 1.9166C1.42993 1.87011 1.30778 1.85187 1.18666 1.86353C1.06554 1.87519 0.949225 1.91637 0.848125 1.9834C0.741311 2.05266 0.653573 2.14711 0.592805 2.25826C0.532037 2.36941 0.500145 2.49376 0.5 2.62013V6.12357C0.50006 6.29633 0.561019 6.46366 0.67237 6.59671C0.783722 6.72976 0.938491 6.82021 1.11 6.85246L8.38906 8.18438C8.41767 8.18974 8.44348 8.20482 8.46205 8.22701C8.48062 8.2492 8.49078 8.2771 8.49078 8.30591C8.49078 8.33472 8.48062 8.36263 8.46205 8.38481C8.44348 8.407 8.41767 8.42208 8.38906 8.42744L1.11031 9.75936C0.938851 9.79153 0.784092 9.88185 0.67269 10.0148C0.561288 10.1477 0.500219 10.3149 0.5 10.4876V13.9917C0.499917 14.1124 0.530111 14.2312 0.587871 14.3374C0.645632 14.4437 0.729152 14.5341 0.830938 14.6006C0.953375 14.6811 1.09706 14.7241 1.24406 14.7243C1.34626 14.7242 1.4474 14.7039 1.54156 14.6646L14.8875 9.21787L14.8934 9.21509C15.0731 9.13869 15.2262 9.01185 15.3337 8.85025C15.4413 8.68866 15.4986 8.49941 15.4986 8.30591C15.4986 8.11241 15.4413 7.92316 15.3337 7.76157C15.2262 7.59997 15.0731 7.47313 14.8934 7.39673Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>{" "} */}
        </div>
      </footer>
    </>
  );
}

export default Footer;
