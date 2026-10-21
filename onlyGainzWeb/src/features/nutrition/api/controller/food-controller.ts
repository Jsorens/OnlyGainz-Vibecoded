import type { RequestInfo } from "rwsdk/worker";
import { service, type IFoodService } from "../service/food-service";
import { toResponse } from "../../utils/respond";

export interface FoodController {
  list(requestInfo: RequestInfo): Promise<Response>;
}

export function createFoodController(_service: IFoodService): FoodController {
  return {
    async list() {
      return toResponse(await _service.list()); // 200 eller 500
    },
  };
}

export const foodController = createFoodController(service);
