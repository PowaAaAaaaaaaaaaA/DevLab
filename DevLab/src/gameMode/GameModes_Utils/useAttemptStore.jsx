// useAttemptStore_LocalPersist.jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAttemptStore = create(
  persist(
    (set, get) => ({
      heart: 3,       // starting hearts
      roundKey: 0,    // for forcing re-renders if needed
      gameOver: false,

      // mimic loadHearts
      loadHearts: () => {
        const { heart } = get();
        set({ gameOver: heart <= 0 });
      },

      // submit an attempt (decrease heart if wrong)
      submitAttempt: (isCorrect) => {
        const { heart, gameOver } = get();
        if (isCorrect || gameOver) return;

        const newHearts = Math.max(heart - 1, 0);
        set({
          heart: newHearts,
          gameOver: newHearts <= 0,
          roundKey: heart > 1 ? get().roundKey + 1 : get().roundKey,
        });
      },

      // reset hearts to full
      resetHearts: () => {
        set({
          heart: 3,
          roundKey: get().roundKey + 1,
          gameOver: false,
        });
      },
    }),
    {
      name: "attempt-storage",       // key in localStorage
      getStorage: () => localStorage, // use localStorage for persistence
    }
  )
);
