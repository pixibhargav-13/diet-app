import { create } from "zustand";
import { persist } from "zustand/middleware";
import demoUser, { adminDemoUser } from "./newUser";

function sanitizeDemoUser(account) {
  const userSafe = { ...account };
  delete userSafe.password;
  return userSafe;
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signUp: async ({ firstName, lastName, email }) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((r) => setTimeout(r, 800));
          const user = {
            id: crypto?.randomUUID
              ? crypto.randomUUID()
              : "local-" + Date.now(),
            firstName,
            lastName,
            email,
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
            role: "user",
          };
          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return { success: true, user };
        } catch (err) {
          const message =
            err?.response?.data?.message ?? "Sign up failed. Please try again.";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((r) => setTimeout(r, 400));

          const matchedAccount = [demoUser, adminDemoUser].find(
            (account) =>
              account.email === email && account.password === password,
          );

          if (matchedAccount) {
            const user = sanitizeDemoUser(matchedAccount);
            set({ user, isAuthenticated: true, isLoading: false, error: null });
            return { success: true, user };
          }

          set({ isLoading: false, error: "Incorrect email or password." });
          return { success: false, message: "Incorrect email or password." };
        } catch (err) {
          const message =
            err?.response?.data?.message ?? "Incorrect email or password.";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      markOnboardingComplete: () =>
        set((s) => ({
          user: s.user ? { ...s.user, onboardingComplete: true } : s.user,
        })),

      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "vitals-auth",
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
