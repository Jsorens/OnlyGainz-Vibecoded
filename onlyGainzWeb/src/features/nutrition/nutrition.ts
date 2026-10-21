// Inneholder funksjoner for makroberegning og summering. Hold disse uavhengige av React.
import type { Food, Macros } from "../types/type";

export function calculateMacros(
  foodItem: { calories: number; protein: number; fat: number; carbs: number },
  amount: number,
) {
  return {
    calories: (foodItem.calories * amount) / 100,
    protein: (foodItem.protein * amount) / 100,
    fat: (foodItem.fat * amount) / 100,
    carbs: (foodItem.carbs * amount) / 100,
  };
}

// Makroer for en gitt mengde (gram) av en matvare fra foods.json.
export function macrosForFood(food: Food, grams: number): Macros {
  return calculateMacros(
    {
      calories: food.caloriesPer100g,
      protein: food.proteinPer100g,
      fat: food.fatPer100g,
      carbs: food.carbsPer100g,
    },
    grams,
  );
}

export function sumMacros(
  macrosArray: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }[],
) {
  return macrosArray.reduce(
    (acc, macros) => {
      acc.calories += macros.calories;
      acc.protein += macros.protein;
      acc.fat += macros.fat;
      acc.carbs += macros.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  );
}
