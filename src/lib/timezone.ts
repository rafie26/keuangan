export const DEFAULT_TIMEZONE = "Asia/Jakarta";

export const timezoneOptions = [
  { value: "Asia/Jakarta", label: "WIB — Jakarta (UTC+7)" },
  { value: "Asia/Makassar", label: "WITA — Makassar (UTC+8)" },
  { value: "Asia/Jayapura", label: "WIT — Jayapura (UTC+9)" },
  { value: "Asia/Bangkok", label: "Bangkok (UTC+7)" },
  { value: "Asia/Singapore", label: "Singapura (UTC+8)" },
  { value: "Asia/Manila", label: "Manila (UTC+8)" },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)" },
  { value: "UTC", label: "UTC" },
];

export function getTzDateParts(
  date: Date,
  timeZone: string
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "0";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
  };
}

export function getOffsetMinutes(timeZone: string, date: Date): number {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(part ?? "");
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? "0"));
}

export function startOfDayInTz(date: Date, timeZone: string): Date {
  const { year, month, day } = getTzDateParts(date, timeZone);
  const wallMidnightUtc = Date.UTC(year, month - 1, day);
  const offset = getOffsetMinutes(timeZone, new Date(wallMidnightUtc));
  return new Date(wallMidnightUtc - offset * 60000);
}

export function daysInMonthTz(date: Date, timeZone: string): number {
  const { year, month } = getTzDateParts(date, timeZone);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function remainingDaysTz(date: Date, timeZone: string): number {
  const { day } = getTzDateParts(date, timeZone);
  return daysInMonthTz(date, timeZone) - day + 1;
}

export function timezoneLabel(value: string): string {
  return (
    timezoneOptions.find((o) => o.value === value)?.label ??
    timezoneOptions[0].label
  );
}
