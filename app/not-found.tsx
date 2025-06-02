// import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="mb-4 text-5xl text-slate-900 tracking-tight font-extrabold lg:text-7xl ">
        404
      </h1>
      <p className="mb-4 text-2xl text-slate-700 tracking-tight font-bold md:text-4xl ">
        Page not found currently
      </p>
      <p className="mb-4 text-lg font-light text-gray-500">
        Sorry, we can&apos;t find such page.
      </p>
    </div>
  );
}
