import type { MealEntry } from "../types/type";

// Håndterer lagring, lasting og sletting av måltidsregistreringer i localStorage.
export function saveMeal(meal: MealEntry) {
  const meals = JSON.parse(localStorage.getItem("meals") || "[]");
  meals.push(meal);
  localStorage.setItem("meals", JSON.stringify(meals));
}
export function loadMeals() {
  return JSON.parse(localStorage.getItem("meals") || "[]");
}
export function deleteMeal(index: number) {
  const meals = JSON.parse(localStorage.getItem("meals") || "[]");
  meals.splice(index, 1);
  localStorage.setItem("meals", JSON.stringify(meals));
}
