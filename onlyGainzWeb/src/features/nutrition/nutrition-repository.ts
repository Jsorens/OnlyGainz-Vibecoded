import mealsData from "../storage/meals.json";
import type { MealEntry } from "../types/type";

// JSON-en bundles inn i workeren. Endringer lever kun i minnet.
const meals: MealEntry[] = [...(mealsData as unknown as MealEntry[])];

export interface IMealRepository {
  findAll(): Promise<MealEntry[]>;
  create(m: Omit<MealEntry, "id">): Promise<MealEntry>;
}

export function mealRepository(_db: MealEntry[]): IMealRepository {
  return {
    findAll: function (): Promise<MealEntry[]> {
      return Promise.resolve([..._db] as MealEntry[]);
      // throw new Error("Function not implemented.");
    },
    create(m) {
      const randomId = crypto.randomUUID();
      const meal: MealEntry = {
        ...m,
        id: randomId,
      };
      _db.push(meal);
      return Promise.resolve(meal);
    },
  };
}

export const repository = mealRepository(meals);
