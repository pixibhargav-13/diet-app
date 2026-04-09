import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOnboardingStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      isOnboardingComplete: false,
      setStep: (step) => set({ currentStep: step }),
      completeOnboarding: () => set({ isOnboardingComplete: true }),
      resetOnboarding: () => set({ currentStep: 1, isOnboardingComplete: false }),

      healthProfile: {
        conditions: [],
        allergies: '',
        dietaryPreference: '',
      },
      setHealthProfile: (data) =>
        set((s) => ({ healthProfile: { ...s.healthProfile, ...data } })),

      goal: '',
      setGoal: (goal) => set({ goal }),

      bmi: {
        age: '',
        gender: '',
        heightCm: '',
        weightKg: '',
        result: null,
        category: '',
      },
      setBmi: (data) => set((s) => ({ bmi: { ...s.bmi, ...data } })),

      documents: [],
      addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
      removeDocument: (name) =>
        set((s) => ({ documents: s.documents.filter((d) => d.name !== name) })),
    }),
    {
      name: 'vitals-onboarding',
    }
  )
)