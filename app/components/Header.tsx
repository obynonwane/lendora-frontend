"use client";
import Link from "next/link";
import Image from "next/image";
// import { useState, useEffect } from "react";
import logoIcon from "../../images/logo-icon.png";

export default function Header() {
  return (
    <>
      <header className=" bg-white border-b text-slate-700">
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
      </header>
    </>
  );
}
