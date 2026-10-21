// Dato-hjelpere. Datoer er alltid "YYYY-MM-DD" i lokal tid (ikke UTC), slik at
// "i dag" og dagsbytte stemmer med klokka til brukeren.
const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const todayISO = () => toISODate(new Date());

// Kl. 12 unngår at sommertid-bytte flytter datoen ved utregning.
const parse = (date: string) => new Date(`${date}T12:00:00`);

export function shiftDate(date: string, days: number): string {
  const d = parse(date);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatDateLong(date: string): string {
  return parse(date).toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
