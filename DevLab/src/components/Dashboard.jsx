// Ui
import HtmlIcons from '../assets/Images/html-Icon.png'
import CssIcons from '../assets/Images/css-Icon.png'
import DataIcons from '../assets/Images/Data-Icon.png'
import JsIcons from '../assets/Images/js-Icon.png'
import Loading from './Loading'
import '../index.css'
import defaultAvatar from './../assets/Images/profile_handler.png'
// Utils and Hooks
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import useLevelBar from './Custom Hooks/useLevelBar'
import useSubjProgressBar from './Custom Hooks/useSubjProgressBar'
import useUserInventory from './Custom Hooks/useUserInventory'
import useShopItems from './Custom Hooks/useShopItems'
import useAchievementsData from './Custom Hooks/useAchievementsData.jsx'
// Firebase
import { db} from "../Firebase/Firebase"
import {doc, getDoc } from 'firebase/firestore';

import useFetchUserData from './BackEnd_Data/useFetchUserData.jsx'

function Dashboard() {
  const icons = import.meta.glob('../assets/ItemsIcon/*', { eager: true });
  // User Details (Custom Hook)

  const { userData, isLoading, isError, refetch } = useFetchUserData();
  const {animatedExp} = useLevelBar();
  const {inventory, loading} = useUserInventory();
  // Subject ProgressbAr
  const {animatedBar: htmlProgress} = useSubjProgressBar("Html")
  const {animatedBar: CssProgress} = useSubjProgressBar("Css")
  const {animatedBar: JsProgress} = useSubjProgressBar("JavaScript")
  const {animatedBar: DbProgress} = useSubjProgressBar("Database")

  const [loadingDashboard , setLoading] = useState(true);
    // // Shop Items (Custom Hook)
    const {items} = useShopItems();    
    const { data: HtmlData, } = useAchievementsData("Html");
    const { data:CssData,  } = useAchievementsData("Css");
    const { data:JsData,  } = useAchievementsData("JavaScript");
    const { data:DatabaseData, } = useAchievementsData("Database");
    

useEffect(() => {
  const hasLoadedBefore = sessionStorage.getItem('dashboardLoaded');

  if (!hasLoadedBefore) {
    // First time in this session → show loader
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('dashboardLoaded', 'true');
    }, 7000);

    return () => clearTimeout(timer);
  } else {
    // Already loaded before → skip loader
    setLoading(false);
  }
}, []);

// THis will get the last open lesson 
  const [levelInfo, setLevelInfo] =useState();
useEffect(() => {
  const fetchLevelInfo = async () => {
    if (userData?.lastOpenedLevel) {
      const { subject, lessonId, levelId } = userData.lastOpenedLevel;
console.log(subject)
      // Full dynamic path
      const getUser = doc(db, subject, lessonId, "Levels", levelId);
      const userDocs = await getDoc(getUser);

      if (userDocs.exists()) {
        setLevelInfo(userDocs.data());
      } else {
        console.log("Level document not found");
      }
    }
  };

  fetchLevelInfo();
}, [userData]);

  // Show Loading Screen first
  // Show Loading Screen
