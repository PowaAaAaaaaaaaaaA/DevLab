import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

import { HiArrowDownTray } from "react-icons/hi2";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Animation from '../assets/Lottie/LoadingLessonsLottie.json'
import Lottie from "lottie-react";

import AddContent from "./AddContent";

import { useNavigate } from "react-router-dom";

function ContentManagement() {

  const Navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Html");
  const [lessons, setLessons] = useState([]);
const subjects = ["Html", "Css", "JavaScript-FrontEnd","JavaScript-BackEnd", "Database"];

  // Card PopUp Animation AND for Lottie Loading
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  // For PopUP(Adding Level/Lesson)Transition
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

const openPopup = () => {
  setShowPopup(true);
  setTimeout(() => setPopupVisible(true), 20); 
};
const closePopup = () => {
  setPopupVisible(false);
  setTimeout(() => setShowPopup(false), 100); 
};
// For PopUP(Adding Level/Lesson) Transition (End)

  const fetchLessons = async (subject) => {
    try {
      setLoading(true);
      setShow(false);
      const subjectDb = collection(db, subject);
      const subjDocs = await getDocs(subjectDb);
      
      const lessonData = await Promise.all(
        subjDocs.docs.map(async (lessonDoc) => {
          const levelsDb = collection(db, subject, lessonDoc.id, "Levels");
          const levelsDocs = await getDocs(levelsDb);
          const levels = await Promise.all(
          levelsDocs.docs.map(async (levelDoc) => {
            const gamemodeRef = collection(db, subject, lessonDoc.id, "Levels", levelDoc.id, "Gamemode");
            const gamemodeSnap = await getDocs(gamemodeRef);
            const gamemodes = gamemodeSnap.docs.map((gm) => ({
              id: gm.id,
              ...gm.data(),
            }));
            return {
              id: levelDoc.id,
              ...levelDoc.data(),
              gamemodes, // Add gamemodes to each level
            };
          })
        );
          return {
            id: lessonDoc.id,
            title: lessonDoc.data().title,
            levels,
          };
        })
      );
      
      setLessons(lessonData);
      setLoading(false);
      setTimeout(()=> setShow(true), 100)
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };


  useEffect(() => {
    if (activeTab) {
      fetchLessons(activeTab);
    }
  }, [activeTab]);




  return (
<div className='h-full overflow-hidden'>
    {/*Header*/}
      <div className='border-b border-white h-[26%] flex flex-col justify-between p-5'>
        <div className='flex text-white font-exo justify-between p-10'>
          <h1 className='text-[3.2rem] font-bold'>Content Management</h1>
          <button 
            onClick={openPopup}
          className='rounded-2xl w-[15%] h-[60%] flex gap-5 items-center justify-center bg-[#4CAF50] font-bold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(95,220,112,0.8)]'><span className=" text-2xl"><HiArrowDownTray /></span>New Activity</button>
        </div>
        <div className="flex justify-around">
          {subjects.map((subject)=>(
            <button key={subject}
            className={`font-exo rounded-2xl p-1 text-[1.5rem] w-[20%] font-bold text-white transition duration-500 hover:cursor-pointer ${
              activeTab === subject
              ? "text-shadow-lg text-shadow-[#6b6bc5]"
              : " hover:bg-gray-600"
            }`}
            onClick={()=> setActiveTab(subject)}
            >
            {subject}
            </button>
          ))}
        </div>
      </div> {/*header End*/}
      {loading ? (<Lottie animationData={Animation} loop={true} className="w-[60%] h-[70%] m-auto" />):
      /* Lessons and Levels */
      (<div className=" h-[74%] p-5 overflow-scroll overflow-x-hidden mt-2
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {lessons.map((lesson)=>(
          <div key={lesson.id} className="p-5 flex flex-col gap-15">
            <h2 className="text-white font-exo text-5xl">{lesson.title}</h2>
            <div className="flex flex-wrap justify-center gap-10">
            {lesson.levels.map((level)=>(
          <>
          {/*Lesson Card*/}
            <div key={level.id} className={`border-[#56EBFF] border w-[42%] p-10 flex flex-col gap-4 rounded-2xl bg-[#111827] relative transition-all duration-400 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <h2 className="text-3xl font-exo font-bold text-white">{level.title}</h2>
              <p className="text-white font-exo text-[0.8rem]">{level.desc}</p>
              <div className="flex gap-5">
                {level.gamemodes && level.gamemodes.map((gm) => (
                <div key={gm.id} className="rounded bg-[#1F2937] p-3  ">
                  <p className="text-white text-sm">{gm.id}</p>
                </div>
              ))}
              </div>
              <div className="absolute text-white bottom-5 right-5 text-2xl"><button className="hover:cursor-pointer hover:bg-gray-600 rounded p-2" onClick={()=>{Navigate(`/Admin/ContentManagement/LessonEdit/${activeTab}/${lesson.id}/${level.id}`)}}><HiOutlinePencilSquare /></button></div>
            </div>
          {/*Lesson Card*/}
          </>
            ))}
            </div>
          </div>
        ))
        }
      </div>)}
      
      {showPopup &&(
        <div className={`fixed  inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50 transition-all duration-300 ${popupVisible ? 'opacity-100 ' : 'opacity-0 '}`}
        onClick={closePopup}>
            <div 
            onClick={(e)=> e.stopPropagation()}
            className={`w-[40%] h-[55%] transition-all  duration-300 ${popupVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              <AddContent subject={activeTab} closePopup={() => setShowPopup(false)}/>
            </div>
        </div>
      )}
</div>
)}

export default ContentManagement