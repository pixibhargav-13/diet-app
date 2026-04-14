import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WEEKLY_PLAN } from "./weeklyPlanData";

const PLAN_BY_DATE = WEEKLY_PLAN.reduce((acc, day) => {
    acc[day.date] = day;
    return acc;
}, {});
const EMPTY_LOGS = [];

function todayIsoDate() {
    return new Date().toISOString().split("T")[0];
}

function toMinutes(timeLabel) {
    const [time, period] = timeLabel.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

function makeLogId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function asNumber(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.round(parsed);
}

function createLogFromPlanMeal({ date, meal, source }) {
    const now = new Date();
    return {
        id: makeLogId(),
        planMealId: meal.id,
        date,
        source,
        loggedAt: now.toISOString(),
        mealName: meal.name,
        mealType: meal.type,
        plannedTime: meal.time,
        kcal: asNumber(meal.kcal),
        protein: asNumber(meal.protein),
        carbs: asNumber(meal.carbs),
        fat: asNumber(meal.fat),
    };
}

function createCustomLog({ date, mealName, mealType, kcal, protein, carbs, fat, fiber, source }) {
    const now = new Date();

    return {
        id: makeLogId(),
        date,
        source,
        loggedAt: now.toISOString(),
        mealName: mealName.trim(),
        mealType: mealType.trim(),
        kcal: asNumber(kcal),
        protein: asNumber(protein),
        carbs: asNumber(carbs),
        fat: asNumber(fat),
        fiber: asNumber(fiber),
    };
}

function getPlannedMeal(plan, mealId) {
    return plan?.meals?.find((meal) => meal.id === mealId) ?? null;
}

function findNextUnloggedMeal(plan, loggedPlanIds, nowDate = new Date()) {
    if (!plan) return null;

    const pendingMeals = plan.meals.filter((meal) => !loggedPlanIds.has(meal.id));
    if (!pendingMeals.length) return null;

    const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
    const upcoming = pendingMeals.find((meal) => toMinutes(meal.time) >= nowMinutes);

    return upcoming ?? pendingMeals[0];
}

function collectDaySummary(logs = []) {
    return logs.reduce(
        (summary, item) => {
            summary.consumedKcal += asNumber(item.kcal);
            summary.protein += asNumber(item.protein);
            summary.carbs += asNumber(item.carbs);
            summary.fat += asNumber(item.fat);
            summary.fiber += asNumber(item.fiber);
            return summary;
        },
        { consumedKcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
}

function normalizeLogsByDate(logsByDate = {}) {
    return Object.fromEntries(
        Object.entries(logsByDate).map(([date, logs]) => [
            date,
            (logs ?? []).map((log) => ({ id: log.id ?? makeLogId(), ...log })),
        ])
    );
}

export const useNutritionStore = create(
    persist(
        (set, get) => ({
            mealLogsByDate: {},

            getPlanForDate: (date = todayIsoDate()) => PLAN_BY_DATE[date] ?? null,
            getPlanForOffset: (offset = 0) => WEEKLY_PLAN[offset] ?? null,

            getLogsForDate: (date = todayIsoDate()) => get().mealLogsByDate[date] ?? EMPTY_LOGS,

            getLoggedPlannedMealIds: (date = todayIsoDate()) => {
                const logs = get().mealLogsByDate[date] ?? EMPTY_LOGS;
                return logs
                    .map((entry) => entry.planMealId)
                    .filter((planMealId) => Boolean(planMealId));
            },

            isPlannedMealLogged: (date = todayIsoDate(), mealId) => {
                const logs = get().mealLogsByDate[date] ?? EMPTY_LOGS;
                return logs.some((entry) => entry.planMealId === mealId);
            },

            getNextPlannedMealForDate: (date = todayIsoDate(), nowDate = new Date()) => {
                const plan = PLAN_BY_DATE[date];
                if (!plan) return null;

                const loggedIds = new Set(get().getLoggedPlannedMealIds(date));
                return findNextUnloggedMeal(plan, loggedIds, nowDate);
            },

            getDaySummary: (date = todayIsoDate()) => {
                const plan = PLAN_BY_DATE[date];
                const logs = get().mealLogsByDate[date] ?? EMPTY_LOGS;
                const totals = collectDaySummary(logs);

                return {
                    ...totals,
                    plannedGoalKcal: plan?.totalKcal ?? 0,
                    loggedCount: logs.length,
                };
            },

            quickLogPlannedMeal: (date = todayIsoDate(), mealId, source = "Quick Log") => {
                const plan = PLAN_BY_DATE[date];
                if (!plan) return { ok: false, reason: "NO_PLAN" };

                const meal = getPlannedMeal(plan, mealId);
                if (!meal) return { ok: false, reason: "MEAL_NOT_FOUND" };

                const existingLogs = get().mealLogsByDate[date] ?? EMPTY_LOGS;
                if (existingLogs.some((entry) => entry.planMealId === mealId)) {
                    return { ok: false, reason: "ALREADY_LOGGED", meal };
                }

                const nextLog = createLogFromPlanMeal({ date, meal, source });
                set((state) => ({
                    mealLogsByDate: {
                        ...state.mealLogsByDate,
                        [date]: [nextLog, ...(state.mealLogsByDate[date] ?? [])],
                    },
                }));

                return { ok: true, meal: nextLog };
            },

            quickLogNextMeal: (source = "Quick Log") => {
                const date = todayIsoDate();
                const meal = get().getNextPlannedMealForDate(date);

                if (!meal) return { ok: false, reason: "NO_PENDING_MEALS" };

                return get().quickLogPlannedMeal(date, meal.id, source);
            },

            logCustomMeal: ({ mealName, mealType, kcal, protein, carbs, fat, fiber, source = "Manual Log" }) => {
                const name = mealName?.trim();
                const type = mealType?.trim();
                if (!name || !type) return { ok: false, reason: "INVALID_INPUT" };

                const date = todayIsoDate();
                const nextLog = createCustomLog({
                    date,
                    mealName: name,
                    mealType: type,
                    kcal,
                    protein,
                    carbs,
                    fat,
                    fiber,
                    source,
                });

                set((state) => ({
                    mealLogsByDate: {
                        ...state.mealLogsByDate,
                        [date]: [nextLog, ...(state.mealLogsByDate[date] ?? [])],
                    },
                }));

                return { ok: true, meal: nextLog };
            },
        }),
        {
            name: "vitals-nutrition",
            version: 1,
            partialize: (state) => ({ mealLogsByDate: state.mealLogsByDate }),
            migrate: (persistedState) => {
                const state = persistedState ?? {};
                return {
                    ...state,
                    mealLogsByDate: normalizeLogsByDate(state.mealLogsByDate),
                };
            },
        }
    )
);
