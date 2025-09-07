
import Example from '../assets/Images/Example1.jpg'
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import useAchievementsData from './Custom Hooks/useAchievementsData.jsx'
import useUserDetails from './Custom Hooks/useUserDetails'
import useUserAchievements from './Custom Hooks/useUserAchievements.jsx'

import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

import { useMutation, useQueryClient } from '@tanstack/react-query';

import '../index.css'
import Lottie from "lottie-react";
import Loading from '../assets/Lottie/LoadingDots.json'
import { useState } from 'react'  

function Achievements() {

  const { data: HtmlData, isLoading: loading, error } = useAchievementsData("Html");
  const { data:CssData,  } = useAchievementsData("Css");
  const { data:JsData,  } = useAchievementsData("JavaScript");
  const { data:DatabaseData, } = useAchievementsData("Database");
  const {Userdata, isLoading } = useUserDetails();

 // Use your new hook here
const { data: userAchievements, } = useUserAchievements(Userdata?.uid);
const [LoadingClaim , setLoadingClaim] = useState(false);

const queryClient = useQueryClient();
const claimMutation = useMutation({
mutationFn: async (achievement) => {
  const userId = Userdata.uid;
  const userRef = doc(db, "Users", userId);
  const userAchRef = doc(db, "Users", userId, "Achievements", achievement.id);
  //Mark achievement as claimed
  await updateDoc(userAchRef, { claimed: true });
  //  Calculate EXP, Level, and Coins
  let newExp = (Userdata.exp || 0) + (achievement.expReward || 0);
  let newLevel = Userdata.userLevel || 1;
  let newCoins = (Userdata.coins || 0) + (achievement.coinsReward || 0);
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
    queryClient.invalidateQueries(["userAchievements", Userdata?.uid]);
    queryClient.invalidateQueries(["User_Details", Userdata?.uid]); // refetch coins/exp too
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

const showClaimToast = (item) => {
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-green-700 flex-col p-4">
          <h1 className='font-exo text-green-700 font-bold text-2xl'>Congratulations</h1>
          <div>        
          <p>You claimed <span className="font-bold text-purple-700">{item.title}</span> Reward!</p>
        <div className='flex gap-5'>
          <p className='text-sm'>DevCoins: +<span className='font-bold text-yellow-400'>{item.coinsReward}</span></p>
          <p className='text-sm'>Exp: +<span className='font-bold text-cyan-400'>{item.expReward}</span></p>
        </div></div>

      </motion.div>),
    {
      duration: 2000, // ⏱ disappears after 2s
      position: "top-center",
    }
  );
};

  return (
<>
    {/*Profile Top*/}
    <div className='bg-cover bg-no-repeat bg-[#111827] w-[100%] h-[43%] rounded-3xl flex flex-col p-3' /*style={{ backgroundImage: `url(${Example})` }}*/>

      <div className='h-[65%] flex flex-col items-center gap-3'>
        <div className='w-[10%] h-[80%] rounded-[100%] overflow-hidden'>
          <img
          src={Userdata?.profileImage || "/defaultAvatar.png"}
          alt="Profile"
          className="w-full h-full object-cover"/>
        </div>
        <p className='font-exo font-bold text-white text-shadow-lg/30'>{Userdata?.username}</p>
        <p className='font-exo font-bold text-white tracking-wider text-shadow-lg/30 text-2xl'>HALL OF ACHIEVEMENTS</p>
      </div>
      <div className='h-[35%] w-[95%] m-auto flex items-end'>
        <div className='flex justify-around items-center h-[80%] w-[100%]'>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30 backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>HTML ACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
        </div></div>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30  backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>CSSACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
        </div></div>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30  backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>JAVASCRIPT ACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
        </div></div>
          <div className='w-[20%] h-[80%] font-exo font-bold text-white text-shadow-lg/30  backdrop-blur-[20px] rounded-xl flex flex-col gap-2 items-center justify-center'>DATABASE QUERYING ACHIEVEMENTS  <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
        </div></div>
        </div>
      </div>

    </div>

    {/**/}
    <div className=' mt-[5px]'>
    <div className='max-h-[470px] overflow-y-scroll overflow-x-hidden Achievements-container scrollbar-custom p-5'>

      <div className='flex flex-col items-center gap-10'>
        <h1 className='text-[#FF5733] font-exo font-bold text-5xl text-shadow-lg/30'>HTML ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
{HtmlData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.claimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}> 
  {isClaimed ? "COMPLETED" : "UNCLAIMED"}
</button>

      </div>
    </div>
  );
})}
</div>
        <h1 className='text-[#1E90FF] font-exo font-bold text-5xl text-shadow-lg/30'>CSS ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
{CssData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.claimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}> 
  {isClaimed ? "COMPLETED" : "UNCLAIMED"}
</button>
      </div>
    </div>
  );
})}
</div>
        <h1 className='text-[#F7DF1E] font-exo font-bold text-5xl text-shadow-lg/30'>JAVASCRIPT ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
{JsData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.claimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}> 
  {isClaimed ? "COMPLETED" : "UNCLAIMED"}
</button>
      </div>
    </div>
  );
})}
</div>
        <h1 className='text-[#4CAF50] font-exo font-bold text-5xl text-shadow-lg/30'>DATA QUERYING ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
{DatabaseData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.claimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />  
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}> 
  {isClaimed ? "COMPLETED" : "UNCLAIMED"}
</button>
      </div>
    </div>
  );
})}
</div>
      </div>
    </div>
    {LoadingClaim &&(
      <div className='fixed inset-0 z-50 flex items-center justify-center  bg-black/99'>      
      <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" /> 
      </div>
      )}
</div> 
</>
  )
}

export default Achievements