import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export const unlockAchievement = async (userId, subject, actionType, payload = {}) => {
  try {
    const achievementsRef = doc(db, "Achievements", subject);
    const snapshot = await getDoc(achievementsRef);

    if (!snapshot.exists()) return;

    const achievementsMap = snapshot.data();

    for (const [achievementId, achievement] of Object.entries(achievementsMap)) {
      const condition = achievement.unlockCondition;

      let match = false;

      if (actionType === "firstLevelComplete") {
        match = payload.levelId && condition.levelId === payload.levelId && condition.lessonId === payload.lessonId;
      }
      if (actionType === "lessonComplete") {
        match = payload.lessonId && condition.lessonId === payload.lessonId;
      }
      if (actionType === "tagUsed") {
        match = payload.usedTags?.includes(condition.tagReq) && payload.isCorrect === true;
      }

      if (match) {
        const userAchRef = doc(db, "Users", userId, "Achievements", achievementId);
        const userAchSnap = await getDoc(userAchRef);

        if (!userAchSnap.exists()) {
          await setDoc(userAchRef, {
            ...achievement,
            dateUnlocked: new Date(),
            claimed: false,
          });

          // Show Tailwind styled toast
toast.custom((t) => (
  <AnimatePresence mode="popLayout">
    {t.visible && (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4">
        <div className="flex-1 w-0">
          <p className="text-xl font-bold font-exo text-green-600">Achievement Unlocked!</p>
          <p className="mt-1 text-sm font-exo text-gray-700">{achievement.title}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-4 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
          ✖
        </button>
      </motion.div>
    )}
  </AnimatePresence>
));


          console.log(`Achievement unlocked: ${achievement.title}`);
        }
      }
    }
  } catch (error) {
    console.error("Error unlocking achievement:", error);
  }
};
