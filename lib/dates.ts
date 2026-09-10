export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
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
