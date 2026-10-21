import { service, type IMealService } from "../service/nutrition-service";
import type { RequestInfo } from "rwsdk/worker";
import { toResponse } from "../../utils/respond";

export interface MealController {
  create(requestInfo: RequestInfo): Promise<Response>;
  find(requestInfo: RequestInfo): Promise<Response>;
  list(requestInfo: RequestInfo): Promise<Response>;
  remove(requestInfo: RequestInfo): Promise<Response>;
  action(requestInfo: RequestInfo): Promise<Response>;
  update(requestInfo: RequestInfo): Promise<Response>;
}

export function createMealController(_service: IMealService): MealController {
  return {
    // POST /api/v1/meals -> 201 Created, 400 ved ugyldig input, 404 ukjent matvare
    async create({ request }: RequestInfo) {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return Response.json(
          { ok: false, error: { code: "400", message: "Ugyldig JSON" } },
          { status: 400 },
        );
      }
      return toResponse(await _service.create(body), 201);
    },
    async find(requestInfo: RequestInfo) {
      // Implement find logic here
      return new Response();
    },
    // GET /api/v1/meals?date=YYYY-MM-DD
    async list({ request }: RequestInfo) {
      const date = new URL(request.url).searchParams.get("date") ?? undefined;
      return toResponse(await _service.list({ date }));
    },
    async remove(requestInfo: RequestInfo) {
      // Implement remove logic here
      return new Response();
    },
    async action(requestInfo: RequestInfo) {
      // Implement action logic here
      return new Response();
    },
    async update(requestInfo: RequestInfo) {
      // Implement update logic here
      return new Response();
    },
  };
}

export const controller = createMealController(service);
