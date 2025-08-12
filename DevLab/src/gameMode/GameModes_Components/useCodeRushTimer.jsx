import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/Firebase";
import { doc, updateDoc, arrayRemove, onSnapshot } from "firebase/firestore";

export default function useCodeRushTimer(initialTime,gamemodeId,gameModeData,showPopup) {
  const [timer, setTimer] = useState(null);
  const [buffApplied, setBuffApplied] = useState(false);

  // Initialize the timer
  useEffect(() => {
    if (gamemodeId === "CodeRush" && initialTime) {
      setTimer(initialTime);
    }
  }, [gameModeData, gamemodeId, initialTime]);

  // Countdown logic
  useEffect(() => {
    if (gamemodeId === "CodeRush" && !showPopup) {
      const countdown = setInterval(() => {
        setTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [gamemodeId, showPopup]);

  // Listen for buffs in realtime from Firestore
  useEffect(() => {
    if (gamemodeId !== "CodeRush") return;

    const userDb = doc(db, "Users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDb, (snap) => {
      const data = snap.data();
      if (data?.activeBuffs?.includes("extraTime")) {
        setTimer((prev) => prev + 30);
        setBuffApplied(true);

        // Remove buff so it’s only used once
        updateDoc(userDb, {
          activeBuffs: arrayRemove("extraTime"),
        });
              // Reset animation flag after 500ms
      setTimeout(() => setBuffApplied(false), 1000);
      }
      
    });

    return () => unsubscribe();
  }, [gamemodeId]);

  return [timer,buffApplied];
}
