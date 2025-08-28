import { useEffect, useState } from "react";
import { db, auth } from "../Firebase/Firebase";
import { doc, updateDoc, arrayRemove, onSnapshot } from "firebase/firestore";

export default function useCodeRushTimer(initialTime, gamemodeId, gameModeData, showPopup) {
  const [timer, setTimer] = useState(null);
  const [buffApplied, setBuffApplied] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [buffType, setBuffType] = useState("")

  // Initialize the timer
  useEffect(() => {
    if (gamemodeId === "CodeRush" && initialTime) {
      setTimer(initialTime);
    }
  }, [gameModeData, gamemodeId, initialTime]);

  // Countdown logic
  useEffect(() => {
    if (gamemodeId === "CodeRush" && !showPopup && !isFrozen) {
      const countdown = setInterval(() => {
        setTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [gamemodeId, showPopup, isFrozen]);

  // Listen for buffs in realtime from Firestore
  useEffect(() => {
    if (gamemodeId !== "CodeRush") return;

    const userDb = doc(db, "Users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDb, (snap) => {
      const data = snap.data();

      // Extra Time Buff (+30s)
      if (data?.activeBuffs?.includes("extraTime")) {
        setTimer((prev) => prev + 30);
        setBuffApplied(true);
        setBuffType("extraTime");

        updateDoc(userDb, { activeBuffs: arrayRemove("extraTime") });
        setTimeout(() => setBuffApplied(false), 1000);
      }

      // Time Freeze Buff (pauses countdown for 5s)
      if (data?.activeBuffs?.includes("timeFreeze")) {
        setIsFrozen(true);
        setBuffApplied(true);
        setBuffType("timeFreeze");

        updateDoc(userDb, { activeBuffs: arrayRemove("timeFreeze") });

        setTimeout(() => {
          setIsFrozen(false);
          setBuffApplied(false);
        }, 5000); // freeze lasts 5s
      }
    });

    return () => unsubscribe();
  }, [gamemodeId]);

  return [timer, buffApplied,buffType];
}
