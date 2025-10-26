import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import confetti from "../../assets/Lottie/Confetti.json";
import loadingDots from "../../assets/Lottie/LoadingDots.json";
import { useState, useCallback } from "react";

import { unlockStage } from "../../components/BackEnd_Functions/unlockStage";


function LevelAlreadyCompleted({ subj, lessonId, LevelId }) {
  const navigate = useNavigate();
  const { stageId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const unlockNextLevel = useCallback(
    async (goContinue) => {
      try {
        const data = await unlockStage(subj, lessonId, LevelId, stageId);

        if (data.isNextLevelUnlocked && goContinue) {
          navigate(`/Main/Lessons/${subj}/${lessonId}/${data.nextLevelId}/Stage1/Lesson`);
        } else if (data.isNextLessonUnlocked && goContinue) {
          navigate(`/Main/Lessons/${subj}/${data.nextLessonId}/Level1/Stage1/Lesson`);
        } else if (data.isWholeTopicFinished && goContinue) {
          navigate("/Main");
        }
      } catch (err) {
        console.error("Error unlocking next level:", err);
      }
    },
    [subj, lessonId, LevelId, stageId, navigate]
  );

  return (
    <div className="fixed inset-0 bg-black/100 z-0 flex items-center justify-center">
      <Lottie animationData={confetti} loop={false} className="w-full h-full fixed z-1" />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-gradient-to-b from-cyan-400 to-purple-500 rounded-2xl shadow-lg p-[1px] w-[50%] text-center z-2"
      >
        <div className="bg-[#111827] w-full rounded-2xl p-10 flex flex-col gap-8 items-center">
          <h1 className="font-exo font-bold text-[3rem] text-[#F2FF43]">
            LEVEL ALREADY COMPLETED
          </h1>

          <div className="w-[80%] flex items-center justify-around">
            {/* Back to Main */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ bounceDamping: 100 }}
              onClick={() => {
                setIsLoading(false);
                navigate("/Main", { replace: true });
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
                setIsLoading(true);
                unlockNextLevel(true);

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
          <Lottie animationData={loadingDots} loop className="w-[50%] h-[50%]" />
        </div>
      )}
    </div>
  );
}

export default LevelAlreadyCompleted;
