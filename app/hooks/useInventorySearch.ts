import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 5;

const fetcher = async ([url, body]: [string, unknown]) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const json = await res.json();
  return json.data.inventories;
};

export const useInventorySearch = ({
  query = "",
  stateId = "",
  lgaId = "",
}: {
  query?: string;
  stateId?: string;
  lgaId?: string;
}) => {
  const getKey = (pageIndex: number, previousPageData: unknown[] | null) => {
    if (previousPageData && previousPageData.length === 0) return null;

    return [
      `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/search`,
      {
        state_id: stateId,
        lga_id: lgaId,
        text: query,
        limit: PAGE_SIZE.toString(),
        offset: (pageIndex * PAGE_SIZE).toString(),
      },
    ];
  };

  const swr = useSWRInfinite(getKey, fetcher);

  return {
    ...swr,
    results: swr.data ? swr.data.flat() : [],
    isLoadingMore:
      swr.isLoading ||
      (swr.size > 0 &&
        swr.data &&
        typeof swr.data[swr.size - 1] === "undefined"),
    isReachingEnd:
      swr.data && swr.data[swr.data.length - 1]?.length < PAGE_SIZE,
  };
};
