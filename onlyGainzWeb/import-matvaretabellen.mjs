// Importerer alle matvarer fra Matvaretabellen (matvaretabellen.no) til Appwrite-tabellen `foods`.
// Kjør: npm i node-appwrite  →  node import-matvaretabellen.mjs
// Krever env: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY (med rows.write), DATABASE_ID
import { Client, TablesDB } from 'node-appwrite';

const TABLE_ID = 'foods';
const CONCURRENCY = 10;

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);
const tablesDB = new TablesDB(client);

// Alle verdier i Matvaretabellen er per 100 g spiselig del
const nutrient = (food, id) =>
  food.constituents.find((c) => c.nutrientId === id)?.quantity ?? null;

function toRow(food, groups) {
  const defaultPortion = food.portions?.[0];
  return {
    name: food.foodName,
    brand: null,
    source: 'matvaretabellen',
    externalId: food.foodId,
    foodGroup: groups.get(food.foodGroupId) ?? null,
    caloriesPer100g: food.calories?.quantity ?? 0,
    proteinPer100g: nutrient(food, 'Protein'),
    carbsPer100g: nutrient(food, 'Karbo'),
    fatPer100g: nutrient(food, 'Fett'),
    fiberPer100g: nutrient(food, 'Fiber'),
    sugarPer100g: nutrient(food, 'Mono+Di'),
    saltPer100g: nutrient(food, 'NaCl'),
    servingSizeG: defaultPortion?.unit === 'g' ? defaultPortion.quantity : null,
    portionsJson: JSON.stringify(
      (food.portions ?? []).map((p) => ({ name: p.portionName, grams: p.quantity }))
    ),
    createdBy: null,
  };
}

const [{ foods }, { foodGroups }] = await Promise.all([
  fetch('https://www.matvaretabellen.no/api/nb/foods.json').then((r) => r.json()),
  fetch('https://www.matvaretabellen.no/api/nb/food-groups.json').then((r) => r.json()),
]);
const groups = new Map(foodGroups.map((g) => [g.foodGroupId, g.name]));
console.log(`Hentet ${foods.length} matvarer`);

let done = 0;
for (let i = 0; i < foods.length; i += CONCURRENCY) {
  await Promise.all(
    foods.slice(i, i + CONCURRENCY).map((food) =>
      // Stabil ID → upsert gjør at du kan kjøre scriptet på nytt når tabellen oppdateres (hver høst)
      tablesDB.upsertRow({
        databaseId: process.env.DATABASE_ID,
        tableId: TABLE_ID,
        rowId: `mvt-${food.foodId.replaceAll('.', '_')}`,
        data: toRow(food, groups),
      })
    )
  );
  done += Math.min(CONCURRENCY, foods.length - i);
  process.stdout.write(`\r${done}/${foods.length}`);
}
console.log('\nFerdig');
