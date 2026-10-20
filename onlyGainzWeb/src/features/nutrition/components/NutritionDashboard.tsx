"use client";
// Samler matvaresøk, registrering, måltidsliste og dagsoversikt. Del den videre opp dersom komponenten blir for stor.

import { useEffect, useState } from "react";
import type { MealEntry } from "../../types/type";
import nutritionApi from "@/features/nutrition/nutrition-api";
import { CreateMealForm } from "./CreateMealForm";
const NutritionDashboard = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setMeals(await nutritionApi.getMeals());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div>
      <h1>Nutrition Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {meals.map((meal, index) => (
            <li key={index}>
              {meal.foodName} - Quantity: {meal.quantityGrams}g - Meal Type:{" "}
              {meal.mealType} - Date: {meal.date}
            </li>
          ))}
        </ul>
      )}
      <CreateMealForm />
    </div>
  );
};

export default NutritionDashboard;
