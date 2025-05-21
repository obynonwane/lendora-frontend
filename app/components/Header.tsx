"use client";
import { useAuth } from "../auth-context";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "../../images/logo-icon.png";

export default function Header() {
  const { isLoggedIn, isAuthChecked } = useAuth();

  return (
    <header className="bg-white border-b text-slate-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-2 px-3">
        <Link href="/">
          <Image src={logoIcon} alt="logo-icon" className="w-10" />
        </Link>

        {!isAuthChecked ? (
          <span className="w-32 py-5 rounded bg-zinc-100 animate-pulse"></span>
        ) : // <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        !isLoggedIn ? (
          <div className="flex items-center gap-5">
            <Link className="hover:text-orange-400" href="/login">
              Login
            </Link>
            <Link className="hover:text-orange-400" href="/signup">
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5">
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
      </nav>
    </header>
  );
}
