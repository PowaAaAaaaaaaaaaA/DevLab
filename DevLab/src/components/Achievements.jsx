// UI
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Lottie from 'lottie-react';
// Assets
import Claim from '../assets/Lottie/ClaimAchievement.json'
import AchIcon from '../assets/Images/Achievemen-Icon.png'
import Loading from '../assets/Lottie/LoadingDots.json'
import defaultAvatar from './../assets/Images/profile_handler.png';
// DaTa
import useFetchUserData from "./BackEnd_Data/useFetchUserData.jsx";
import useAchievementsData from './Custom Hooks/useAchievementsData.jsx'
import useUserAchievements from './Custom Hooks/useUserAchievements.jsx'
import useAchievementsProgressBar from './Custom Hooks/useAchievementProgressBar.jsx';
// Utils
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'  
import '../index.css'
// Firebase
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

function Achievements() {

  const { userData } = useFetchUserData();
  // Achievements DATA
  const { data: HtmlData, isLoading: htmlLoading } = useAchievementsData("Html");
  const { data: CssData, isLoading: cssLoading } = useAchievementsData("Css");
  const { data: JsData, isLoading: jsLoading } = useAchievementsData("JavaScript");
  const { data: DatabaseData, isLoading: dbLoading } = useAchievementsData("Database");
  // User Achievement ProgressBar
  const {animatedBar:HtmlBar} = useAchievementsProgressBar(userData?.uid, "Html");
  const {animatedBar:CssBar} = useAchievementsProgressBar(userData?.uid, "Css");
  const {animatedBar:JsBar} = useAchievementsProgressBar(userData?.uid, "JavaScript");
  const {animatedBar:DatabaseBar} = useAchievementsProgressBar(userData?.uid, "Database");
  // User Achievements
  const { data: userAchievements, } = useUserAchievements(userData?.uid);
  // Loading States
const [LoadingClaim , setLoadingClaim] = useState(false);
 // UTils
const queryClient = useQueryClient();

// Claime Reward
const claimMutation = useMutation({
mutationFn: async (achievement) => {
  const userId = userData.uid;
  const userRef = doc(db, "Users", userId);
  const userAchRef = doc(db, "Users", userId, "Achievements", achievement.id);
  //Mark achievement as claimed
  await updateDoc(userAchRef, { isClaimed: true });
  //  Calculate EXP, Level, and Coins
  let newExp = (userData.exp || 0) + (achievement.expReward || 0);
  let newLevel = userData.userLevel || 1;
  let newCoins = (userData.coins || 0) + (achievement.coinsReward || 0);
  if (newExp >= 100) {
    const levelsGained = Math.floor(newExp / 100);
    newLevel += levelsGained;
    newExp = newExp % 100;
  }
  // Update user document
  await updateDoc(userRef, {
    exp: newExp,
    userLevel: newLevel,
    coins: newCoins,
  });
  return achievement.id;
},
  onSuccess: () => {
    queryClient.invalidateQueries(["userAchievements", userData?.uid]);
    queryClient.invalidateQueries(["User_Details", userData?.uid]); // refetch coins/exp too
  },
  onError: (error) => {
    console.error("Error claiming achievement:", error);
  },
  onSettled: ()=>{
    setLoadingClaim(false);
  }
});

const handleClaim = (item) => {
  setLoadingClaim(true);
  claimMutation.mutate(item, {
    onSuccess: () => {
      showClaimToast(item); // 
      setLoadingClaim(false);
    },
    onError: () => setLoadingClaim(false),
  });
};


// Show Claim Toast
const showClaimToast = (item) => {
  toast.custom(
(t) => (
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.85 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 50, scale: 0.85 }}
  transition={{ type: "spring", stiffness: 150, damping: 15 }}
  className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-4 text-center max-w-sm w-full mx-auto ">
  {/* Lottie Animation */}
  <Lottie
    animationData={Claim}
    loop={false}
    autoplay
    style={{ width: 50, height: 50 }}
  />
<div className='flex flex-col'>
  {/* Title */}
  <h1 className="font-exo text-green-700 font-extrabold text-2xl drop-shadow-sm">
    🎉 Congratulations!
  </h1>

  {/* Reward Info */}
  <p className="text-gray-700 text-base">
    You claimed <span className="font-bold text-purple-700">{item.title}</span> reward!
  </p>

  {/* Rewards Breakdown */}
  <div className="flex flex-wrap justify-center gap-4 mt-3">
    {/* DevCoins */}
    <div className="bg-yellow-100 px-4 py-2 rounded-xl shadow-sm">
      <p className="text-sm text-yellow-700 font-bold">
        DevCoins: <span className="text-yellow-600">+{item.coinsReward}</span>
      </p>
    </div>

    {/* Exp */}
    <div className="bg-cyan-100 px-4 py-2 rounded-xl shadow-sm">
      <p className="text-sm text-cyan-700 font-bold">
        Exp: <span className="text-cyan-600">+{item.expReward}</span>
      </p>
    </div>
  </div>
</div>
</motion.div>),{
  duration: 3000, // stays for 3s 
  position: "top-center",
});
};

  return (
<>
    {/*Profile Top*/}
    <div className='bg-cover bg-no-repeat bg-[#111827] w-[100%] h-[43%] rounded-3xl flex flex-col p-3' /*style={{ backgroundImage: `url(${Example})` }}*/>

      <div className='h-[65%] flex flex-col items-center gap-3'>
        <div className='w-[10%] h-[80%] rounded-[100%] overflow-hidden'>
          <img
          src={userData?.profileImage || defaultAvatar}
          alt="Profile"
          className="w-full h-full object-cover"/>
        </div>
        <p className='font-exo font-bold text-white text-shadow-lg/30'>{userData?.username}</p>
        <p className='font-exo font-bold text-white tracking-wider text-shadow-lg/30 text-2xl'>HALL OF ACHIEVEMENTS</p>
      </div>
      <div className='h-[35%] w-[95%] m-auto flex items-end'>
        <div className='flex justify-around items-center h-[80%] w-[100%]'>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30 backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>HTML ACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: `${HtmlBar}%`}}></div>
        </div></div>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30  backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>CSSACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: `${CssBar}%`}}></div>
        </div></div>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30  backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>JAVASCRIPT ACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: `${JsBar}%`}}></div>
        </div></div>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30  backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>DATABASE QUERYING ACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: `${DatabaseBar}%`}}></div>
        </div></div>
        </div>
      </div>
    </div>
    <div className=' mt-[5px]'>
    <div className='max-h-[470px] overflow-y-scroll overflow-x-hidden Achievements-container scrollbar-custom p-5'>
      <div className='flex flex-col items-center gap-10'>
{/** HTML SECTION **/}
<h1 className='text-[#FF5733] font-exo font-bold text-5xl text-shadow-lg/30'>HTML ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
  {htmlLoading ? (
    <div className="col-span-full flex justify-center items-center">
      <Lottie animationData={Loading} loop={true} className="w-[20%]" />
    </div>
  ) : (
    HtmlData?.map((item) => {
      const isUnlocked = !!userAchievements?.[item.id];
      const isClaimed = isUnlocked && userAchievements[item.id]?.isClaimed;
      return (
        <div
          key={item.id}
          className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
            hover:scale-110 hover:shadow-lg hover:shadow-gray-400
            ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
          <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
            <img src={AchIcon} alt="Achievements Icon" className="w-20 h-20" />
            <hr className="border-t border-gray-700 w-full" />
            <h3 className="text-white text-lg font-bold">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.description} </p>
            <button
              onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
              className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
                ${isClaimed ? "bg-green-500 text-white"
                  : isUnlocked
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
                }`}>
              {isClaimed ? "COMPLETED" : isUnlocked ? "UNCLAIMED" : "LOCKED"}
            </button>
          </div>
        </div>
      );
    })
  )}
</div>
{/** CSS SECTION **/}
<h1 className='text-[#1E90FF] font-exo font-bold text-5xl text-shadow-lg/30'>CSS ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
  {cssLoading ? (
    <div className="col-span-full flex justify-center items-center">
      <Lottie animationData={Loading} loop={true} className="w-[20%]" />
    </div>
  ) : (
CssData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.isClaimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={AchIcon} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white"       // COMPLETED
  : isUnlocked 
  ? "bg-yellow-500 text-black"    // UNCLAIMED
  : "bg-red-500 text-white"       // LOCKED
  }`}> 
{isClaimed ? "COMPLETED" : isUnlocked
    ? "UNCLAIMED" : "LOCKED"}
</button>
      </div>
    </div>
  );
})
  )}
