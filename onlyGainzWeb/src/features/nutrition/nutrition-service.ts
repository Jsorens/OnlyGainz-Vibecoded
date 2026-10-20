// nutrition-service.ts
import type { IMealRepository } from "./nutrition-repository";
import { repository } from "./nutrition-repository";
import type { MealEntry } from "../types/type";
import type { Result } from "../types/result";

export interface IMealService {
  list(filter?: { date?: string }): Promise<Result<MealEntry[]>>;
  // create, find, update, remove: legg til når du implementerer dem
  create(input: unknown): Promise<Result<MealEntry>>;
}

export function createMealService(_repository: IMealRepository): IMealService {
  return {
    async list(filter) {
      try {
        const meals = await _repository.findAll();
        const data = filter?.date
          ? meals.filter((m) => m.date === filter.date)
          : meals;
        return { ok: true, data };
      } catch {
        return {
          ok: false,
          error: { code: "500", message: "Kunne ikke hente måltider" },
        };
      }
    },
    async create(input) {
      try {
        const createdMeal = await _repository.create(input as MealEntry);
        return { ok: true, data: createdMeal };
      } catch {
        return {
          ok: false,
          error: { code: "500", message: "Kunne ikke opprette måltid" },
        };
      }
    },
  };
}

export const service = createMealService(repository);
