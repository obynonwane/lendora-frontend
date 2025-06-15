type Duration = "hourly" | "daily" | "monthly" | "annually";

export function calculateReturnDate(
  startDate: string,
  duration: Duration,
  units: number
): string {
  const date = new Date(startDate);
  console.log({ startDate, duration, units });
  switch (duration.replace(/,/g, "")) {
    case "hourly":
      date.setHours(date.getHours() + units);
      break;
    case "daily":
      date.setDate(date.getDate() + units);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + units);
      break;
    case "annually":
      date.setFullYear(date.getFullYear() + units);
      break;
  }

  // Format back to YYYY-MM-DD
  return date.toISOString().split("T")[0];
}
