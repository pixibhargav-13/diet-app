import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_DAILY_GOAL_ML = 2500;

const makeEntry = (ml, source = "Water Bottle", providedTime) => {
    const now = new Date();
    return {
        id:
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        ml,
        source,
        time:
            providedTime ??
            now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
};

const INITIAL_ENTRIES = [
    makeEntry(500, "Water Bottle", "10:45 AM"),
    makeEntry(250, "Green Tea", "09:15 AM"),
    makeEntry(750, "Morning Hydration", "07:30 AM"),
];

const withEntryIds = (entries = []) =>
    entries.map((entry) =>
        entry?.id
            ? entry
            : {
                ...entry,
                id:
                    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                        ? crypto.randomUUID()
                        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            }
    );

export const useHydrationStore = create(
    persist(
        (set) => ({
            entries: INITIAL_ENTRIES,
            goalMl: DEFAULT_DAILY_GOAL_ML,

            addEntry: (ml, source = "Water Bottle") => {
                if (!Number.isFinite(ml) || ml <= 0) return;
                const nextEntry = makeEntry(ml, source);
                set((state) => ({ entries: [nextEntry, ...state.entries] }));
            },

            setGoalMl: (goalMl) => {
                if (!Number.isFinite(goalMl) || goalMl < 250) return;
                set({ goalMl });
            },
        }),
        {
            name: "vitals-hydration",
            version: 1,
            migrate: (persistedState) => {
                const state = persistedState ?? {};
                return {
                    ...state,
                    entries: withEntryIds(state.entries),
                };
            },
            partialize: (state) => ({
                entries: state.entries,
                goalMl: state.goalMl,
            }),
        }
    )
);