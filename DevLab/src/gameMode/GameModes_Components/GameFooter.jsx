// Navigation
import { useParams, useNavigate } from "react-router-dom"
import { goToNextGamemode } from "../GameModes_Utils/Util_Navigation";
// Hooks
import useUserDetails from "../../components/Custom Hooks/useUserDetails";
import useGameModeData from "../../components/Custom Hooks/useGameModeData";
// Icons // Motion
import { MdDensityMedium } from "react-icons/md";
import { motion } from "framer-motion";


function GameFooter() {

  const navigate = useNavigate();

  const {Userdata, isLoading} = useUserDetails();
  const {gameModeData,levelData, subject, lessonId, levelId, topicId, gamemodeId} = useGameModeData();




  return (
    <div className="h-[7%] border-t-white border-t-2 px-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <MdDensityMedium className="text-2xl" />
          <div>
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
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={() =>
              goToNextGamemode({subject,lessonId,levelId,topicId,gamemodeId,navigate,onComplete: () => setLevelComplete(true)})
            }
            className="bg-[#9333EA] text-white font-bold rounded-xl w-full py-2 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer">
            Next
          </motion.button>
        </div>
        <div>
          <p className="text-xl">
            {Userdata ? `${Userdata.coins} Coins` : "Loading..."}
          </p>
        </div>
    </div>
  )
}

export default GameFooter