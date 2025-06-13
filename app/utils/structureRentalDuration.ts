type Duration = "hourly" | "daily" | "monthly" | "annually";

export function structureRentalDuration(duration: Duration): string {
  switch (duration) {
    case "hourly":
      return "hour";
    case "daily":
      return "day";
    case "monthly":
      return "month";
    case "annually":
      return "year";
    default:
      return "";
  }
}

// Usage example
// const unit = getSingularUnit("daily"); // returns "day"
