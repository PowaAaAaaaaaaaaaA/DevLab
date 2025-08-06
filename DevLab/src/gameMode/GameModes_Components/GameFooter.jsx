// Navigation
import { useParams, useNavigate } from "react-router-dom"
import { goToNextGamemode } from "../GameModes_Utils/Util_Navigation";
// Hooks
import useUserDetails from "../../components/Custom Hooks/useUserDetails";
import useGameModeData from "../../components/Custom Hooks/useGameModeData"
import useUserInventory from"../../components/Custom Hooks/useUserInventory"
// Icons // Motion
import { motion, AnimatePresence} from "framer-motion";
import { LuAlignJustify } from "react-icons/lu";
import { useState } from "react";



function GameFooter({setLevelComplete}) {

  const navigate = useNavigate();

  const {Userdata, isLoading} = useUserDetails();
  const { inventory, loading} = useUserInventory();
  const {gameModeData,levelData, subject, lessonId, levelId, topicId, gamemodeId} = useGameModeData();

  const [showInventory, setShowInventory] = useState(false);

console.log (inventory);




  return (
<>
    <div className="h-[7%] border-t-white border-t-2 px-6 flex justify-between items-center text-white ">
        <div className="flex items-center gap-3 min-w-[20%]">
            <LuAlignJustify 
            onClick={() => setShowInventory(prev => !prev)}
            className="text-4xl cursor-pointer"/>
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
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={() =>
              goToNextGamemode({subject,lessonId,levelId,topicId,gamemodeId,navigate,setLevelComplete})
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

  {/*Inventory Show*/}
  <AnimatePresence >
{showInventory && (

    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    className="w-[20%] h-[50%] fixed bottom-20 left-5">
      <div className="h-[100%] w-[100%] border border-gra rounded-2xl bg-[#111827] p-4 flex flex-col gap-4">
      <h1 className="text-white font-exo text-4xl">Inventory</h1>
      {inventory.map(Items=>(
        <button className="cursor-pointer border rounded-2xl border-gray-400 h-[15%] bg-[#25293B] flex items-center p-1 justify-arround gap-10">
          <div className="rounded-2xl bg-gray-700 w-[20%] h-[95%]"></div>
          <h2 className="text-2xl font-exo text-gray-300">{Items.title}</h2>
          <p className="rounded-xs bg-gray-700 p-1 text-[0.8rem]">{Items.quantity}</p>
        </button>
      ))}  
      </div>
    </motion.div>
)}</AnimatePresence>

</>
  )
}

export default GameFooter