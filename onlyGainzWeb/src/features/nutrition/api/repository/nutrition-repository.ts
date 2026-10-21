import mealsData from "../../../storage/meals.json";
import type { MealEntry } from "../../../types/type";
import { persistMeals } from "../../dev-persist";

// JSON-en bundles inn i workeren og leses ved oppstart. Nye måltider legges i minnet,
// og under `pnpm dev` skrives de i tillegg til meals.json (se dev-persist.ts).
const meals: MealEntry[] = [...(mealsData as unknown as MealEntry[])];

export interface IMealRepository {
  findAll(): Promise<MealEntry[]>;
  create(m: Omit<MealEntry, "id">): Promise<MealEntry>;
}

export function mealRepository(
  _db: MealEntry[],
  _persist?: (meals: MealEntry[]) => Promise<void>,
): IMealRepository {
  return {
    findAll: function (): Promise<MealEntry[]> {
      return Promise.resolve([..._db] as MealEntry[]);
    },
    async create(m) {
      const meal: MealEntry = { ...m, id: crypto.randomUUID() };
      // Lagre først: hvis skrivingen feiler, er minnet uendret og API-et svarer 500.
      await _persist?.([..._db, meal]);
      _db.push(meal);
      return meal;
    },
  };
}

export const repository = mealRepository(meals, persistMeals);
