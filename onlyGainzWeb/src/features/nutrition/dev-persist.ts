import type { MealEntry } from "../types/type";

// Under `pnpm dev` sender vi måltidslisten til Vite-pluginen (vite-plugin-dev-json-storage.ts),
// som skriver den til meals.json. I produksjon (ikke localhost) gjør denne ingenting.
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

let origin: string | undefined;

// Kalles fra worker.tsx på hver request, slik at vi vet hvor dev-serveren kjører.
export function rememberOrigin(request: Request) {
  const url = new URL(request.url);
  if (LOCAL_HOSTS.includes(url.hostname)) origin = url.origin;
}

export async function persistMeals(meals: MealEntry[]): Promise<void> {
  if (!origin) {
    console.warn("[dev-persist] Ukjent dev-server, meals.json ble ikke oppdatert");
    return;
  }

  const response = await fetch(`${origin}/__dev/meals`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meals),
  });
  if (!response.ok) {
    throw new Error(`Kunne ikke skrive meals.json (${response.status})`);
  }
  console.log(`[dev-persist] Skrev ${meals.length} måltider til meals.json`);
}
