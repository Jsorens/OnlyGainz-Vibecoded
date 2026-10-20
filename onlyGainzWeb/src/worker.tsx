import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { mealRoutes } from "@/features/nutrition/nutrition-routes";
import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/home";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },

  // Add nutrition routes here if needed

  ...mealRoutes,

  render(Document, [route("/", Home)]),
]);