</div>
{/** JS SECTION **/}
<h1 className='text-[#F7DF1E] font-exo font-bold text-5xl text-shadow-lg/30'>JAVASCRIPT ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
  {jsLoading ? (
    <div className="col-span-full flex justify-center items-center">
      <Lottie animationData={Loading} loop={true} className="w-[20%]" />
    </div>
  ) : (
JsData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.isClaimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={AchIcon} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white"       // COMPLETED
  : isUnlocked 
  ? "bg-yellow-500 text-black"    // UNCLAIMED
  : "bg-red-500 text-white"       // LOCKED
  }`}> 
{isClaimed ? "COMPLETED" : isUnlocked
    ? "UNCLAIMED" : "LOCKED"}
</button>
      </div>
    </div>
  );
})
  )}
</div>
{/** JS SECTION **/}
<h1 className='text-[#4CAF50] font-exo font-bold text-5xl text-shadow-lg/30'>DATA QUERYING ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
  {dbLoading ? (
    <div className="col-span-full flex justify-center items-center">
      <Lottie animationData={Loading} loop={true} className="w-[20%]" />
    </div>
  ) : (
DatabaseData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.isClaimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={AchIcon} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white"       // COMPLETED
  : isUnlocked 
  ? "bg-yellow-500 text-black"    // UNCLAIMED
  : "bg-red-500 text-white"       // LOCKED
  }`}> 
{isClaimed ? "COMPLETED" : isUnlocked
    ? "UNCLAIMED" : "LOCKED"}
</button>
      </div>
    </div>
  );
})
  )}
</div>
      </div>
    </div>
    {LoadingClaim &&(
      <div className='fixed inset-0 z-50 flex items-center justify-center  bg-black/85'>      
      <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" /> 
      </div>
      )}

</div> 
</>
  )
}

export default Achievements