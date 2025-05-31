export default function buildFilteredQueryString(
  queryParams: Record<string, string | number | null | undefined>
): string {
  const filteredQuery = Object.entries(queryParams)
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
    .map(([key, value]) => [key, String(value)]);

  return new URLSearchParams(filteredQuery).toString();
}
