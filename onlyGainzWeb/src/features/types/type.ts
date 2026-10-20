export type Food = {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealEntry = {
  id: string;
  foodId: string;
  foodName: string;
  quantityGrams: number;
  mealType: MealType;
  date: string; // YYYY-MM-DD
};

export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
