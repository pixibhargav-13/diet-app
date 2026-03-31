import { create } from "zustand";
import demoUser from "./newUser";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signUp: async ({ firstName, lastName, email }) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      const user = {
        id: crypto?.randomUUID ? crypto.randomUUID() : "local-" + Date.now(),
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      };

      // In-memory only for UI testing
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return { success: true, user };
    } catch (err) {
      const message =
        err?.response?.data?.message ?? "Sign up failed. Please try again.";
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // ── Login ──────────────────────────────────────────────────────────────
  // Placeholder — swap the body for a real API call when backend is ready
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 400));

      // Only accept the demo user's credentials for quick UI testing
      if (email === demoUser.email && password === demoUser.password) {
        const userSafe = { ...demoUser };
        delete userSafe.password;
        set({
          user: userSafe,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user: userSafe };
      }

      // Allow any email/password for signUp-created users (handled in signUp)
      set({ isLoading: false, error: "Incorrect email or password." });
      return { success: false, message: "Incorrect email or password." };
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
}));
