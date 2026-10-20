// Her setter vi opp REST-api routes for å ha alle routes knyttet til tasks
// på et sted. Har også aktuelle interruptors (mellomvare)

import { route } from "rwsdk/router";
import { controller } from "./nutrition-controller";

export const mealRoutes = [
  route("/api/v1/meals", {
    get: controller.list,
  }),
];

export default mealRoutes;
