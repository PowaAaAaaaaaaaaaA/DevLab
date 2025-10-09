
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import confetti from "../../assets/Lottie/Confetti.json"
import smallLoading from "../../assets/Lottie/loadingSmall.json"

import { useEffect, useState } from "react";
import { db,auth} from "../../Firebase/Firebase";
import { doc, getDoc, updateDoc, } from "firebase/firestore";

import useFetchUserData from "../../components/BackEnd_Data/useFetchUserData";
import useAnimatedNumber from "../../components/Custom Hooks/useAnimatedNumber";
// Items
import { useInventoryStore } from "../../ItemsLogics/Items-Store/useInventoryStore";
import CoinSurge from "../../ItemsLogics/CoinSurge";

import { unlockAchievement } from "../../components/Custom Hooks/UnlockAchievement";
import { useSubjectCheckComplete } from "../../components/Custom Hooks/useSubjectCheckComplete";

import { fetchLevelSummary } from "../../components/OpenAI Prompts/feedbackPrompt";

import { unlockStage } from "../../components/BackEnd_Functions/unlockStage";


function LevelCompleted_PopUp({subj,lessonId,LevelId,heartsRemaining,setLevelComplete,resetHearts}) {



  const {removeBuff} = useInventoryStore.getState();
  const activeBuffs = useInventoryStore((state) => state.activeBuffs);
  const [levelSummary, setLevelSummary] = useState("");
    useEffect(() => {
    const getFeedbackSummary = async () => {
      const summary = await fetchLevelSummary();
      if (summary) {
        setLevelSummary(summary);
      }
    };

    getFeedbackSummary();
  }, []);

  const navigate = useNavigate(); 
  const [LevelData , setLevelData] = useState("");
  const { userData, isLoading, isError, refetch } = useFetchUserData();
  // Level Data
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
// Exp and Coins
  const addExp = async (userId,  Exp, coinsAmmount) => {
  const userRef = doc(db, 'Users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    let newExp = (userData.exp || 0) + (Exp || 0);
    let newLevel = userData.level || 1;
    let newCoins = (userData.coins || 0) + (coinsAmmount || 0);


    if (newExp >= 100) {
      const levelsGained = Math.floor(newExp / 100);
      newLevel += levelsGained;
      newExp = newExp % 100;
    }
    // Update the Firebase (Coins and EXP)
    await updateDoc(userRef, {
      exp: newExp || userData.exp,
      userLevel: newLevel ||userData.userLevel ,
      coins: newCoins || userData.coins
    });
  }
};

const RewardAdd = async () => {
  const user = auth.currentUser;
  const userLevelRef = doc(db, "Users", user.uid, "Progress", subj, "Lessons", lessonId, "Levels", LevelId);
  const levelSnap = await getDoc(userLevelRef);

  if (levelSnap.exists()) { 
    const levelData = levelSnap.data();
    if (levelData.rewardClaimed) {
      console.log("Reward already claimed.");
      return;
    }
      // Coin Surge 
if (activeBuffs.includes("doubleCoins")) {
  removeBuff("doubleCoins");

  const { DoubleCoins } = CoinSurge(LevelData.coinsReward);
  const doubled = DoubleCoins();
  const expReward = LevelData.expReward;
  
  await addExp(user.uid, expReward, doubled);
  await updateDoc(userLevelRef, { rewardClaimed: true });
}else{
    const expReward = LevelData.expReward;
    const coinsReward = LevelData.coinsReward;
    await addExp(user.uid, expReward, coinsReward);
    await updateDoc(userLevelRef, {
      rewardClaimed: true,  
    });
  }
  }
};

  const finalCoinReward = activeBuffs.includes("doubleCoins")
  ? LevelData?.coinsReward * 2
  : LevelData?.coinsReward;
  const {animatedValue: Coins} = useAnimatedNumber(finalCoinReward || 0);
  const {animatedValue: Exp} = useAnimatedNumber(LevelData?.expReward || 0);

const unlockNextLevel = async (goContinue) => {
  const userId = userData.uid;
  try {
    const data = await unlockStage(subj, lessonId, LevelId, stageId);
    await unlockAchievement(userId, subj, "firstLevelComplete", { LevelId, lessonId });

      if (data.isNextLevelUnlocked) {
      // Case: next level exists
      await unlockAchievement(userId, subj, "firstLevelComplete", { LevelId, lessonId });
      if (goContinue) {
        navigate(
          `/Main/Lessons/${subject}/${lessonId}/${data.nextLevelId}/${data.firstStageId}/Lesson`
        );
      }
    } else if (data.isNextLessonUnlocked) {
      // Case: next lesson exists
      await unlockAchievement(userId, subj, "lessonComplete", { lessonId });
      if (goContinue) {
        navigate(
          `/Main/Lessons/${subject}/${data.nextLessonId}/Level1/${data.firstStageId}/Lesson`
        );
      }
    } else if (data.isWholeTopicFinished) {
      // Case: finished the whole subject
      if (goContinue) {
        navigate("/Main");
      }
    }
  } catch (error) {
    console.error("Error unlocking next level:", error);
  }
};


    useSubjectCheckComplete(userData.uid, subj);


  return (
    <div className="fixed inset-0 bg-black/95 z-0 flex items-center justify-center">
      <Lottie
      animationData={confetti}
      loop={false}
      className="w-[100%] h-[100%] fixed z-1"/>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-gradient-to-b from-cyan-400 to-purple-500 rounded-2xl shadow-lg p-[1px] w-[60%] min- text-center h-auto z-2">
        <div className="bg-[#111827] h-[100%] w-[100%] rounded-2xl p-5 flex flex-col gap-5 items-center">
          <h1 className="font-exo font-bold text-[3rem] text-[#F2FF43]">LEVEL COMPLETED</h1>
<div className="bg-[#080C14] rounded-2xl border border-gray-700 p-4 font-exo w-[90%] min-h-[100px] flex flex-col items-center justify-center">
  {levelSummary ? (
    <div className="text-left text-white mx-auto p-3 w-[90%] leading-relaxed">
      <p>
        <span className="font-semibold text-cyan-400">Recap:</span>{" "}
        {levelSummary.recap}
      </p>
      <p>
        <span className="font-semibold text-green-400">Strengths:</span>{" "}
        {levelSummary.strengths}
      </p>
      <p>
        <span className="font-semibold text-yellow-400">Improvements:</span>{" "}
        {levelSummary.improvements}
      </p>
      <p>
        <span className="font-semibold text-purple-400">Encouragement:</span>{" "}
        {levelSummary.encouragement}
      </p>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-center text-white">
      <p className="text-lg font-exo mb-2">Generating Feedback...</p>
      <Lottie
        animationData={smallLoading}
        loop={true}
        className="w-[10%] h-[10%]"
      />
    </div>
  )}
</div>
 
          <hr className="text-white w-[95%]"/>
          <div>
            <h2 className="font-exo text-white text-[2rem]">PERFORMANCE SUMMARY</h2>
            <div className="flex flex-col gap-3 mt-5">
              <p className="text-white tex-[1.5rem] font-exo font-semibold">Lives Remaining: <span className="font-bold text-red-400">{heartsRemaining}x</span></p>
              <p className="text-white tex-[1.5rem] font-exo font-semibold">DevCoins: +<span className="font-bold text-yellow-400">{Coins}</span></p>
              <p className="text-white tex-[1.5rem] font-exo font-semibold">Xp Gained: +<span className="font-bold text-cyan-400">{Exp}XP</span></p>
            </div>
          </div>
          <div className=" w-[80%] flex items-center justify-around p-4 ">
          <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={async() => {
            await resetHearts();
            await refetch();
            await unlockNextLevel(false);
            await RewardAdd();
            await navigate("/Main",{ replace: true });
          }}
          className="bg-[#9333EA] min-w-[35%] max-w-[40%] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-70s0 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
          Back to Main
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={async () => {
          await resetHearts();
          await unlockNextLevel(true);
          await RewardAdd();
          await refetch();
          }}
          className="bg-[#36DB4F] min-w-[35%] max-w-[40%] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#2CBF45] hover:drop-shadow-[0 0 10px rgba(126, 34, 206, 0.5)] cursor-pointer "> Continue
        </motion.button>
          </div>

        </div>

      </motion.div>
    </div>
  );
}

export default LevelCompleted_PopUp;
