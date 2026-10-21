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
  // Makroene for denne mengden, lagret når måltidet ble registrert. Da stemmer
  // summene selv om matvarelisten (Matvaretabellen) endrer seg senere.
  macros?: Macros;
};

// Det klienten sender når et måltid registreres. Serveren slår opp foodName og lager id.
export type CreateMealInput = Pick<
  MealEntry,
  "foodId" | "quantityGrams" | "mealType" | "date"
>;

export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
