"use client";
import HomepageHero from "./components/HomepageHero";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <>
      {/* <header className=" bg-white sticky top-0 border-b text-slate-700">
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-2 px-3">
          <Link className=" " href="/">
            <Image src={logoIcon} alt="logo-icon" className="w-10 " />
          </Link>

          <div className="flex items-center gap-5">
            <Link className=" hover:text-orange-400" href="/login">
              Login
            </Link>
            <Link className=" hover:text-orange-400" href="/signup">
              Signup
            </Link>
          </div>
        </nav>
      </header> */}

      <main className="">
        <HomepageHero />

        <section className="bg-white w-full pt-10 ">
          <div className=" rounded-md px-3 grid grid-cols-12 gap-x-5 gap-y-7 mx-auto max-w-7xl">
            {[...Array(10)].map((_, index) => (
              <ProductCard key={index} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
