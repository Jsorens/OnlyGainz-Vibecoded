import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { mealRoutes } from "@/features/nutrition/api/routes/nutrition-routes";
import { rememberOrigin } from "@/features/nutrition/dev-persist";
import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/home";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx, request }) => {
    // setup ctx here
    ctx;
    // Dev: husk hvor serveren kjører, så måltider kan skrives til meals.json
    rememberOrigin(request);
  },

  // Add nutrition routes here if needed

  ...mealRoutes,

  render(Document, [route("/", Home)]),
]);
