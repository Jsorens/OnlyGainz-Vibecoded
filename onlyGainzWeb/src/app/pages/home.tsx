"use client";
import { useState } from "react";
import NutritionDashboard from "../../features/nutrition/components/NutritionDashboard.js";
import { todayISO } from "../../features/nutrition/utils/date.js";

export const Home = () => {
  // Valgt dato (YYYY-MM-DD). Dashboardet henter måltider og makroer for denne dagen.
  const [date, setDate] = useState<string>(todayISO());

  return <NutritionDashboard date={date} onDateChange={setDate} />;
};
