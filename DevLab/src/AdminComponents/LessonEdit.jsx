import React from 'react'
import { Link } from 'react-router-dom'
import { getDoc, doc,updateDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

import { HiChevronLeft } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import { useEffect,useState } from 'react';

import { toast } from 'react-toastify';



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

const [editedTitle, setEditedTitle] = useState(null);
const [editedDesc, setEditedDesc] = useState(null);

const [instruction, setInstruction] = useState('');
const [topic, setTopic] = useState('');
const [preCode, setPreCode] = useState('');
const [hint, setHint] = useState('');
const [timer, setTimer] = useState('');
const [answers, setAnswers] = useState({
  A: '',
  B: '',
  C: '',
  D: '',
  correct: ''
});


// This is for saving and adding game mode (if hindi na eexist)
const handleSave = async(e)=>{
  e.preventDefault();
  try{
    // Save Level Data
    const levelDb = doc(db, subject,lessonId, "Levels",levelId);
    await updateDoc(levelDb,{
      title: editedTitle || levelData.title,
      desc: editedDesc || levelData.desc
    })

    const gamemodeDb = doc(db, subject, lessonId, "Levels", levelId, "Gamemode", activeTab);

    let gamemodePayload = {
      type: activeTab, 
    };
    if (activeTab === "Lesson" || activeTab === "BugBust" || activeTab === "CodeCrafter") {
      gamemodePayload = {
        ...gamemodePayload,
        instruction,
        topic,
        preCode,
        hint,
      };
    }if (activeTab === "CodeRush") {
      gamemodePayload = {
        ...gamemodePayload,
        instruction,
        topic,
        preCode,
        hint,
        timer,
      };
    }if (activeTab === "BrainBytes") {
      gamemodePayload = {
        ...gamemodePayload,
        question: instruction,
        options: {
          A: answers.A,
          B: answers.B,
          C: answers.C,
          D: answers.D,
        },
        correctAnswer: answers.correct,
      };
    }await setDoc(gamemodeDb, gamemodePayload, { merge: true });





      toast.success("Save Changes",{
          position:"top-center",
          theme: "colored"})
        setTimeout(()=>{
          window.location.reload();},500)
  }catch(error){

  }
}
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
          <form action="" className='h-[93%] flex justify-around p-4 flex-wrap' onSubmit={handleSave} type="submit">
            {/*Level Title*/}
            <div className='border-cyan-400 border rounded-2xl w-[55%] h-[20%] p-4 bg-[#111827]'>
              <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Title: </h1>
              <textarea 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none' placeholder={levelData?.title || 'Loading'}></textarea>
            </div>

            {/*Level Description*/}
            <div className='border-cyan-400 border rounded-2xl w-[35%] h-[20%] p-4 bg-[#111827]'>
              <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Description:</h1>
              <textarea 
              onChange={(e) => setEditedDesc(e.target.value)}
              name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={levelData?.desc || 'Loading'}></textarea>
            </div>  

              {/*Instruction*/}
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Instruction:</h1>
                <textarea 
                onChange={(e)=> setInstruction(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.instruction || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>

              {/*Topic*/}
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Description:</h1>
                <textarea 
                onChange={(e)=> setTopic(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.topic || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              {activeTab === "Lesson" ?(
              <>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea 
                onChange={(e)=> setPreCode(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.preCode || 'This mode doesn`t exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Description:</h1>
                <textarea name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={levelData?.desc || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              </>
              ):activeTab === "BugBust" ?(
              /*Hint For BugBust*/
              <>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea 
                onChange={(e)=> setPreCode(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.preCode || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Hint:</h1>
                <textarea 
                onChange={(e)=> setHint(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.hint || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              </>
              ):activeTab === "CodeRush" ?(
                <>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea 
                onChange={(e)=> setPreCode(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.preCode || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827] flex flex-col gap-5'>
                <div className='h-[40%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Hint:</h1>
                  <textarea 
                  onChange={(e)=> setHint(e.target.value)}
                  name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.hint || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
                </div>
                <div className='h-[50%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Timer: </h1>
                  <input 
                  onChange={(e) => setTimer(Number(e.target.value))}
                  type="number" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none text-5xl' placeholder={gamemodeData?.hint || 'Enter Seconds'}/>
                </div>
              </div>
              </>
              ):activeTab === "CodeCrafter"?(
                <>
              <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea 
                onChange={(e)=> setPreCode(e.target.value)}
                name="" id="" className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.preCode || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
              </div>
              <div  className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827] flex flex-col gap-5'> 
                <div className='h-[40%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Hint: </h1>
                  <textarea 
                  onChange={(e)=> setHint(e.target.value)}
                  name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={gamemodeData?.hint || 'This mode doesnt exist yet. Fill in the fields and click Save to create it.'}></textarea>
                </div>
                <div className='h-[50%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Replicate (Optional): </h1>
                  <div className='border h-[70%] rounded-2xl bg-[#0d13207c] border-gray-700'></div>
                </div>
              </div>
                </>
              ):activeTab === "BrainBytes"?(
                <>
                  <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827] flex flex-col justify-around'>
                    <input 
                    onChange={(e) => setAnswers(prev => ({...prev, A: e.target.value}))}
                    type="text" placeholder='Answer A' className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'/>
                    <input 
                    onChange={(e) => setAnswers(prev => ({...prev, B: e.target.value}))}
                    type="text" placeholder='Answer B' className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'/>
                    <input 
                    onChange={(e) => setAnswers(prev => ({...prev, C: e.target.value}))}
                    type="text" placeholder='Answer C' className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'/>
                    <input 
                    onChange={(e) => setAnswers(prev => ({...prev, D: e.target.value}))}
                    type="text" placeholder='Answer D' className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'/>
                    <input 
                    onChange={(e) => setAnswers(prev => ({...prev, correct: e.target.value}))}
                    type="text" placeholder='Correct Answer' className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'/>
                  </div>
                </>
              ):null}
      
              {/*Delete Button*/}
              <div className=' w-[95%] flex justify-between p-5 items-center'>
                <p className='text-white font-exo text-5xl underline'>{activeTab}</p>
                <button className='font-exo font-bold text-1xl text-white w-[13%] p-2 rounded-4xl bg-[#E35460] hover:cursor-pointer  hover:scale-105 transition duration-300 ease-in-out  hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]'>Delete</button>
              </div>
                
              {/*Save Button*/}
              <button  className='w-[13%] p-1 rounded-2xl bg-[#5FDC70] text-white font-exo font-bold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(95,220,112,0.8)]' >Save Changes</button>

          </form>
      </div>






    </div>
  )
}

export default LessonEdit