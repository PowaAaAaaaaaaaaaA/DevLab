import { useEffect, useState } from "react";
import { useInventoryStore } from "./Items-Store/useInventoryStore";

export default function useCodeRushTimer(initialTime, gamemodeId, gameModeData, showPopup,pauseTimer) {
  const [timer, setTimer] = useState(1);
  const [buffApplied, setBuffApplied] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [buffType, setBuffType] = useState("")

  const activeBuffs = useInventoryStore((state) => state.activeBuffs);
  const { removeBuff } = useInventoryStore.getState();
  // Initialize the timer
useEffect(() => {
  if (!gamemodeId || gamemodeId !== "CodeRush") return;
  if (initialTime == null || initialTime <= 0) return;

  setTimer(initialTime);
}, [gamemodeId, initialTime]);

//   // Debugging: log timer updates
// useEffect(() => {
//   if (gamemodeId === "CodeRush") {
//     console.log("Timer:", timer);
//   }
// }, [timer, gamemodeId]);

  // Countdown logic
useEffect(() => {
  if (gamemodeId !== "CodeRush") return;
  if (timer <= 0 || showPopup || isFrozen || pauseTimer) return;

  const countdown = setInterval(() => {
    setTimer((prev) => Math.max(prev - 1, 0));
  }, 1000);

  return () => clearInterval(countdown);
}, [gamemodeId, showPopup, isFrozen, pauseTimer, timer]);

  // Buffs
// Buffs
useEffect(() => {
  if (gamemodeId !== "CodeRush") return;
  if (!activeBuffs.length) return;

  // Time Freeze Buff (pauses countdown for 5s)
  if (activeBuffs.includes("timeFreeze")) {
    setIsFrozen(true);
    setBuffApplied(true);
    setBuffType("timeFreeze");

    removeBuff("timeFreeze"); // update Zustand + Firestore
    setTimeout(() => {
      setIsFrozen(false);
      setBuffApplied(false);
    }, 5000);
  }
}, [gamemodeId, activeBuffs, removeBuff]);


  console.log(buffType)
  console.log(buffApplied)

  return [timer, buffApplied,buffType];
}
