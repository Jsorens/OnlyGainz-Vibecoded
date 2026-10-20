export const TITLE_MAX_LENGTH = 200;
export const TIME_ZONE = "Europe/Oslo";

export function defaultDueDate() {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  return now;
}

export const startOfToday = (now: Date) => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
  }).format(now);
  return new Date(`${today}T00:00:00.000Z`);
};
