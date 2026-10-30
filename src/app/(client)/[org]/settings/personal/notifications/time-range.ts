export function isValidHHmm(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function convertTo12Hour(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour.toString().padStart(2, "0")}:${m} ${suffix}`;
}

export function buildTimeRange(from: string, to: string): string | null {
  if (!isValidHHmm(from) || !isValidHHmm(to)) return null;
  return `${convertTo12Hour(from)} - ${convertTo12Hour(to)}`;
}
