import type { Result } from "../types/result";
import type { MealEntry } from "../types/type";

// henter måltider fra API-et
const getMeals = async (date?: string): Promise<MealEntry[]> => {
  let url = "/api/v1/meals";
  if (date) url += `?date=${encodeURIComponent(date)}`;

  const response = await fetch(url);
  const json = (await response.json()) as Result<MealEntry[]>;

  if (!json.ok) {
    throw new Error(json.error.message);
  }
  return json.data;
};

export default { getMeals };
