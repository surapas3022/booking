const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

export function parseISODate(value: unknown, fallback = todayISO()) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!ISO_DATE.test(trimmed)) return fallback;
  if (Number.isNaN(Date.parse(`${trimmed}T00:00:00+07:00`))) return fallback;
  return trimmed;
}

export function isPastDate(value: string) {
  return value < todayISO();
}

export function formatThaiDate(value: string) {
  const date = new Date(`${value}T00:00:00+07:00`);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeZone: "Asia/Bangkok",
  }).format(date);
}
