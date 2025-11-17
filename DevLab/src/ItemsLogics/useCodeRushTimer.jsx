import { useEffect, useState } from "react";
import { useInventoryStore } from "./Items-Store/useInventoryStore";

export default function useCodeRushTimer(
  initialTime,
  gamemodeId,
  gameModeData,
  showPopup,
  pauseTimer,
  resetSignal
) {
  const [timer, setTimer] = useState(1);
  const [buffApplied, setBuffApplied] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [buffType, setBuffType] = useState("");

  const activeBuffs = useInventoryStore((state) => state.activeBuffs);
  const { removeBuff } = useInventoryStore.getState();

  const STORAGE_KEY = `coderush_remaining_${gamemodeId}`;
  const TICK_KEY = `coderush_last_tick_${gamemodeId}`;

  // ----------------- INIT TIMER (WITH REFRESH-SAFE CHECK) -----------------
  useEffect(() => {
    if (gamemodeId !== "CodeRush") return;
    if (initialTime == null || initialTime <= 0) return;

    const savedRemaining = localStorage.getItem(STORAGE_KEY);
    const savedTick = localStorage.getItem(TICK_KEY);

    if (savedRemaining && savedTick) {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - parseInt(savedTick, 10);
      const newTime = Math.max(parseInt(savedRemaining, 10) - elapsed, 0);

      setTimer(newTime);
      return;
    }

    // No saved timer → start fresh
    setTimer(initialTime);
    localStorage.setItem(STORAGE_KEY, initialTime);
    localStorage.setItem(TICK_KEY, Math.floor(Date.now() / 1000));
  }, [gamemodeId, initialTime]);



//   // Debugging: log timer updates
// useEffect(() => {
//   if (gamemodeId === "CodeRush") {   
//     console.log("Timer:", timer);
//   }
// }, [timer, gamemodeId]);

  // ----------------- RESET SIGNAL -----------------
  useEffect(() => {
    if (gamemodeId !== "CodeRush") return;
    if (initialTime == null || initialTime <= 0) return;

    setTimer(initialTime);
    setBuffApplied(false);
    setIsFrozen(false);

    localStorage.setItem(STORAGE_KEY, initialTime);
    localStorage.setItem(TICK_KEY, Math.floor(Date.now() / 1000));
  }, [resetSignal]);

  // ----------------- COUNTDOWN (REFRESH-SAFE) -----------------
  useEffect(() => {
    if (gamemodeId !== "CodeRush") return;
    if (timer <= 0 || showPopup || isFrozen || pauseTimer) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const updated = Math.max(prev - 1, 0);

        // Persist timer state
        localStorage.setItem(STORAGE_KEY, updated);
        localStorage.setItem(TICK_KEY, Math.floor(Date.now() / 1000));

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gamemodeId, showPopup, isFrozen, pauseTimer, timer]);

  // ----------------- BUFFS -----------------
  useEffect(() => {
    if (gamemodeId !== "CodeRush") return;
    if (!activeBuffs.length) return;

    // Time Freeze Buff (5s freeze)
    if (activeBuffs.includes("timeFreeze")) {
      setIsFrozen(true);
      setBuffApplied(true);
      setBuffType("timeFreeze");

      removeBuff("timeFreeze");

      setTimeout(() => {
        setIsFrozen(false);
        setBuffApplied(false);
      }, 5000);
    }
  }, [gamemodeId, activeBuffs, removeBuff]);

  console.log(buffType);
  console.log(buffApplied);

  return [timer, buffApplied, buffType];
}
  