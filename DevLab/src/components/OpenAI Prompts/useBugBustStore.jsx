import { create } from "zustand";

export const useGameStore = create((set) => ({
  submittedCode: "",
  setSubmittedCode: (code) => set({ submittedCode: code }),

  isCorrect: null,
  setIsCorrect: (value) => set({ isCorrect: value }),

  showIsCorrect: false,
  setShowIsCorrect: (value) => set({ showIsCorrect: value }),
stageFeedbacks: {},
    // Add feedback for a stage
  addStageFeedback: (levelId, stageFeedback) =>
    set((state) => {
      const current = state?.stageFeedbacks[levelId] || [];
      return {
        stageFeedbacks: {
          ...state.stageFeedbacks,
          [levelId]: [...current, stageFeedback],
        },
      };
    }),

  // Get all feedback for a level
  getStageFeedbacks: (levelId) => get().stageFeedbacks[levelId] || [],

  // Clear feedback for a level
  clearStageFeedbacks: (levelId) =>
    set((state) => {
      const updated = { ...state.stageFeedbacks };
      delete updated[levelId];
      return { stageFeedbacks: updated };
    }),
}));
