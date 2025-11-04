// useAttemptStore_LocalPersist.jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAttemptStore = create(
  persist(
    (set, get) => ({
      heart: 3,
      maxHearts: 3,
      roundKey: 0,
      gameOver: false,

      loadHearts: () => {
        const { heart } = get();
        set({ gameOver: heart <= 0 });
      },

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

      resetHearts: () => {
        set({
          heart: get().maxHearts, // will be 3 normally, 5 if buff active
          roundKey: get().roundKey + 1,
          gameOver: false,
        });
      },

      // CodePatch: Restore +1 heart + increase max to 5 temporarily
      applyExtraLives: () => {
        const { heart } = get();
        const newHeart = Math.min(heart + 1, 5); // +1 but capped at 5

        set({
          maxHearts: 5,
          heart: newHeart,
          roundKey: get().roundKey + 1,
        });
      },

      //  Remove CodePatch buff after level complete or game over
      removeExtraLives: () => {
        const { heart } = get();
        const adjustedHeart = Math.min(heart, 3); // drop extra hearts

        set({
          maxHearts: 3,
          heart: adjustedHeart,
          roundKey: get().roundKey + 1,
        });
      },
    }),
    {
      name: "attempt-storage",
      getStorage: () => localStorage,
    }
  )
);
