
import Example from '../assets/Images/Example1.jpg'
import { HTML_Data,CSS_Data,Js_Data,Query_Data } from '../Data/Achievements_Data'

import useAchievementsData from './Custom Hooks/useAchievementsData.jsx'
import useUserDetails from './Custom Hooks/useUserDetails'
import useUserAchievements from './Custom Hooks/useUserAchievements.jsx'

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

import { useMutation, useQueryClient } from '@tanstack/react-query';

import '../index.css'

function Achievements() {

  const { data: HtmlData, isLoading: loading, error } = useAchievementsData("Html");
  const { data:CssData,  } = useAchievementsData("Css");
  const { data:JsData,  } = useAchievementsData("JavaScript");
  const { data:DatabaseData, } = useAchievementsData("Database");
  const {Userdata, isLoading } = useUserDetails();

 // Use your new hook here
const { data: userAchievements, } = useUserAchievements(Userdata?.uid);


console.log(HtmlData)

const queryClient = useQueryClient();

const claimMutation = useMutation({
  mutationFn: async (achievement) => {
    const userAchRef = doc(db, "Users", Userdata.uid, "Achievements", achievement.id);
    await updateDoc(userAchRef, { claimed: true });
    return achievement.id;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['userAchievements', Userdata?.uid]);
  },
  onError: (error) => {
    console.error("Error claiming achievement:", error);
  }
});



  return (
    
<>
    {/*Profile Top*/}
    <div className='bg-cover bg-no-repeat bg-[#111827] w-[100%] h-[43%] rounded-3xl flex flex-col p-3' /*style={{ backgroundImage: `url(${Example})` }}*/>

      <div className='h-[65%] flex flex-col items-center gap-3'>
        <div className='bg-amber-300 w-[10%] h-[80%] rounded-[100%]'></div>
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
    <div className='max-h-[470px] overflow-y-scroll overflow-x-hidden Achievements-container
    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 p-5'>

      <div className='flex flex-col items-center gap-10'>
        <h1 className='text-[#FF5733] font-exo font-bold text-5xl text-shadow-lg/30'>HTML ACHIEVEMENTS</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
{HtmlData?.map((item) => {
  const isUnlocked = !!userAchievements[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.claimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
onClick={() => isUnlocked && !isClaimed && claimMutation.mutate(item)}
>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
        <span className={`px-4 py-1 rounded-full font-semibold 
          ${isClaimed ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}>
          {isClaimed ? "COMPLETED" : "UNCLAIMED"}
        </span>
      </div>
    </div>
  );
})}

        </div>
        <h1 className='text-[#1E90FF] font-exo font-bold text-5xl text-shadow-lg/30'>CSS ACHIEVEMENTS</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
          {CSS_Data.map((item)=>(
        <div 
        key={item.key}
        className="p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500  transition duration-500 hover:scale-110 hover:shadow-lg hover:shadow-gray-400">
          <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
            <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
            <hr className="border-t border-gray-700 w-full" />
            <h3 className="text-white text-lg font-bold">{item.label}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
            <span className="bg-green-500 text-white px-4 py-1 rounded-full font-semibold">COMPLETED</span>
          </div>
        </div>
          ))}
        </div>
        <h1 className='text-[#F7DF1E] font-exo font-bold text-5xl text-shadow-lg/30'>JAVASCRIPT ACHIEVEMENTS</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
          {Js_Data.map((item)=>(
        <div 
        key={item.key}
        className="p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500  transition duration-500 hover:scale-110 hover:shadow-lg hover:shadow-gray-400">
          <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
            <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
            <hr className="border-t border-gray-700 w-full" />
            <h3 className="text-white text-lg font-bold">{item.label}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
            <span className="bg-green-500 text-white px-4 py-1 rounded-full font-semibold">COMPLETED</span>
          </div>
        </div>
          ))} 
        </div>
        <h1 className='text-[#4CAF50] font-exo font-bold text-5xl text-shadow-lg/30'>DATA QUERYING ACHIEVEMENTS</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
          {Query_Data.map((item)=>(
        <div 
        key={item.key}
        className="p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500  transition duration-500 hover:scale-110 hover:shadow-lg hover:shadow-gray-400">
          <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
            <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
            <hr className="border-t border-gray-700 w-full" />
            <h3 className="text-white text-lg font-bold">{item.label}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
            <span className="bg-green-500 text-white px-4 py-1 rounded-full font-semibold">COMPLETED</span>
          </div>
        </div>
          ))}
        </div>
        
        
      </div>
    </div>

</div>





   </>
  )
}

export default Achievements