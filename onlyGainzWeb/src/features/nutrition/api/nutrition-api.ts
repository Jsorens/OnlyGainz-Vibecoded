import type { Result } from "../../types/result";
import type { CreateMealInput, Food, MealEntry } from "../../types/type";

// Pakker ut { ok, data } fra API-et, eller kaster med feilmeldingen fra serveren.
async function unwrap<T>(response: Response): Promise<T> {
  const json = (await response.json()) as Result<T>;
  if (!json.ok) {
    throw new Error(json.error.message);
  }
  return json.data;
}

// henter måltider fra API-et, eventuelt for én dato (YYYY-MM-DD)
const getMeals = async (date?: string): Promise<MealEntry[]> => {
  let url = "/api/v1/meals";
  if (date) url += `?date=${encodeURIComponent(date)}`;
  return unwrap<MealEntry[]>(await fetch(url));
};

// henter alle matvarer (til dropdown-menyen)
const getFoods = async (): Promise<Food[]> =>
  unwrap<Food[]>(await fetch("/api/v1/foods"));

// registrerer et måltid
const createMeal = async (input: CreateMealInput): Promise<MealEntry> =>
  unwrap<MealEntry>(
    await fetch("/api/v1/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );

export default { getMeals, getFoods, createMeal };
