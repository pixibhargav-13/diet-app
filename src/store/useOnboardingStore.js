// Onboarding-only store — auth state lives in useAuthStore
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOnboardingStore = create(
  persist(
    (set) => ({
      // ── Step progress ──────────────────────────────────────────────────────
      currentStep: 1,
      isOnboardingComplete: false,
      setStep: (step) => set({ currentStep: step }),
      completeOnboarding: () => set({ isOnboardingComplete: true }),
      resetOnboarding: () => set({ currentStep: 1, isOnboardingComplete: false }),

      // ── Step 1 — Health profile ────────────────────────────────────────────
      healthProfile: {
        conditions: [],        // ['diabetes','thyroid','pcod','allergies','none']
        allergies: '',         // free text when 'allergies' is selected
        dietaryPreference: '', // 'veg' | 'non-veg' | 'vegan'
      },
      setHealthProfile: (data) =>
        set((s) => ({ healthProfile: { ...s.healthProfile, ...data } })),

      // ── Step 2 — Goal ──────────────────────────────────────────────────────
      goal: '', // 'weight-loss' | 'weight-gain' | 'muscle-gain' | 'disease-management' | 'maintenance'
      setGoal: (goal) => set({ goal }),

      // ── Step 3 — BMI ───────────────────────────────────────────────────────
      bmi: {
        age: '',
        gender: '',      // 'male' | 'female' | 'other'
        heightCm: '',
        weightKg: '',
        result: null,    // numeric BMI
        category: '',    // 'Underweight' | 'Normal' | 'Overweight' | 'Obese'
      },
      setBmi: (data) => set((s) => ({ bmi: { ...s.bmi, ...data } })),

      // ── Step 4 — Documents ─────────────────────────────────────────────────
      // Stores metadata only — actual File objects cannot be serialised to localStorage
      documents: [], // [{ name, size, type, uploadedAt }]
      addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
      removeDocument: (name) =>
        set((s) => ({ documents: s.documents.filter((d) => d.name !== name) })),
    }),
    {
      name: 'vitals-onboarding',
    }
  )
)