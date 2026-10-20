import { Food } from "../types/type";

// Inneholder et lite, statisk datasett med matvarer og næringsverdier per 100 g.
const foodData = [
  {
    name: "Eple",
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    fatPer100g: 0.2,
    carbsPer100g: 14,
  },
  {
    name: "Banan",
    caloriesPer100g: 96,
    proteinPer100g: 1.3,
    fatPer100g: 0.3,
    carbsPer100g: 27,
  },
  {
    name: "Kyllingbryst",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    fatPer100g: 3.6,
    carbsPer100g: 0,
  },
  {
    name: "Laks",
    caloriesPer100g: 208,
    proteinPer100g: 20,
    fatPer100g: 13,
    carbsPer100g: 0,
  },
  {
    name: "Brokkoli",
    caloriesPer100g: 55,
    proteinPer100g: 3.7,
    fatPer100g: 0.6,
    carbsPer100g: 11,
  },
] as Food[];

export default foodData;
