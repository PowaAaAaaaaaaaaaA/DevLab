import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import confetti from "../../assets/Lottie/Confetti.json";
import smallLoading from "../../assets/Lottie/loadingSmall.json";
import loadingDots from "../../assets/Lottie/LoadingDots.json"
import { useEffect, useState, useMemo, useCallback } from "react";
import { db, auth } from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";

import useFetchUserData from "../../components/BackEnd_Data/useFetchUserData";
import useAnimatedNumber from "../../components/Custom Hooks/useAnimatedNumber";
import { useInventoryStore } from "../../ItemsLogics/Items-Store/useInventoryStore";
import { unlockAchievement } from "../../components/Custom Hooks/UnlockAchievement";
import { useSubjectCheckComplete } from "../../components/Custom Hooks/useSubjectCheckComplete";
import { fetchLevelSummary } from "../../components/OpenAI Prompts/feedbackPrompt";
import { unlockStage } from "../../components/BackEnd_Functions/unlockStage";

function LevelCompleted_PopUp({ subj, lessonId, LevelId, heartsRemaining, setLevelComplete, resetHearts }) {
  const navigate = useNavigate();
  const { stageId } = useParams();

  const { removeBuff } = useInventoryStore.getState();
  const activeBuffs = useInventoryStore((state) => state.activeBuffs);
  const { userData, refetch } = useFetchUserData();

  const [levelSummary, setLevelSummary] = useState(null);
  const [LevelData, setLevelData] = useState(null);

  const hearts = heartsRemaining;
  const [isLoading, setIsLoading] = useState(false);


  //  Fetch feedback once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const summary = await fetchLevelSummary();
      if (isMounted && summary) setLevelSummary(summary);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  //  Fetch Level Data
  useEffect(() => {
    (async () => {
      const levelRef = doc(db, subj, lessonId, "Levels", LevelId);
      const snapshot = await getDoc(levelRef);
      if (snapshot.exists()) setLevelData(snapshot.data());
    })();
  }, [subj, lessonId, LevelId]);

  //  Derived rewards (memoized)
  const finalCoinReward = useMemo(() => {
    if (!LevelData) return 0;
    return activeBuffs.includes("doubleCoins")
      ? LevelData.coinsReward * 2 
      : LevelData.coinsReward;
  }, [activeBuffs, LevelData]);

  const { animatedValue: Coins } = useAnimatedNumber(finalCoinReward || 0);
  const { animatedValue: Exp } = useAnimatedNumber(LevelData?.expReward || 0);



  //  Unlock next level handler
  const unlockNextLevel = useCallback(
    async (goContinue) => {
      try {
        const userId = userData.uid;
        const data = await unlockStage(subj, lessonId, LevelId, stageId);

        await unlockAchievement(userId, subj, "firstLevelComplete", { LevelId, lessonId });

        if (data.isNextLevelUnlocked && goContinue) {
          navigate(`/Main/Lessons/${subj}/${lessonId}/${data.nextLevelId}/Stage1/Lesson`);
        } else if (data.isNextLessonUnlocked && goContinue) {
          await unlockAchievement(userId, subj, "lessonComplete", { lessonId });
          navigate(`/Main/Lessons/${subj}/${data.nextLessonId}/Level1/Stage1/Lesson`);
        } else if (data.isWholeTopicFinished && goContinue) {
          navigate("/Main");
        }
      } catch (err) {
        console.error("Error unlocking next level:", err);
      }
    },
    [userData.uid, subj, lessonId, LevelId, stageId, navigate]
  );

  useSubjectCheckComplete(userData.uid, subj);

  return (
    <div className="fixed inset-0 bg-black/95 z-0 flex items-center justify-center">
      <Lottie animationData={confetti} loop={false} className="w-full h-full fixed z-1" />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-gradient-to-b from-cyan-400 to-purple-500 rounded-2xl shadow-lg p-[1px] w-[60%] text-center z-2"
      >
        <div className="bg-[#111827] w-full rounded-2xl p-5 flex flex-col gap-5 items-center">
          <h1 className="font-exo font-bold text-[3rem] text-[#F2FF43]">LEVEL COMPLETED</h1>

          <div className="bg-[#080C14] rounded-2xl border border-gray-700 p-4 font-exo w-[90%] min-h-[100px] flex flex-col items-center justify-center">
            {levelSummary ? (
              <div className="text-left text-white mx-auto p-3 w-[90%] leading-relaxed">
                {["recap", "strengths", "improvements", "encouragement"].map((key, i) => (
                  <p key={i}>
                    <span className={`font-semibold ${
                      key === "recap"
                        ? "text-cyan-400"
                        : key === "strengths"
                        ? "text-green-400"
                        : key === "improvements"
                        ? "text-yellow-400"
                        : "text-purple-400"
                    }`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>{" "}
                    {levelSummary[key]}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-white">
                <p className="text-lg font-exo mb-2">Generating Feedback...</p>
                <Lottie animationData={smallLoading} loop className="w-[10%] h-[10%]" />
              </div>
            )}
          </div>

          <hr className="text-white w-[95%]" />

          <div>
            <h2 className="font-exo text-white text-[2rem]">PERFORMANCE SUMMARY</h2>
            <div className="flex flex-col gap-3 mt-5">
              <p className="text-white font-exo font-semibold">
                Lives Remaining: <span className="font-bold text-red-400">{hearts}x</span>
              </p>
              <p className="text-white font-exo font-semibold">
                DevCoins: +<span className="font-bold text-yellow-400">{Coins}</span>
              </p>
              <p className="text-white font-exo font-semibold">
                XP Gained: +<span className="font-bold text-cyan-400">{Exp}XP</span>
              </p>
            </div>
          </div>

<div className="w-[80%] flex items-center justify-around p-4">
  {/* Back to Main */}
  <motion.button
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.05 }}
    transition={{ bounceDamping: 100 }}
    onClick={() => {
      // Close popup and navigate immediately
      setIsLoading(false);
      navigate("/Main", { replace: true });

      // Run async tasks in background
      (async () => {
        await Promise.all([unlockNextLevel(false), refetch()]);
        resetHearts(); // reset hearts after tasks
      })();
    }}
    className="bg-[#9333EA] min-w-[35%] max-w-[40%] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer"
  >
    Back to Main
  </motion.button>

  {/* Continue */}
  <motion.button
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.05 }}
    transition={{ bounceDamping: 100 }}
    onClick={() => {
      // Close popup immediately
      setIsLoading(false);

      // Navigate after a small delay if you want animation to play
      setTimeout(() => {
        unlockNextLevel(true); // optionally, you can handle navigation here
      }, 100);

      // Run async tasks in background
      (async () => {
        await Promise.all([refetch()]);
        resetHearts();
      })();
    }}
    className="bg-[#36DB4F] min-w-[35%] max-w-[40%] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#2CBF45] hover:drop-shadow-[0_0_10px_rgba(126,34,206,0.5)] cursor-pointer"
  >
    Continue
  </motion.button>
</div>

        </div>
      </motion.div>


{isLoading && (
  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
    <Lottie animationData={loadingDots} loop className="w-[15%] h-[15%]" />
  </div>
)}

    </div>
  );
}

export default LevelCompleted_PopUp;
