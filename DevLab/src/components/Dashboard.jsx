import { useEffect, useState } from 'react'
import HtmlIcons from '../assets/Images/html-Icon.png'
import CssIcons from '../assets/Images/css-Icon.png'
import DataIcons from '../assets/Images/Data-Icon.png'
import JsIcons from '../assets/Images/js-Icon.png'
import { db} from "../Firebase/Firebase"
import {doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom'

import useUserDetails from './Custom Hooks/useUserDetails'
import useLevelBar from './Custom Hooks/useLevelBar'


function Dashboard() {

  // User Details (Custom Hook)
  const {Userdata, isLoading } = useUserDetails();
  const {animatedExp} = useLevelBar();



// THis will get the last open lesson 
  const [levelInfo, setLevelInfo] =useState();
useEffect(() => {
  const fetchLevelInfo = async () => {
    if (Userdata?.lastOpenedLevel) {
      const { lessonId, lessonDocId, levelId } = Userdata.lastOpenedLevel;

      // Full dynamic path
      const getUser = doc(db, lessonId, lessonDocId, "Levels", levelId);
      const userDocs = await getDoc(getUser);

      if (userDocs.exists()) {
        setLevelInfo(userDocs.data());
      } else {
        console.log("Level document not found");
      }
    }
  };

  fetchLevelInfo();
}, [Userdata]);

  return (
// Dashboard Wrapper
  <div className='h-[100%] w-[100%] flex flex-col gap-2'>
    { !isLoading ? 
    (<div className='bg-[#111827] shadow-black shadow-md w-[100%] min-h-[40%] rounded-3xl flex items-center gap-5 p-10'>
      <div className='w-[30%] h-[90%] flex items-center flex-col gap-5 p-2'>
        <div className='bg-amber-300 w-[65%] h-[90%] rounded-[100%]'></div>
        <div className='text-white font-inter text-[0.85rem] break-words w-[60%]'><p className=' text-center'>{Userdata.bio}</p></div>
      </div>
      <div className='h-[80%] w-[100%] flex flex-col p-2'>
        <p className='text-white font-inter font-bold'>Good to see you!</p>
        <h1 className='text-[5.6rem] text-white font-inter font-bold'>{Userdata.username}</h1>
        <p className='text-white font-inter font-bold mb-0.5'>Level {Userdata.level}</p>
            {/*Progress Bar*/}
        <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700 ">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{ width: `${(animatedExp / 100) * 100}%` }}></div>
        </div>
            {/*Progress Bar*/}
        <div className='flex w-[40%] justify-around mt-[10px]'>
          <p className='text-white font-inter font-bold'>User Xp: {Userdata.exp} / 100</p>
          <div className='text-white font-inter font-bold'>User Money: {Userdata.coins}</div>
        </div>
      </div>
    </div>): 
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
    <div className='h-[100%] flex gap-2'>

      <div className='w-[70%] h-[100%] flex flex-col'>
        <div className='h-[40%] p-3 flex flex-col gap-5'>
          <h2 className='text-white font-exo font-bold text-[2rem]'>Jump Back In</h2>
          {/*Jump back in Button (JUST ADD LINK TAG MYKE)*/}

          {levelInfo ? (<Link to={`/Main/Lessons/${Userdata.lastOpenedLevel.lessonId}/${Userdata.lastOpenedLevel.lessonDocId}/${Userdata.lastOpenedLevel.levelId}`} className='h-full'>
          <div className='w-[100%] bg-[#111827] min-h-[90%] flex rounded-3xl border-black border-2 gap-4  hover:scale-102 cursor-pointer duration-500'>
            <div className='bg-black w-[15%] h-[100%] text-white rounded-3xl flex items-center justify-center  text-[4rem] p-1'> {levelInfo.symbol}</div>
            <div className='p-2'>
              <p className='font-exo text-[1.4rem] text-white font-bold'> {levelInfo.title}</p>
              <p className='font-exo text-gray-500 text-[0.8rem]'> {levelInfo.desc}</p>
            </div>
          </div>
          </Link>):(   <div className='w-[100%] bg-[#111827] min-h-[60%] rounded-3xl border-black border-2 p-5'>
            
<div role="status" className="max-w-sm animate-pulse  min-h-[60%]">
    <div className ="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className ="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className ="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className ="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <span className ="sr-only">Loading...</span>
</div>


          </div>)}
          
        </div>

        <div className='h-[70%] flex flex-col p-3 gap-5'>
          <h2 className='text-white font-exo font-bold text-[2rem]'>View Your Progress</h2>
          <div className='w-[100%] h-[80%] flex items-center justify-around'>
            
            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-7'>
              <div className='w-[95%] h-[60%] bg-[radial-gradient(circle,_#FFD700_0%,_#FF4500_100%)] m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={HtmlIcons} alt="" />
              </div>
              <p className='font-exo text-white'>HTML Development</p>
            </div>

            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-7'>
              <div className='w-[95%] h-[60%] bg-[radial-gradient(circle,_#00CFFF_0%,_#1E90FF_100%)]  m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={CssIcons} alt="" />
              </div>
              <p className='font-exo text-white'>CSS Development</p>
            </div>

            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-7'>
              <div className='w-[95%] h-[60%] bg-[radial-gradient(circle,_#fef102_0%,_#ff8000_100%)] m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={JsIcons} alt="" />
              </div>
              <p className='font-exo text-white'>JavaScript Development</p>
            </div>

            <div className='bg-[#111827] border-2 w-[20%] h-[100%] flex rounded-2xl p-2 flex-col items-center gap-7'>
              <div className='w-[95%] h-[60%]  bg-[radial-gradient(circle,_#4cd137_0%,_#218c74_100%)] m-auto mt-0 mb-0 rounded-2xl flex items-center justify-center'>
                <img src={DataIcons} alt="" />
              </div>
              <p className='font-exo text-white'>Database Development</p>
            </div>
          </div>
        </div>
      </div>
        <div className=' bg-[#111827] border-2  w-[30%] h-[100%] rounded-3xl'>

        </div>
    </div>
{/*END DASHBOARD*/}
  </div>
  )
}

export default Dashboard
