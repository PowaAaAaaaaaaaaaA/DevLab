// Navigation
import { useNavigate } from "react-router-dom"
import { goToNextStage } from "../GameModes_Utils/Util_Navigation";
// Hooks
import useFetchUserData from "../../components/BackEnd_Data/useFetchUserData";
import useGameModeData from "../../components/Custom Hooks/useGameModeData"
// Icons // Motion
import { motion} from "framer-motion";

import ItemsUse from "../../ItemsLogics/ItemsUse";



function GameFooter({setLevelComplete,setShowCodeWhisper,setShowisCorrect}) {

  const navigate = useNavigate();

  const { userData } = useFetchUserData();
  const {levelData, subject, lessonId, levelId, stageId, gamemodeId} = useGameModeData();

    const handleClick = () => {
    if (gamemodeId === "Lesson") {
      // Go to next stage directly
      goToNextStage({subject,lessonId,levelId,stageId,gamemodeId,navigate,setLevelComplete,});
    } else {
      //  Show popup first (Correct/Wrong)
      setShowisCorrect(true);
    }
  };
  const isBrainBytes = gamemodeId === "BrainBytes";
  return (
<>
    <div className="h-[7%] border-t-white border-t-2 px-6 flex justify-between items-center text-white ">
        <div className="flex items-center gap-3 min-w-[20%]">
            < ItemsUse setShowCodeWhisper={setShowCodeWhisper} gamemodeId={gamemodeId}/>
          <div className="min-w-[80%] font-exo">
            <p>
              {levelData
                ? `${levelData.order}. ${levelData.title}`
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