import { create } from "zustand";

export const useGameStore = create((set) => ({

  submittedCode: "",
  setSubmittedCode: (code) => set({ submittedCode: code }),

  isCorrect: null,
  setIsCorrect: (value) => set({ isCorrect: value }),

  showIsCorrect: false,
  setShowIsCorrect: (value) => set({ showIsCorrect: value }),

isEvaluating: false,
setIsEvaluating: (value) => set({ isEvaluating: value }),


  loading: false,
  setLoading: (value) => set({ loading: value }),

  stageFeedbacks: [],

  // Add a feedback entry (from AI evaluation)
  addStageFeedback: (feedback) =>
    set((state) => ({
      stageFeedbacks: [...state.stageFeedbacks, feedback],
    })),

  // Get all collected feedback
  getAllFeedbacks: () => get().stageFeedbacks,

  // Clear all feedback (e.g. at end of level)
  clearAllFeedbacks: () => set({ stageFeedbacks: [] }),
}));
