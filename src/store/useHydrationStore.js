import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_DAILY_GOAL_ML = 2500;

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

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

const makeEntryId = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

function createDailyBucket(dateKey = getTodayKey()) {
    return {
        dateKey,
        entriesByDate: {
            [dateKey]: [],
        },
    };
}

function normalizeEntriesByDate(entriesByDate = {}) {
    return Object.fromEntries(
        Object.entries(entriesByDate).map(([dateKey, entries]) => [
            dateKey,
            (entries ?? []).map((entry) => ({
                ...entry,
                id: entry?.id ?? makeEntryId(),
            })),
        ])
    );
}

function syncToToday(state) {
    const todayKey = getTodayKey();
    if (state.dateKey === todayKey && state.entriesByDate[todayKey]) {
        return state;
    }

    return {
        ...state,
        dateKey: todayKey,
        entriesByDate: {
            ...state.entriesByDate,
            [todayKey]: state.entriesByDate[todayKey] ?? [],
        },
    };
}

export const useHydrationStore = create(
    persist(
        (set, get) => ({
            ...createDailyBucket(),
            goalMl: DEFAULT_DAILY_GOAL_ML,

            ensureToday: () => {
                set((state) => syncToToday(state));
            },

            getEntriesForDate: (dateKey = getTodayKey()) => {
                const state = syncToToday(get());
                return state.entriesByDate[dateKey] ?? [];
            },

            addEntry: (ml, source = "Water Bottle") => {
                if (!Number.isFinite(ml) || ml <= 0) return;
                const nextEntry = makeEntry(ml, source);
                set((state) => {
                    const synced = syncToToday(state);
                    const dateKey = synced.dateKey;
                    const currentEntries = synced.entriesByDate[dateKey] ?? [];

                    return {
                        ...synced,
                        entriesByDate: {
                            ...synced.entriesByDate,
                            [dateKey]: [nextEntry, ...currentEntries],
                        },
                    };
                });
            },

            subtractEntry: (ml, source) => {
                const amount = Number(ml);
                if (!Number.isFinite(amount) || amount <= 0) return;

                set((state) => {
                    const synced = syncToToday(state);
                    const dateKey = synced.dateKey;
                    const currentEntries = synced.entriesByDate[dateKey] ?? [];
                    let remaining = amount;
                    const nextEntries = [];

                    for (const entry of currentEntries) {
                        const matchesSource = source ? entry.source === source : true;

                        if (!matchesSource || remaining <= 0) {
                            nextEntries.push(entry);
                            continue;
                        }

                        if (entry.ml > remaining) {
                            nextEntries.push({
                                ...entry,
                                ml: entry.ml - remaining,
                            });
                            remaining = 0;
                            continue;
                        }

                        remaining -= entry.ml;
                    }

                    return {
                        ...synced,
                        entriesByDate: {
                            ...synced.entriesByDate,
                            [dateKey]: nextEntries,
                        },
                    };
                });
            },

            setGoalMl: (goalMl) => {
                if (!Number.isFinite(goalMl) || goalMl < 250) return;
                set({ goalMl });
            },
        }),
        {
            name: "vitals-hydration",
            version: 2,
            migrate: (persistedState) => {
                const state = persistedState ?? {};
                return {
                    ...createDailyBucket(),
                    goalMl: Number.isFinite(state.goalMl) ? state.goalMl : DEFAULT_DAILY_GOAL_ML,
                    entriesByDate: normalizeEntriesByDate(state.entriesByDate),
                };
            },
            partialize: (state) => ({
                dateKey: state.dateKey,
                entriesByDate: state.entriesByDate,
                goalMl: state.goalMl,
            }),
        }
    )
);