
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db,auth} from "../../Firebase/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";


function LevelCompleted_PopUp({subj,lessonId,LevelId,heartsRemaining,setLevelComplete}) {
  const navigate = useNavigate();
  const [LevelData , setLevelData] = useState("");

useEffect(()=>{
  const fetchLevelData = async ()=>{
    const fetchLevelData = doc (db,subj,lessonId,"Levels",LevelId);
    const LevelDatas = await getDoc(fetchLevelData);
      if(LevelDatas.exists()){
        setLevelData(LevelDatas.data())
      }
  }
  fetchLevelData();
},[subj,lessonId,LevelId])

console.log(LevelData)


const unlockNextLevel = async () => {
      const userId = auth.currentUser.uid;
  try {
    const userLevelRef = doc(db,"Users",userId,"Progress",subj,"Lessons",lessonId,"Levels",LevelId);

    // Mark current level as completed
    await setDoc(userLevelRef, { status: true }, { merge: true });

    // Unlock the next level
    const nextLevelRef = doc(db,"Users",userId,"Progress",subj,"Lessons",lessonId,"Levels","Level2");

    await setDoc(nextLevelRef, { status: true }, { merge: true });
    console.log("Level completed and next level unlocked.");
  } catch (error) {
    console.error("Error unlocking next level:", error);
  }
};







  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-gradient-to-b from-cyan-400 to-purple-500 rounded-2xl shadow-lg p-[1px] w-[50%] text-center h-[70%] ">
        <div className="bg-[#111827] h-[100%] w-[100%] rounded-2xl p-5 flex flex-col gap-5 items-center">
          <h1 className="font-exo font-bold text-[3rem]">LEVEL COMPLETED</h1>
          <div className="bg-[#080C14] rounded-2xl border border-gray-700 p-8 font-exo w-[80%]"> 
            <p className="text-white text-center text-base/7">
            🌑 The Terminal Falls Silent You’ve emerged from the code—scarred, but wiser. The system yields, for now, recognizing your resolve. Yet beneath the surface, deeper logic churns… ancient, unrefined, waiting.
🕳️ This is not the end. Only the next beginning.
            </p>
          </div> 
          <hr className="text-white w-[85%]"/>
          <div>
            <h2 className="font-exo text-white text-[2rem]">PERFORMANCE SUMMARY</h2>
            <div className="border flex flex-col gap-3 mt-5">
              <p className="text-white">Lives Remaining: {heartsRemaining}x</p>
              <p className="text-white">DevCoins: +{LevelData?.coinsReward || "wait"}</p>
              <p className="text-white">Xp Gained: +{LevelData?.expReward || "wait"}XP</p>
            </div>
          </div>
          
          <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={() => {
            setLevelComplete(false);
            navigate("/Main"); // or navigate to next level, summary, or dashboard
          }}
          className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
          Back to Main
        </motion.button>
                  <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={() => {
            unlockNextLevel();
          }}
          className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
         New
        </motion.button>
        </div>

      </motion.div>
    </div>
  );
}

export default LevelCompleted_PopUp;
