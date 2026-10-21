// komponent for å lage et nytt måltid
import type { FormEvent } from "react";
export function CreateMealForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // her kan du legge til logikk for å sende data til API-et
    console.log("Form submitted");
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Måltid:
        <input type="text" name="mealName" />
        <input type="text" name="quantityGrams" />
        <input type="text" name="mealType" />
        <input type="text" name="date" />
      </label>
      <button type="submit">Legg til måltid</button>
    </form>
  );
}
