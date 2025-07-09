import React from 'react'
import { Link } from 'react-router-dom'
import { getDoc, doc, } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

import { HiChevronLeft } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import { useEffect,useState } from 'react';

function LessonEdit() {

const gameModes = ["Lesson", "BugBust", "CodeRush", "CodeCrafter", "BrainBytes"];

const { subject,lessonId, levelId } = useParams()
const [levelData, setLevelData] = useState(null);
const [show, SetShow] = useState(false);
const [activeTab, setActiveTab] = useState("Lesson");
const [gamemodeData, setGameModeData] = useState();

// get The Level Data
const fetchLessons = async ()=>{
  try{
    const subjectDb = doc (db, subject, lessonId, "Levels", levelId);
    const subjDocs = await getDoc(subjectDb)
    if(subjDocs.exists()){
      setLevelData(subjDocs.data())
      console.log(subjDocs.data());
    }
  }catch(Error){
    console.log(Error)
  }
}
const fetchGameModes = async (activeTab)=>{
  const gmDb = doc(db,subject, lessonId, "Levels", levelId,"Gamemode", activeTab);
  const gmData = await getDoc(gmDb);
  if (gmData.exists){
    setGameModeData(gmData.data())
  }
}


useEffect (()=>{
  fetchLessons();
  if (activeTab){
    fetchGameModes(activeTab);
  }
  SetShow(true)
}, [activeTab])



  
  console.log("Level ID:", levelId);
  console.log("Subject:", subject);
  return (
    <div className='bg-[#25293B] h-fit p-2 overflow-hidden'>
    {/*Header*/}
      <div className='h-[35vh] flex flex-col p-4 justify-between gap-4 border-b-white border-b-2'>
        <div className='flex items-center gap-3.5'>
          <Link className='text-white text-[2rem]' to={'/Admin/ContentManagement'}><HiChevronLeft /></Link>
          <h1 className='text-white text-[3rem] font-exo font-bold'>DevLab</h1>
        </div>
        <div className='h-[100%] flex gap-5'> 
          <div className='w-[65%] border border-cyan-400 rounded-2xl bg-[#111827] p-5 flex flex-col gap-5'>
            <h1 className='text-white font-exo text-6xl'>Editing: </h1>
            <h2 className='text-white font-exo text-4xl' >{levelData?.title || 'wait'}</h2>
          </div>
          <div className='w-[35%] border border-cyan-400 rounded-2xl bg-[#111827] p-5 text-white font-exo'>
            <p className='text-white font-exo'>{levelData?.desc || 'wait'}</p>
          </div>
        </div>
      </div>
    {/*Contents*/}
      <div className='h-[140vh] overflow-hidden p-5 flex flex-col gap-5'>
        {/*Buttons*/}
        <div className='flex justify-around h-[3%]'>
          {gameModes.map((gm)=>(
            <button key={gm} className={`font-exo text-white text-[1.2rem] font-bold p-2 w-[15%] rounded-3xl bg-[#7F5AF0] hover:cursor-pointer transition duration-500 ${activeTab === gm
              ? "bg-[#563f99]"
              : "hover:scale-110"}`}
            onClick={()=> setActiveTab(gm)}
            >{gm}</button>
          ))}
        </div>
        {/*Buttons (END)*/}
        {/*Form*/}
          <form action="" className='h-[93%] flex justify-around p-4 flex-wrap'>
            {/*Level Title*/}
            <div className='border-cyan-400 border rounded-2xl w-[55%] h-[20%] p-4 bg-[#111827]'>
              <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Title: </h1>
              <textarea name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none' placeholder={levelData?.title || 'Loading'}></textarea>
            </div>

            {/*Level Description*/}
            <div className='border-cyan-400 border rounded-2xl w-[35%] h-[20%] p-4 bg-[#111827]'>
              <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Description:</h1>
              <textarea name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={levelData?.desc || 'Loading'}></textarea>
            </div>  

              {/*Instruction*/}
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Instruction:</h1>
                <textarea name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.instruction || 'NO DATA!'}></textarea>
              </div>

              {/*Coding Interface*/}
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.preCode || 'NO DATA!'}></textarea>
              </div>

              {/*Topic*/}
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Description:</h1>
                <textarea name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.topic || 'NO DATA!'}></textarea>
              </div>

              {/*Video SOON*/}
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Description:</h1>
                <textarea name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={levelData?.desc || 'NO DATA!'}></textarea>
              </div>

              <div className=' w-[95%] flex justify-between p-5 items-center'>
                <p className='text-white font-exo text-5xl underline'>{activeTab}</p>
                <button className='font-exo font-bold text-1xl text-white w-[13%] p-2 rounded-4xl bg-[#E35460] hover:cur'>Delete</button>
              </div>
                
            
              <button  className='w-[13%] p-1 rounded-2xl bg-[#5FDC70] text-white font-exo font-bold hover:cur'>Save Changes</button>

          </form>
      </div>






    </div>
  )
}

export default LessonEdit