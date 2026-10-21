// Her setter vi opp REST-api routes for å ha alle routes knyttet til måltider og matvarer
// på et sted. Har også aktuelle interruptors (mellomvare)

import { route } from "rwsdk/router";
import { controller } from "../controller/nutrition-controller";
import { foodController } from "../controller/food-controller";

export const mealRoutes = [
  route("/api/v1/meals", {
    get: controller.list,
    post: controller.create,
  }),
  route("/api/v1/foods", {
    get: foodController.list,
  }),
];

export default mealRoutes;
