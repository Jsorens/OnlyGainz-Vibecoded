// Inneholder funksjoner for makroberegning og summering. Hold disse uavhengige av React.
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
