import React from "react";

function ProductGridLoader() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded col-span-6 md:col-span-3 overflow-hidden animate-pulse bg-white"
        >
          <div className="aspect-square bg-zinc-100 relative lg:max-h-[250px] w-full">
            <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-wrap items-center gap-1 text-xs capitalize">
              <span className="bg-zinc-200 w-12 h-5 rounded-full"></span>
              <span className="bg-zinc-200 w-20 h-5 rounded-full"></span>
            </div>
          </div>

          <div className="px-0 pb-1 mt-2">
            <h3 className="w-full h-3 rounded bg-zinc-100"></h3>
            <p className="flex flex-wrap items-center pt-2">
              <span className="w-1/3 h-3 rounded bg-zinc-100"></span>
              <span className="w-1/3 h-3 ml-auto rounded bg-zinc-100"></span>
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductGridLoader;
