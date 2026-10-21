"use client";
// Samler matvarevalg, registrering, måltidsliste og dagsoversikt for én valgt dato.
// Datoen eies av home.tsx og kommer inn som prop, slik at siden styrer hvilken dag som vises.
import { useEffect, useMemo, useState, type FormEvent } from "react";
import nutritionApi from "@/features/nutrition/api/nutrition-api.js";
import { macrosForFood, sumMacros } from "../nutrition.js";
import { formatDateLong, shiftDate, todayISO } from "../utils/date.js";
import type { Food, MealEntry, MealType } from "../../types/type.js";
import styles from "./NutritionDashboard.module.css";

type Props = {
  date: string;
  onDateChange: (date: string) => void;
};

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Frokost" },
  { value: "lunch", label: "Lunsj" },
  { value: "dinner", label: "Middag" },
  { value: "snack", label: "Snacks" },
];

const QUANTITY_PRESETS = [50, 100, 150, 200, 250];
const MAX_VISIBLE_FOODS = 200;

const fmt = (n: number, digits = 0) =>
  n.toLocaleString("nb-NO", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Noe gikk galt";

const NutritionDashboard = ({ date, onDateChange }: Props) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // skjema
  const [foodId, setFoodId] = useState("");
  const [foodQuery, setFoodQuery] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [mealType, setMealType] = useState<MealType>("breakfast");

  // Matvarer hentes én gang.
  useEffect(() => {
    nutritionApi
      .getFoods()
      .then((list) =>
        setFoods([...list].sort((a, b) => a.name.localeCompare(b.name, "nb"))),
      )
      .catch((err) => setError(errorMessage(err)));
  }, []);

  // Måltider hentes på nytt hver gang datoen endres.
  useEffect(() => {
    let cancelled = false;
    setLoadingMeals(true);
    setError(null);
    nutritionApi
      .getMeals(date)
      .then((list) => {
        if (!cancelled) setMeals(list);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoadingMeals(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const foodsById = useMemo(
    () => new Map(foods.map((f) => [f.id, f])),
    [foods],
  );

  const selectedFood = foodsById.get(foodId);

  // Matvaretabellen har flere tusen matvarer, så listen filtreres av søkefeltet
  // og kuttes av. Valgt matvare tas alltid med, så den ikke forsvinner fra menyen.
  const query = foodQuery.trim().toLocaleLowerCase("nb");
  const matches = query
    ? foods.filter((f) => f.name.toLocaleLowerCase("nb").includes(query))
    : foods;
  const visibleFoods = matches.slice(0, MAX_VISIBLE_FOODS);
  if (selectedFood && !visibleFoods.includes(selectedFood)) {
    visibleFoods.unshift(selectedFood);
  }
  const grams = Number(quantity);
  const validQuantity = Number.isFinite(grams) && grams > 0 && grams <= 5000;

  // Forhåndsvisning av makroer for valgt matvare og mengde.
  const preview =
    selectedFood && validQuantity ? macrosForFood(selectedFood, grams) : null;

  // Makroene som ble lagret sammen med måltidet har forrang. Eldre måltider uten
  // lagrede makroer regnes ut fra matvarelisten, hvis matvaren finnes der.
  const macrosOfMeal = (meal: MealEntry) => {
    if (meal.macros) return meal.macros;
    const food = foodsById.get(meal.foodId);
    return food ? macrosForFood(food, meal.quantityGrams) : null;
  };

  const totals = useMemo(
    () =>
      sumMacros(
        meals.flatMap((m) => {
          const macros = macrosOfMeal(m);
          return macros ? [macros] : [];
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meals, foodsById],
  );

  // Fordeling av energi: protein og karbo gir 4 kcal/g, fett 9 kcal/g.
  const energy = {
    protein: totals.protein * 4,
    carbs: totals.carbs * 4,
    fat: totals.fat * 9,
  };
  const energyTotal = energy.protein + energy.carbs + energy.fat;
  const share = (kcal: number) =>
    energyTotal > 0 ? (kcal / energyTotal) * 100 : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFood || !validQuantity) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await nutritionApi.createMeal({
        foodId: selectedFood.id,
        quantityGrams: grams,
        mealType,
        date,
      });
      setMeals((prev) => [...prev, created]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isToday = date === todayISO();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>OnlyGainz</p>
          <h1 className={styles.title}>Kostholdsdagbok</h1>
          <p className={styles.dateLong}>{formatDateLong(date)}</p>
        </div>

        <div className={styles.dateNav}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Forrige dag"
            onClick={() => onDateChange(shiftDate(date, -1))}
          >
            ‹
          </button>
          <input
            type="date"
            className={styles.dateInput}
            aria-label="Velg dato"
            value={date}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Neste dag"
            onClick={() => onDateChange(shiftDate(date, 1))}
          >
            ›
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            disabled={isToday}
            onClick={() => onDateChange(todayISO())}
          >
            I dag
          </button>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {/* Dagsoversikt */}
      <section className={styles.card} aria-label="Dagsoversikt">
        <div className={styles.summary}>
          <div className={styles.kcal}>
            <span className={styles.kcalValue}>{fmt(totals.calories)}</span>
            <span className={styles.kcalUnit}>kcal</span>
          </div>

          <dl className={styles.macroTotals}>
            <div>
              <dt>
                <i className={`${styles.dot} ${styles.protein}`} />
                Protein
              </dt>
              <dd>{fmt(totals.protein, 1)} g</dd>
            </div>
            <div>
              <dt>
                <i className={`${styles.dot} ${styles.carbs}`} />
                Karbohydrater
              </dt>
              <dd>{fmt(totals.carbs, 1)} g</dd>
            </div>
            <div>
              <dt>
                <i className={`${styles.dot} ${styles.fat}`} />
                Fett
              </dt>
              <dd>{fmt(totals.fat, 1)} g</dd>
            </div>
          </dl>
        </div>

        <div
          className={styles.bar}
          role="img"
          aria-label={
            energyTotal > 0
              ? `Energifordeling: ${fmt(share(energy.protein))} % protein, ${fmt(share(energy.carbs))} % karbohydrater, ${fmt(share(energy.fat))} % fett`
              : "Ingen måltider registrert"
          }
        >
          <span
            className={styles.protein}
            style={{ width: `${share(energy.protein)}%` }}
          />
          <span
            className={styles.carbs}
            style={{ width: `${share(energy.carbs)}%` }}
          />
          <span
            className={styles.fat}
            style={{ width: `${share(energy.fat)}%` }}
          />
        </div>
        <p className={styles.barCaption}>
          {energyTotal > 0
            ? `Energifordeling: ${fmt(share(energy.protein))} % protein · ${fmt(share(energy.carbs))} % karbo · ${fmt(share(energy.fat))} % fett`
            : "Legg til et måltid for å se fordelingen"}
        </p>
      </section>

      <div className={styles.columns}>
        {/* Registrering */}
        <section className={styles.card} aria-labelledby="add-heading">
          <h2 id="add-heading" className={styles.cardTitle}>
            Legg til måltid
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="food-search">
                Matvare
              </label>
              <input
                id="food-search"
                className={styles.input}
                type="search"
                placeholder="Søk, for eksempel «laks» …"
                value={foodQuery}
                onChange={(e) => setFoodQuery(e.target.value)}
                disabled={foods.length === 0}
              />
              <select
                className={styles.select}
                aria-label="Velg matvare"
                value={foodId}
                onChange={(e) => setFoodId(e.target.value)}
                disabled={foods.length === 0}
              >
                <option value="">
                  {foods.length === 0
                    ? "Laster matvarer …"
                    : matches.length === 0
                      ? "Ingen treff"
                      : `Velg matvare … (${fmt(matches.length)} treff)`}
                </option>
                {visibleFoods.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} · {fmt(f.caloriesPer100g)} kcal
                  </option>
                ))}
              </select>
              <span className={styles.hint}>
                {selectedFood
                  ? `Per 100 g: ${fmt(selectedFood.proteinPer100g, 1)} g protein · ${fmt(selectedFood.carbsPer100g, 1)} g karbo · ${fmt(selectedFood.fatPer100g, 1)} g fett`
                  : matches.length > MAX_VISIBLE_FOODS
                    ? `Viser ${MAX_VISIBLE_FOODS} av ${fmt(matches.length)}. Søk for å snevre inn.`
                    : "Kalorier vises per 100 g"}
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="quantity">
                Mengde (gram)
              </label>
              <input
                id="quantity"
                className={styles.input}
                type="number"
                inputMode="decimal"
                min={1}
                max={5000}
                step={5}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                aria-invalid={!validQuantity}
              />
              <div className={styles.chips}>
                {QUANTITY_PRESETS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`${styles.chip} ${grams === g ? styles.chipActive : ""}`}
                    onClick={() => setQuantity(String(g))}
                  >
                    {g} g
                  </button>
                ))}
              </div>
              {!validQuantity && (
                <span className={styles.hintError}>
                  Mengden må være mellom 1 og 5000 gram
                </span>
              )}
            </div>

            <fieldset className={styles.field}>
              <legend className={styles.label}>Måltid</legend>
              <div className={styles.segmented}>
                {MEAL_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className={`${styles.segment} ${mealType === t.value ? styles.segmentActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="mealType"
                      value={t.value}
                      checked={mealType === t.value}
                      onChange={() => setMealType(t.value)}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Makroer for valgt mengde */}
            <div className={styles.preview} aria-live="polite">
              <div>
                <span className={styles.previewValue}>
                  {preview ? fmt(preview.calories) : "–"}
                </span>
                <span className={styles.previewLabel}>kcal</span>
              </div>
              <div>
                <span
                  className={`${styles.previewValue} ${styles.proteinText}`}
                >
                  {preview ? fmt(preview.protein, 1) : "–"}
                </span>
                <span className={styles.previewLabel}>protein</span>
              </div>
              <div>
                <span className={`${styles.previewValue} ${styles.carbsText}`}>
                  {preview ? fmt(preview.carbs, 1) : "–"}
                </span>
                <span className={styles.previewLabel}>karbo</span>
              </div>
              <div>
                <span className={`${styles.previewValue} ${styles.fatText}`}>
                  {preview ? fmt(preview.fat, 1) : "–"}
                </span>
                <span className={styles.previewLabel}>fett</span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={!selectedFood || !validQuantity || submitting}
            >
              {submitting ? "Legger til …" : `Legg til på ${formatShort(date)}`}
            </button>
          </form>
        </section>

        {/* Måltidsliste */}
        <section className={styles.card} aria-labelledby="meals-heading">
          <h2 id="meals-heading" className={styles.cardTitle}>
            Måltider
          </h2>

          {loadingMeals ? (
            <p className={styles.muted}>Laster …</p>
          ) : meals.length === 0 ? (
            <p className={styles.empty}>
              Ingen måltider registrert denne dagen.
            </p>
          ) : (
            MEAL_TYPES.map((type) => {
              const group = meals.filter((m) => m.mealType === type.value);
              if (group.length === 0) return null;
              const groupKcal = group.reduce(
                (sum, m) => sum + (macrosOfMeal(m)?.calories ?? 0),
                0,
              );
              return (
                <div key={type.value} className={styles.group}>
                  <div className={styles.groupHeader}>
                    <h3>{type.label}</h3>
                    <span>{fmt(groupKcal)} kcal</span>
                  </div>
                  <ul className={styles.list}>
                    {group.map((meal) => {
                      const m = macrosOfMeal(meal);
                      return (
                        <li key={meal.id} className={styles.item}>
                          <div>
                            <span className={styles.itemName}>
                              {meal.foodName}
                            </span>
                            <span className={styles.itemMeta}>
                              {fmt(meal.quantityGrams)} g
                            </span>
                          </div>
                          <div className={styles.itemMacros}>
                            {m ? (
                              <>
                                <strong>{fmt(m.calories)} kcal</strong>
                                <span>
                                  P {fmt(m.protein, 1)} · K {fmt(m.carbs, 1)} ·
                                  F {fmt(m.fat, 1)}
                                </span>
                              </>
                            ) : (
                              <span>Ukjent matvare</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
};

// "21. oktober" – kort dato til knappen
function formatShort(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
  });
}

export default NutritionDashboard;
