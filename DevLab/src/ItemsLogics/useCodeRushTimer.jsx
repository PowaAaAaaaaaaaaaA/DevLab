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
    if (gamemodeId === "CodeRush" && initialTime) {
      setTimer(initialTime);
    }
  }, [gameModeData, gamemodeId, initialTime]);
//   // Debugging: log timer updates
// useEffect(() => {
//   if (gamemodeId === "CodeRush") {
//     console.log("Timer:", timer);
//   }
// }, [timer, gamemodeId]);

  // Countdown logic
  useEffect(() => {
    if (gamemodeId === "CodeRush" && !showPopup && !isFrozen && !pauseTimer ) {
      const countdown = setInterval(() => {
        setTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(countdown);

    }
  }, [gamemodeId, showPopup, isFrozen,pauseTimer]);
  // Buffs
// Buffs
useEffect(() => {
  if (gamemodeId !== "CodeRush") return;
  if (!activeBuffs.length) return;

  // Extra Time Buff (+30s)
  if (activeBuffs.includes("extraTime")) {
    setTimer((prev) => prev + 30);
    setBuffApplied(true);
    setBuffType("extraTime");

    removeBuff("extraTime"); // update Zustand + Firestore
    setTimeout(() => setBuffApplied(false), 1000);
  }

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
