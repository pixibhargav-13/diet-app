// Auth store — handles signup, login, logout state until backend is ready
// Persisted to localStorage via zustand/middleware
import { create } from "zustand";
import { persist } from "zustand/middleware";

const mockNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 800));

export const useAuthStore = create(
  persist(
    (set) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Sign up ────────────────────────────────────────────────────────────
      signUp: async ({ firstName, lastName, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          if (!password) {
            throw new Error("Password is required.");
          }

          await mockNetworkDelay();

          const user = {
            id: crypto.randomUUID(),
            firstName,
            lastName,
            email,
            createdAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return { success: true };
        } catch (err) {
          const message =
            err?.response?.data?.message ?? "Sign up failed. Please try again.";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ── Login ──────────────────────────────────────────────────────────────
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          if (!password) {
            throw new Error("Password is required.");
          }

          await mockNetworkDelay();

          const firstName = email.split("@")[0];
          const user = {
            id: crypto.randomUUID(),
            firstName,
            lastName: "",
            email,
            createdAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return { success: true };
        } catch (err) {
          const message =
            err?.response?.data?.message ?? "Incorrect email or password.";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ── Logout ─────────────────────────────────────────────────────────────
      logout: () => set({ user: null, isAuthenticated: false, error: null }),

      // ── Helpers ────────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: "vitals-auth", // localStorage key — separate from onboarding store
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
