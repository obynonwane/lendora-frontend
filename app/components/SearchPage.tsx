"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Search() {
  const searchParams = useSearchParams();

  const s = searchParams.get("s");

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {s}</>;
}
function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  );
}

export default SearchPage;
