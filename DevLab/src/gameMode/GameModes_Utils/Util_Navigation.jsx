import { unlockStage } from "../../components/BackEnd_Functions/unlockStage";
import { unlockAchievement } from "../../components/Custom Hooks/UnlockAchievement";
import { db } from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import CoinSurge from "../../ItemsLogics/CoinSurge";
import { useInventoryStore } from "../../ItemsLogics/Items-Store/useInventoryStore";

// Helper: Add EXP and Coins
const addExp = async (userId, expGain, coinsGain) => {
  const userRef = doc(db, "Users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const { exp = 0, userLevel = 1, coins = 0 } = userSnap.data();
  let newExp = exp + (expGain || 0);
  let newLevel = userLevel;
  let newCoins = coins + (coinsGain || 0);

  // Level-up logic
  if (newExp >= 100) {
    newLevel += Math.floor(newExp / 100);
    newExp %= 100;
  }

  await updateDoc(userRef, {
    exp: newExp,
    userLevel: newLevel,
    coins: newCoins,
  });
};

// 🔹 Reward Granting Function
const handleRewardGrant = async (userId, subject, lessonId, levelId) => {
  try {
    const { activeBuffs, removeBuff } = useInventoryStore.getState();

    const levelRef = doc(db, subject, lessonId, "Levels", levelId);
    const levelSnap = await getDoc(levelRef);
    if (!levelSnap.exists()) return;

    let { expReward = 0, coinsReward = 0 } = levelSnap.data();
    console.log("Granting rewards:", expReward, coinsReward);

    //  Apply buff (Double Coins)
    if (activeBuffs.includes("doubleCoins")) {
      const { DoubleCoins } = CoinSurge(coinsReward);
      coinsReward = DoubleCoins();
      removeBuff("doubleCoins");
    }

    // Add EXP & Coins
    await addExp(userId, expReward, coinsReward);

    // Mark reward as claimed
    const userLevelRef = doc(
      db,
      "Users",
      userId,
      "Progress",
      subject,
      "Lessons",
      lessonId,
      "Levels",
      levelId
    );
    await updateDoc(userLevelRef, { isRewardClaimed: true });
  } catch (err) {
    console.error("Error in handleRewardGrant:", err.message);
  }
};

// 🔹 Main Function
export const goToNextStage = async ({
  subject,
  lessonId,
  levelId,
  stageId,
  navigate,
  setLevelComplete,
  userId,
}) => {
  try {
    const data = await unlockStage(subject, lessonId, levelId, stageId);
    console.log("Unlock response:", data);

    if (data.isNextStageUnlocked) {
      navigate(
        `/Main/Lessons/${subject}/${lessonId}/${levelId}/${data.nextStageId}/${data.nextStageType}`
      );
    } else if (data.isNextLevelUnlocked) {
      await handleRewardGrant(userId, subject, lessonId, levelId);
      setLevelComplete(true);
    } else if (data.isNextLessonUnlocked) {
      await unlockAchievement(userId, subject, "lessonComplete", { lessonId });
      await handleRewardGrant(userId, subject, lessonId, levelId);
      setLevelComplete(true);
    } else if (data.isWholeTopicFinished) {
      await handleRewardGrant(userId, subject, lessonId, levelId);
      setLevelComplete(true);
    }
  } catch (error) {
    console.error("Error in goToNextStage:", error.message);
  }
};
