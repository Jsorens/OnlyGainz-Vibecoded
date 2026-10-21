// nutrition-service.ts
import type { IMealRepository } from "../repository/nutrition-repository";
import { repository } from "../repository/nutrition-repository";
import type { IFoodRepository } from "../repository/food-repository";
import { repository as foodRepository } from "../repository/food-repository";
import type { MealEntry, MealType } from "../../../types/type";
import type { Result } from "../../../types/result";
import { macrosForFood } from "../../nutrition";

const round = (n: number, digits: number) => {
  const factor = 10 ** digits;
  return Math.round(n * factor) / factor;
};

export interface IMealService {
  list(filter?: { date?: string }): Promise<Result<MealEntry[]>>;
  // find, update, remove: legg til når du implementerer dem
  create(input: unknown): Promise<Result<MealEntry>>;
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const fail = (code: string, message: string): Result<never> => ({
  ok: false,
  error: { code, message },
});

export function createMealService(
  _repository: IMealRepository,
  _foods: IFoodRepository,
): IMealService {
  return {
    async list(filter) {
      try {
        const meals = await _repository.findAll();
        const data = filter?.date
          ? meals.filter((m) => m.date === filter.date)
          : meals;
        return { ok: true, data };
      } catch {
        return fail("500", "Kunne ikke hente måltider");
      }
    },

    async create(input) {
      // Validering først: feil her er klientens feil (400), ikke serverens.
      const body = (input ?? {}) as Record<string, unknown>;

      if (typeof body.foodId !== "string" || body.foodId === "")
        return fail("400", "foodId mangler");

      const grams = Number(body.quantityGrams);
      if (!Number.isFinite(grams) || grams <= 0 || grams > 5000)
        return fail("400", "Mengde må være mellom 1 og 5000 gram");

      if (!MEAL_TYPES.includes(body.mealType as MealType))
        return fail("400", "Ugyldig måltidstype");

      if (typeof body.date !== "string" || !DATE_PATTERN.test(body.date))
        return fail("400", "Dato må være på formatet YYYY-MM-DD");

      try {
        const food = await _foods.findById(body.foodId);
        if (!food) return fail("404", "Fant ikke matvaren");

        const macros = macrosForFood(food, grams);
        const created = await _repository.create({
          foodId: food.id,
          foodName: food.name,
          quantityGrams: grams,
          mealType: body.mealType as MealType,
          date: body.date,
          macros: {
            calories: round(macros.calories, 0),
            protein: round(macros.protein, 1),
            carbs: round(macros.carbs, 1),
            fat: round(macros.fat, 1),
          },
        });
        return { ok: true, data: created };
      } catch {
        return fail("500", "Kunne ikke opprette måltid");
      }
    },
  };
}

export const service = createMealService(repository, foodRepository);
