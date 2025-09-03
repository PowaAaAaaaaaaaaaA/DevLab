import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export const unlockAchievement = async (userId, subject, actionType, levelId) => {
  try {
    // 1. Get the achievements document for this subject
    const achievementsRef = doc(db, "Achievements", subject);
    const snapshot = await getDoc(achievementsRef);

    if (!snapshot.exists()) return;

    const achievementsMap = snapshot.data(); // This is your map of achievements

    // 2. Iterate through each achievement in the map
    for (const [achievementId, achievement] of Object.entries(achievementsMap)) {
      // 3. Check if this achievement matches the action
      if (
        achievement.unlockCondition?.type === actionType &&
        achievement.unlockCondition?.levelId === levelId
      ) {
        // 4. Check if already unlocked
        const userAchRef = doc(db, "Users", userId, "Achievements", achievementId);
        const userAchSnap = await getDoc(userAchRef);

        if (!userAchSnap.exists()) {
          // 5. Unlock it (marked as unclaimed)
          await setDoc(userAchRef, {
            ...achievement,
            dateUnlocked: new Date(),
            claimed: false,
          });

          console.log(`Achievement unlocked: ${achievement.title}`);
        }
      }
    }
  } catch (error) {
    console.error("Error unlocking achievement:", error);
  }
};
