import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { toast } from "react-toastify";

export default function useAchievementsListener(userId) {
  const [achievements, setAchievements] = useState({});

  // Load already shown achievements from localStorage
  const getShownFromStorage = () => {
    const stored = localStorage.getItem("shownAchievements");
    return stored ? JSON.parse(stored) : {};
  };

  const updateShownInStorage = (shown) => {
    localStorage.setItem("shownAchievements", JSON.stringify(shown));
  };

  useEffect(() => {
    if (!userId) return;

    const shownAchievements = getShownFromStorage();

    const achRef = collection(db, "Users", userId, "Achievements");
    const unsubscribe = onSnapshot(achRef, (snapshot) => {
      const updated = {};
      snapshot.forEach((doc) => {
        updated[doc.id] = doc.data();

        // Check if newly unlocked and not already shown
        if (doc.data().claimed && !shownAchievements[doc.id]) {
          toast.success(`🎉 Achievement Unlocked: ${doc.id}`, {
            position: "top-right",
            autoClose: 3000,
          });

          // Mark as shown
          shownAchievements[doc.id] = true;
          updateShownInStorage(shownAchievements);
        }
      });

      setAchievements(updated);
    });

    return () => unsubscribe();
  }, [userId]);

  return achievements;
}
