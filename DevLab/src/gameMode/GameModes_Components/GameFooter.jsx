import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { goToNextStage } from "../GameModes_Utils/Util_Navigation";

// Hooks
import useFetchUserData from "../../components/BackEnd_Data/useFetchUserData";
import useFetchGameModeData from "../../components/BackEnd_Data/useFetchGameModeData";
import useFetchUserProgress from "../../components/BackEnd_Data/useFetchUserProgress";

// Motion
import { motion } from "framer-motion";

// Utils
import ItemsUse from "../../ItemsLogics/ItemsUse";
import { useGameStore } from "../../components/OpenAI Prompts/useBugBustStore";
import { gameModeSubmitHandlers } from "../GameModes_Utils/gameModeSubmitHandler";

// Lottie
import Lottie from "lottie-react";
import Loading from "../../assets/Lottie/LoadingDots.json";

function GameFooter({ setLevelComplete, setShowCodeWhisper }) {
  const navigate = useNavigate();
  const { userData } = useFetchUserData();
  const {
    gameModeData,
    levelData,
    subject,
    lessonId,
    levelId,
    stageId,
    gamemodeId,
  } = useFetchGameModeData();
  const { userStageCompleted } = useFetchUserProgress(subject);

  const submittedCode = useGameStore((state) => state.submittedCode);
  const setIsCorrect = useGameStore((state) => state.setIsCorrect);
  const setShowIsCorrect = useGameStore((state) => state.setShowIsCorrect);
  
console.log(submittedCode);
  const [isLoading, setIsLoading] = useState(false);

  const buttonText = gamemodeId === "Lesson" || gamemodeId === "BrainBytes" ? "Next" : "Submit";
  const showLoading = buttonText === "Next";

  const handleClick = async () => {
    if (showLoading) setIsLoading(true); // start loading only for Next

    const stageKey = `${lessonId}-${levelId}-${stageId}`;
    const isStageLocked = userStageCompleted?.[stageKey] ?? false;

    if (isStageLocked || gamemodeId === "Lesson") {
      await goToNextStage({ subject, lessonId, levelId, stageId, navigate, setLevelComplete });
      if (showLoading) setIsLoading(false);
      return;
    }

    // Submit flow
    if (buttonText === "Submit") {
      const handler = gameModeSubmitHandlers[gamemodeId];
      if (handler) {
        await handler({
          submittedCode,
          setIsCorrect,
          setShowIsCorrect,
          instruction: gameModeData?.instruction,
          providedCode:
            gamemodeId === "CodeCrafter"
              ? gameModeData?.replicationFile
              : gameModeData?.codingInterface,
          description: gameModeData?.description,
          subject,
          stageId,
        });
      }
      return;
    }

    if (showLoading) setIsLoading(false); // stop loading
  };

  const stageKey = `${lessonId}-${levelId}-${stageId}`;
  const isStageLocked = userStageCompleted?.[stageKey] ?? false;
  const isBrainBytes = gamemodeId === "BrainBytes";
  const isDisabled = isBrainBytes && !isStageLocked;

  return (
    <>
      {/* Loading Overlay (only for Next) */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98">
          <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" />
        </div>
      )}

      {/* Footer */}
      <div className="h-[7%] border-t-white border-t-2 px-6 flex justify-between items-center text-white">
        {/* Left Section */}
        <div className="flex items-center gap-3 min-w-[20%]">
          <ItemsUse setShowCodeWhisper={setShowCodeWhisper} gamemodeId={gamemodeId} />
          <div className="min-w-[80%] font-exo">
            <p>{levelData ? `${levelData.levelOrder}. ${levelData.title}` : "Loading..."}</p>
            <p className="text-[#58D28F]">{levelData ? `${levelData.expReward}xp` : ""}</p>
          </div>
        </div>

        {/* Button Section */}
        <div className="w-[10%]">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={!isDisabled ? { scale: 1.05, background: "#7e22ce" } : {}}
            transition={{ bounceDamping: 100 }}
            onClick={!isDisabled ? handleClick : undefined}
            disabled={isDisabled || isLoading} // disable if loading
            className={`font-bold rounded-xl w-full py-2 ${
              isDisabled || isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#9333EA] cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
            }`}
          >
            {buttonText}
          </motion.button>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-xl">{userData ? `${userData.coins} Coins` : "Loading..."}</p>
        </div>
      </div>
    </>
  );
}

export default GameFooter;
