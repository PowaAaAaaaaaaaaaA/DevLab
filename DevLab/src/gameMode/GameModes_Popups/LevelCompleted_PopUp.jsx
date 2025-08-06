
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db,auth} from "../../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc,arrayRemove } from "firebase/firestore";

import useUserDetails from "../../components/Custom Hooks/useUserDetails";
import useAnimatedNumber from "../../components/Custom Hooks/useAnimatedNumber";
// Items
import CoinSurge from "../../ItemsLogics/CoinSurge";


function LevelCompleted_PopUp({subj,lessonId,LevelId,heartsRemaining,setLevelComplete}) {

  const navigate = useNavigate();
  const [LevelData , setLevelData] = useState("");


  const { Userdata,refetch } = useUserDetails();
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
  const userRef = doc(db, "Users", user.uid)  

  if (levelSnap.exists()) { 
    const levelData = levelSnap.data();
    if (levelData.rewardClaimed) {
      console.log("Reward already claimed.");
      return;
    }
      // Coin Surge 
    if (Userdata.activeBuffs?.includes("doubleCoins")) {
    const { DoubleCoins } = CoinSurge(LevelData.coinsReward);
    const doubled = DoubleCoins();
        const expReward = LevelData.expReward;
        await addExp(user.uid, expReward, doubled);
          // Mark reward as claimed
          await updateDoc(userLevelRef, {
      rewardClaimed: true,  
    });
    await updateDoc(userRef, {
      activeBuffs: arrayRemove("doubleCoins")
    });
  }else{
    const expReward = LevelData.expReward;
    const coinsReward = LevelData.coinsReward;
    await addExp(user.uid, expReward, coinsReward);
  }



  }
};


  const {animatedValue: Coins} = useAnimatedNumber(LevelData?.coinsReward || 0);
  const {animatedValue: Exp} = useAnimatedNumber(LevelData?.expReward || 0);


const unlockNextLevel = async (goContinue) => {
      const userId = auth.currentUser.uid;
  try {
    const currentLevelNum = parseInt(LevelId.replace("Level", ""));
    const nextLevelId = `Level${currentLevelNum + 1}`;

    const userLevelRef = doc(db,"Users",userId,"Progress",subj,"Lessons",lessonId,"Levels",LevelId);
    // Mark current level as completed with rewardClaimed = false
    await setDoc(userLevelRef, { 
      status: true, 
    }, { merge: true });
    // Unlock the next level
    const nextLevelRef = doc(db,"Users",userId,"Progress",subj,"Lessons",lessonId,"Levels",nextLevelId);

    await setDoc(nextLevelRef, { status: true,rewardClaimed: false }, { merge: true });
    console.log("Level completed and next level unlocked.");

    if (goContinue){
      navigate(`/Main/Lessons/${subj}/${lessonId}/${nextLevelId}/Topic1/Lesson`);
    }
  } catch (error) {
    console.error("Error unlocking next level:", error);
  }
};

// Items Check





  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-gradient-to-b from-cyan-400 to-purple-500 rounded-2xl shadow-lg p-[1px] w-[40%] text-center h-[65%] ">
        <div className="bg-[#111827] h-[100%] w-[100%] rounded-2xl p-5 flex flex-col gap-5 items-center">
          <h1 className="font-exo font-bold text-[3rem] text-[#F2FF43]">LEVEL COMPLETED</h1>
          <div className="bg-[#080C14] rounded-2xl border border-gray-700 p-8 font-exo w-[90%]"> 
            <p className="text-white text-center text-base/7">
            🌑 The Terminal Falls Silent You’ve emerged from the code—scarred, but wiser. The system yields, for now, recognizing your resolve. Yet beneath the surface, deeper logic churns… ancient, unrefined, waiting.
🕳️ This is not the end. Only the next beginning.
            </p>
          </div> 
          <hr className="text-white w-[95%]"/>
          <div>
            <h2 className="font-exo text-white text-[2rem]">PERFORMANCE SUMMARY</h2>
            <div className="flex flex-col gap-3 mt-5">
              <p className="text-white">Lives Remaining: {heartsRemaining}x</p>
              <p className="text-white">DevCoins: +{Coins}</p>
              <p className="text-white">Xp Gained: +{Exp}XP</p>
            </div>
          </div>
          <div className=" w-[80%] flex items-center justify-around p-4 ">
          <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={async() => {
            await refetch();
            await unlockNextLevel(false);
            await setLevelComplete(false);
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
          onClick={() => {
          unlockNextLevel(true);
          RewardAdd();
          refetch();
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
