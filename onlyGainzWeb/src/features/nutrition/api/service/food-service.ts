import type { IFoodRepository } from "../repository/food-repository";
import { repository } from "../repository/food-repository";
import type { Food } from "../../../types/type";
import type { Result } from "../../../types/result";

export interface IFoodService {
  list(): Promise<Result<Food[]>>;
}

export function createFoodService(_repository: IFoodRepository): IFoodService {
  return {
    async list() {
      try {
        return { ok: true, data: await _repository.findAll() };
      } catch {
        return {
          ok: false,
          error: { code: "500", message: "Kunne ikke hente matvarer" },
        };
      }
    },
  };
}

export const service = createFoodService(repository);
