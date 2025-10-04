// Navigation
import { useNavigate } from "react-router-dom"
import { goToNextStage } from "../GameModes_Utils/Util_Navigation";
// Hooks
import useFetchUserData from "../../components/BackEnd_Data/useFetchUserData";
import useGameModeData from "../../components/Custom Hooks/useGameModeData"
// Icons // Motion
import { motion} from "framer-motion";
// Utils
import ItemsUse from "../../ItemsLogics/ItemsUse";
import { useGameStore } from "../../components/OpenAI Prompts/useBugBustStore";
import { gameModeSubmitHandlers } from "../GameModes_Utils/gameModeSubmitHandler";



function GameFooter({setLevelComplete,setShowCodeWhisper,setShowisCorrect}) {

  const navigate = useNavigate();

  const { userData } = useFetchUserData();
  const {gameModeData,levelData, subject, lessonId, levelId, stageId, gamemodeId} = useGameModeData();
    //for OpenAI
  const submittedCode = useGameStore((state) => state.submittedCode);
  const setIsCorrect = useGameStore((state) => state.setIsCorrect);
  const setShowIsCorrect = useGameStore((state) => state.setShowIsCorrect);

console.log(gameModeData?.replicationFile);


const handleClick = async () => {
  if (gamemodeId === "Lesson") {
    goToNextStage({ subject, lessonId, levelId, stageId, gamemodeId, navigate, setLevelComplete });
  } else {
    const handler = gameModeSubmitHandlers[gamemodeId];
    if (handler) {
      handler({
        submittedCode,
        setIsCorrect,
        setShowIsCorrect,
        instruction: gameModeData?.instruction,
        providedCode: gamemodeId === "CodeCrafter" 
          ? gameModeData?.replicationFile // Pass replicationFile for CodeCrafter
          : gameModeData?.codingInterface, // Pass codingInterface for others
        description: gameModeData?.description,
        subject,
        levelId,
        stageId
      });
    }
  }
};


console.log(gamemodeId);
  const isBrainBytes = gamemodeId === "BrainBytes";
  return (
<>
    <div className="h-[7%] border-t-white border-t-2 px-6 flex justify-between items-center text-white ">
        <div className="flex items-center gap-3 min-w-[20%]">
            < ItemsUse setShowCodeWhisper={setShowCodeWhisper} gamemodeId={gamemodeId}/>
          <div className="min-w-[80%] font-exo">
            <p>
              {levelData
                ? `${levelData.levelOrder}. ${levelData.title}`
                : "Loading..."}
            </p>
            <p className="text-[#58D28F]">
              {levelData ? `${levelData.expReward}xp` : ""}
            </p>
          </div>
        </div>
        <div className="w-[10%]">
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={!isBrainBytes ? { scale: 1.05, background: "#7e22ce" } : {}}
  transition={{ bounceDamping: 100 }}
  onClick={!isBrainBytes ? handleClick : undefined}
  disabled={isBrainBytes}
  className={`font-bold rounded-xl w-full py-2 ${
    isBrainBytes
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-[#9333EA] cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
  }`}>
  Next
</motion.button>

        </div>
        <div>
          <p className="text-xl">
            {userData ? `${userData.coins} Coins` : "Loading..."}
          </p>
        </div>
    </div>
</>
  )
}

export default GameFooter