import fallbackFoods from "../../../storage/foods.json";
import type { Food } from "../../../types/type";

const FOODS_URL = "https://www.matvaretabellen.no/api/nb/foods.json";

// Det vi trenger fra Matvaretabellens JSON. Verdiene er oppgitt per 100 g.
type ApiConstituent = { nutrientId: string; quantity?: number };
type ApiFood = {
  foodId: string;
  foodName: string;
  calories?: { quantity?: number };
  constituents?: ApiConstituent[];
};

const nutrient = (food: ApiFood, nutrientId: string) =>
  food.constituents?.find((c) => c.nutrientId === nutrientId)?.quantity ?? 0;

function toFood(f: ApiFood): Food {
  return {
    id: f.foodId,
    name: f.foodName,
    caloriesPer100g: f.calories?.quantity ?? 0,
    proteinPer100g: nutrient(f, "Protein"),
    carbsPer100g: nutrient(f, "Karbo"),
    fatPer100g: nutrient(f, "Fett"),
  };
}

// Henter matvarer fra Matvaretabellen og plukker ut det vi trenger.
export async function fetchFoodsFromApi(): Promise<Food[]> {
  const response = await fetch(FOODS_URL, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Matvaretabellen svarte ${response.status}`);
  }
  const json = (await response.json()) as { foods?: ApiFood[] };

  // Hopp over matvarer uten kaloriverdi, de kan ikke brukes til makroberegning.
  return (json.foods ?? [])
    .filter((f) => typeof f.calories?.quantity === "number")
    .map(toFood);
}

// Faller tilbake til den lokale foods.json hvis API-et ikke kan nås.
async function loadFoods(): Promise<Food[]> {
  try {
    return await fetchFoodsFromApi();
  } catch (err) {
    console.warn(
      "Kunne ikke hente fra Matvaretabellen, bruker foods.json",
      err,
    );
    return fallbackFoods as Food[];
  }
}

export interface IFoodRepository {
  findAll(): Promise<Food[]>;
  findById(id: string): Promise<Food | undefined>;
}

export function foodRepository(_load: () => Promise<Food[]>): IFoodRepository {
  // Filen er stor, så den hentes én gang og gjenbrukes mens workeren lever.
  let cache: Promise<{ list: Food[]; byId: Map<string, Food> }> | undefined;

  const loaded = () => {
    cache ??= _load().then((list) => ({
      list,
      byId: new Map(list.map((f) => [f.id, f])),
    }));
    return cache;
  };

  return {
    findAll: async () => [...(await loaded()).list],
    findById: async (id) => (await loaded()).byId.get(id),
  };
}

export const repository = foodRepository(loadFoods);
