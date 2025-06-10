import { useEffect, useState } from 'react'
import HtmlIcons from '../assets/Images/html-Icon.png'
import CssIcons from '../assets/Images/css-Icon.png'
import JsIcons from '../assets/Images/js-Icon.png'
import {auth, db} from "../Firebase/Firebase"
import {doc, getDoc } from 'firebase/firestore';


function Dashboard() {

const [userDetails, setUserDetails] = useState("");

const fetchUserData =async()=>{
  auth.onAuthStateChanged(async (user)=>{
    const docRef = doc(db, "Users", user.uid);
    const docSnap =await getDoc(docRef);

    if(docSnap.exists()){
      setUserDetails(docSnap.data());
      console.log(docSnap.data());
    }else{
      console.log("USer not Logged In")
    }
  })
}
useEffect(()=>{
  fetchUserData();
}, [])

  return (
// Dashboard Wrapper
  <div className='h-[100%] w-[100%] flex flex-col gap-2'>
    {userDetails ? 
    (<div className='bg-[#111827] shadow-black shadow-md w-[100%] h-[40%] rounded-3xl flex items-center gap-5 p-10'>
      <div className='w-[30%] h-[90%] flex items-center flex-col gap-5 p-2'>
        <div className='bg-amber-300 w-[60%] h-[100%] rounded-[100%]'></div>
        <div className='text-white font-inter font-bold'>Bio</div>
      </div>
      <div className='h-[80%] w-[100%] flex flex-col p-2'>
        <p className='text-white font-inter font-bold'>Good to see you!</p>
        <h1 className='text-[5.6rem] text-white font-inter font-bold'>{userDetails.username}</h1>
        <p className='text-white font-inter font-bold'>Level 10</p>
            {/*Progress Bar*/}
        <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
          <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
        </div>
            {/*Progress Bar*/}
        <div className='flex w-[40%] justify-around mt-[10px]'>
          <p className='text-white font-inter font-bold'>User Xp</p>
          <div className='text-white font-inter font-bold'>User Money</div>
        </div>
      </div>
    </div>): (<p>Loading</p>)}
    {/*Profile*/}
    

    {/*Bottom Part*/}
    <div className='h-[100%] flex gap-2'>

      <div className='w-[70%] h-[100%] flex flex-col'>
        <div className='h-[40%] p-3 flex flex-col gap-5'>
          <h2 className='text-white font-exo font-bold text-[2rem]'>Jump Back In</h2>
          {/*Jump back in Button (JUST ADD BLINK TAG MYKE)*/}
          <div className='w-[100%] bg-[#111827] h-[60%] flex rounded-3xl border-black border-2'>
            <div className='bg-black w-[15%] h-[100%] text-white rounded-3xl flex items-center justify-center'>Lesson Symbol</div>
            <div className='p-2'>
              <p className='font-exo text-[1.4rem] text-white font-bold'>Lesson Name</p>
              <p className='font-exo text-gray-500 text-[0.8rem]'>Lesson Description</p>
            </div>
          </div>
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
                <img src={HtmlIcons} alt="" />
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
