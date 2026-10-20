import { service, IMealService } from "./nutrition-service";
import type { RequestInfo } from "rwsdk/worker";
import type { MealEntry } from "../types/type";

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
    create: async ({ request }: RequestInfo) => {
      // Implement create logic here
      try {
        const body = await request.json();
        const result = await _service.create(body);
        return Response.json({ ok: true, data: result.ok }, { status: 201 });
      } catch (err) {
        return Response.json(
          {
            ok: false,
            error: { code: "500", message: "Kunne ikke opprette måltid" },
          },
          { status: 500 },
        );
      }
    },
    async find(requestInfo: RequestInfo) {
      // Implement find logic here
      return new Response();
    },
    async list({ request }: RequestInfo) {
      const date = new URL(request.url).searchParams.get("date") ?? undefined;
      const result = await _service.list({ date });

      if (!result.ok) {
        return Response.json(
          { ok: false, error: result.error },
          { status: Number(result.error.code) },
        );
      }

      return Response.json({ ok: true, data: result.data }, { status: 200 });
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