if (loadingDashboard) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50">
      <Loading />
    </div>
  );
}
  return (
// Dashboard Wrapper
  <div className='h-[100%] w-[100%] flex flex-col gap-2'>
    { !isLoading ? 
    (<div
  className="shadow-black shadow-md w-[100%] min-h-[40%] rounded-3xl flex items-center gap-5 p-5 bg-cover bg-center"
  style={{
    backgroundImage: `url(${userData?.backgroundImage})`,
    backgroundColor: "#111827", // fallback if no image
  }}>
  <div className="w-[40%] h-[90%] flex items-center flex-col gap-5 p-2">
    <div className="w-[55%] h-[80%] rounded-full overflow-hidden">
      <img
        src={userData?.profileImage || defaultAvatar}
        alt="Profile"
        className="w-full h-full object-cover"/>
    </div>

    <div className="text-white font-inter text-[0.85rem] break-words w-[60%] rounded-2xl backdrop-blur-[10px] text-shadow-lg/60">
      <p className="text-center">{userData?.bio}</p>
    </div>
  </div>

  <div className="h-auto w-[100%] flex flex-col p-2 gap-2 backdrop-blur-[2px] rounded-3xl">
    <p className="text-white font-inter font-bold text-shadow-lg/60">Good to see you!</p>
    <h1 className="sm:text-[3rem] md:text-[4rem] lg:text-[5rem] text-white font-inter font-bold break-words leading-tight text-shadow-lg/60">
      {userData?.username}
    </h1>
    <p className="text-white font-inter font-bold mb-0.5 text-shadow-lg/60">
      Level {userData?.userLevel}
    </p>
    {/* Progress Bar */}
    <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className="h-4 rounded-full dark:bg-[#2CB67D]"
        style={{ width: `${(animatedExp / 100) * 100}%` }}
      ></div>
    </div>
    {/* Progress Bar */}  
    <div className="flex w-[40%] justify-around mt-[10px]">
      <p className="text-white font-inter font-bold text-shadow-lg/60">
        User Xp: {userData?.exp} / 100
      </p>
      <div className="text-white font-inter font-bold text-shadow-lg/60">
        User Money: {userData?.coins}
      </div>
    </div>
  </div>
</div>
): 
    /*LOADING*/
(<div className='bg-[#111827] shadow-black shadow-md w-[100%] min-h-[40%] rounded-3xl flex items-center gap-5 p-10'>
  <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center h-[100%]">
    <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded-sm sm:w-96 dark:bg-gray-700">
        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
    </div>
    <div className="w-full">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
    </div>
      <span className="sr-only">Loading...</span>
    </div>
  </div>)}
    {/*Profile*/}
    

    {/*Bottom Part*/}
    <div className='flex gap-2 h-[60%]'>

      <div className='w-[70%] h-[100%] flex flex-col'>
        <div className='h-[35%] p-1 flex flex-col gap-4 '>
          <h2 className='text-white font-exo font-bold text-[2rem] text-shadow-lg/60'>Jump Back In</h2>
          {/*Jump back in Button (JUST ADD LINK TAG MYKE)*/}
          {levelInfo ? (<Link to={`/Main/Lessons/${userData.lastOpenedLevel.subject}/${userData.lastOpenedLevel.lessonId}/${userData.lastOpenedLevel.levelId}/Stage1/Lesson`} className='h-[100%]'>
          <div className='w-[100%] bg-[#111827] flex rounded-3xl border-black border-2 gap-4 hover:scale-102 cursor-pointer duration-300 min-h-[100px]'>
            <div className='bg-black min-w-[15%] text-white rounded-3xl flex items-center justify-center text-[3rem] p-1'> <span className='pb-4'>{levelInfo.symbol}</span></div>
            <div className='p-2 flex-col flex gap-2'>
              <p className='font-exo text-[1.4rem] text-white font-bold'>{levelInfo.title}</p>
              <p className='font-exo text-gray-500 text-[0.8rem] line-clamp-2'> {levelInfo.description}</p>
            </div>
          </div>
          </Link>):(<div className='w-[100%] bg-[#111827] rounded-3xl border-black border-2 p-5 '>
            
<div role="status" className="max-w-sm animate-pulse min-h-[100%]">
    <div className ="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className ="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className ="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <span className ="sr-only">Loading...</span>
</div>
          </div>)}      
        </div>

        <div className='flex flex-col p-3 gap-5 flex-grow mt-3'>
          <h2 className='text-white font-exo font-bold text-[2rem] text-shadow-lg/60'>View Your Progress</h2>
          <div className='w-[100%] h-[80%] flex items-center justify-around'>
            
            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-4'>
              <div className='w-[95%] h-[60%] bg-[radial-gradient(circle,_#FFD700_0%,_#FF4500_100%)] m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={HtmlIcons} alt="" />
              </div>
              <div className='flex items-center p-2 gap-2'>
                <p className='font-exo text-white textSmall-laptop max-w-[65%]'>HTML Development</p>
                <div className="relative w-13 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none"/>
                    <circle cx="50" cy="50" r="45" stroke="#2CB67D" strokeWidth="10" fill="none" strokeDasharray="282.6" strokeDashoffset={`${282.6 - (htmlProgress / 100) * 282.6}`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-bold text-gray-700 dark:text-white">{Math.round(htmlProgress)}%</div>
                </div>
              </div>
            </div>

            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-4'>
              <div className='w-[95%] h-[60%] bg-[radial-gradient(circle,_#00CFFF_0%,_#1E90FF_100%)]  m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={CssIcons} alt="" />
              </div>
              <div className='flex items-center p-2 gap-2'>
                <p className='font-exo text-white text-[1rem] textSmall-laptop max-w-[65%]'>Css Development</p>
                <div className="relative w-13 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none"/>
                    <circle cx="50" cy="50" r="45" stroke="#2CB67D" strokeWidth="10" fill="none" strokeDasharray="282.6" strokeDashoffset={`${282.6 - (CssProgress / 100) * 282.6}`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-bold text-gray-700 dark:text-white">{Math.round(CssProgress)}%</div>
                </div>
              </div>
            </div>

            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-4'>
              <div className='w-[95%] h-[60%] bg-[radial-gradient(circle,_#fef102_0%,_#ff8000_100%)] m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={JsIcons} alt="" />
              </div>
              <div className='flex items-center p-2 gap-2'>
                <p className='font-exo text-white text-[1rem] textSmall-laptop max-w-[65%]  '>JavaScript Development</p>
                <div className="relative w-13 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none"/>
                    <circle cx="50" cy="50" r="45" stroke="#2CB67D" strokeWidth="10" fill="none" strokeDasharray="282.6" strokeDashoffset={`${282.6 - (JsProgress / 100) * 282.6}`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-bold text-gray-700 dark:text-white">{Math.round(JsProgress)}%</div>
                </div>
              </div>
            </div>
            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-4'>
              <div className='w-[95%] h-[60%]  bg-[radial-gradient(circle,_#4cd137_0%,_#218c74_100%)] m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={DataIcons} alt="" />
              </div>
              <div className='flex items-center p-2 gap-2'>
                <p className='font-exo text-white textSmall-laptop max-w-[65%]'>Database Querying</p>
                <div className="relative w-13 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none"/>
                    <circle cx="50" cy="50" r="45" stroke="#2CB67D" strokeWidth="10" fill="none" strokeDasharray="282.6" strokeDashoffset={`${282.6 - (DbProgress / 100) * 282.6}`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-bold text-gray-700 dark:text-white">{Math.round(DbProgress)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Inventory*/}
<div className='bg-[#111827] border-2 w-[30%] h-[95%] rounded-3xl p-3 flex flex-col gap-3  '>
  <h1 className='text-white font-exo text-[2.5em] font-bold p-3'>Inventory</h1>
  <div className='overflow-scroll overflow-x-hidden h-[90%] p-2 flex flex-col gap-4 scrollbar-custom'>
{inventory && inventory.length > 0 ? (
  inventory.map(item => (
    <div 
      key={item.id}
      className="border rounded-2xl border-gray-600 min-h-[25%] max-h-[25%] bg-[#0D1117] flex items-center p-1 justify-around gap-8"
    >
      <div className="rounded-2xl bg-gray-700 min-w-[20%] h-[95%] p-2">
        <img 
          src={icons[`../assets/ItemsIcon/${item.Icon}`]?.default} 
          alt={item.title} 
          className="w-full h-full"
        />
      </div>
      <h2 className="text-2xl font-exo text-gray-300 min-w-[45%] mediuText-laptop">
        {item.title}
      </h2>
      <p className="rounded-lg bg-gray-700 p-2 text-[0.9rem] font-exo text-white">
        {item.quantity}
      </p>
    </div>
  ))
) : (
  <p className="text-gray-400 text-lg font-exo p-3">No Items</p>
)}

  </div>

</div>

    </div>
{/*END DASHBOARD*/}
  </div>
  )
}

export default Dashboard
