// Navigation
import { useParams, useNavigate } from "react-router-dom"
import { goToNextStage } from "../GameModes_Utils/Util_Navigation";
// Hooks
import useUserDetails from "../../components/Custom Hooks/useUserDetails";
import useGameModeData from "../../components/Custom Hooks/useGameModeData"
// Icons // Motion
import { motion, AnimatePresence} from "framer-motion";

import ItemsUse from "../../ItemsLogics/ItemsUse";



function GameFooter({setLevelComplete,setShowCodeWhisper,isCorrect}) {

  const navigate = useNavigate();
console.log(isCorrect)
  const {Userdata, isLoading} = useUserDetails();
  const {gameModeData,levelData, subject, lessonId, levelId, stageId, gamemodeId} = useGameModeData();
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
            whileHover={isCorrect ? { scale: 1.05, background: "#7e22ce" } : {background: "#a0aec0"}}
            transition={{ bounceDamping: 100, }}
            onClick={() =>
              goToNextStage({subject,lessonId,levelId,stageId,gamemodeId,navigate,setLevelComplete})
            }
          disabled={!isCorrect}
          className={`${
            isCorrect ? "bg-[#9333EA] cursor-pointer" : "bg-gray-500"} 
            text-white bg-[#7e22ce] font-bold rounded-xl w-full py-2 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]`}>
            Next
          </motion.button>
        </div>
        <div>
          <p className="text-xl">
            {Userdata ? `${Userdata.coins} Coins` : "Loading..."}
          </p>
        </div>
    </div>
</>
  )
}

export default GameFooter