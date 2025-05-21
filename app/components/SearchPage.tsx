"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

function SearchPage() {
  const searchParams = useSearchParams();

  const s = searchParams.get("s");

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {s}</>;
}

export default SearchPage;
