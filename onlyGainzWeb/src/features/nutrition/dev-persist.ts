import type { MealEntry } from "../types/type";

// Under `pnpm dev` sender vi måltidslisten til Vite-pluginen (vite-plugin-dev-json-storage.ts),
// som skriver den til meals.json. I produksjon gjør denne ingenting.
const isDev = () => Boolean(import.meta.env.VITE_IS_DEV_SERVER);

let origin: string | undefined;

// Kalles fra worker.tsx på hver request, slik at vi vet hvor dev-serveren kjører.
export function rememberOrigin(request: Request) {
  if (isDev()) origin = new URL(request.url).origin;
}

export async function persistMeals(meals: MealEntry[]): Promise<void> {
  if (!isDev() || !origin) return;

  const response = await fetch(`${origin}/__dev/meals`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meals),
  });
  if (!response.ok) {
    throw new Error(`Kunne ikke skrive meals.json (${response.status})`);
  }
}
