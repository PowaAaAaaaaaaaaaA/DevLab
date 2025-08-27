import { useEffect, useState } from "react";
import { collection, getDocs,setDoc, doc,deleteDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowDownTray } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";
import { GoTrash } from "react-icons/go";
import Animation from '../assets/Lottie/LoadingLessonsLottie.json'
import Lottie from "lottie-react";

import useLevelsData from "../components/Custom Hooks/useLevelsData";

import AddContent from "./AddContent";
import LessonEdit from "./LessonEdit";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SortableStage from "./SortableStage"

import {
  DndContext,
  closestCorners
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



function ContentManagement() {

const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("Html");
  const {levelsData, isLoading} = useLevelsData(activeTab);
  const subjects = ["Html","Css", "JavaScript","Database"];

  const [showForm , setShowForm] = useState(false);
  const [stageId, setStageId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [lessonId, setLessonId] = useState(null);
  // For PopUP(Adding Level/Lesson)Transition
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [levelStages, setLevelStages] = useState({});

useEffect(() => {
  if (levelsData && Array.isArray(levelsData)) {
    const formatted = {};
    levelsData.forEach(lesson => {
      if (lesson.levels && Array.isArray(lesson.levels)) {
        lesson.levels.forEach(level => {
          formatted[level.id] = Array.isArray(level.stages) ? level.stages : [];
        });
      }
    });
    setLevelStages(formatted);
  } else {
    setLevelStages({});
  }
}, [levelsData]);

const handleDragEnd = (event, levelId) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setLevelStages((prev) => {
    const updatedStages = [...prev[levelId]];
    const oldIndex = updatedStages.findIndex(stage => stage.id === active.id);
    const newIndex = updatedStages.findIndex(stage => stage.id === over.id);
    return {
      ...prev,
      [levelId]: arrayMove(updatedStages, oldIndex, newIndex)
    };
  });
};




const openPopup = () => {
  setShowPopup(true);
  setTimeout(() => setPopupVisible(true), 20); 
};
const closePopup = () => {
  setPopupVisible(false);
  setTimeout(() => setShowPopup(false), 100); 
};
// Adding new Stage on a Level
const addNewTopicMutation = useMutation({
  mutationFn: ({ subject, lessonId, levelId }) => addNewTopic(subject, lessonId, levelId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["lesson_data", activeTab] });
  }
});
  const addNewTopic = async (subject, lessonId, levelId) => {
  try {
    const topicsRef = collection(db, subject, `Lesson${lessonId}`, "Levels", levelId, "Stages");
    const snapshot = await getDocs(topicsRef);

    // Get highest numbered Topic
    const topicNumbers = snapshot.docs.map(doc => {
      const match = doc.id.match(/Stage(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });

    const nextNumber = (topicNumbers.length > 0 ? Math.max(...topicNumbers) : 0) + 1;
    const newTopicId = `Stage${nextNumber}`;

    await setDoc(doc(topicsRef, newTopicId), {
      title: newTopicId,
      order: Number(nextNumber),
      createdAt: new Date()
    });

  } catch (error) {
    console.error("Error adding topic:", error);
  }
};

const DeleteLevelMutaion = useMutation({
  mutationFn: ({ subject, lessonId, levelId }) => deleteLevel(subject, lessonId, levelId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["lesson_data", activeTab] });
  }
});
// Deleting a Level
const deleteLevel = async (subject, lessonId, levelId) => {
      const lessonIds = `Lesson${lessonId}`
  try {
    // Delete the level itself
    await deleteDoc(doc(db, subject, lessonIds, "Levels", levelId));

    // Check if the lesson has remaining levels
    const levelsRef = collection(db, subject, lessonIds, "Levels");
    const remainingLevels = await getDocs(levelsRef);

    if (remainingLevels.empty) {
      // No more levels, delete the lesson itself
      await deleteDoc(doc(db, subject, `Lesson${lessonId}`));
      console.log(`Lesson '${lessonId}' deleted because it had no more levels.`);
    }
  } catch (error) {
    console.error("Error deleting level:", error);
  }
};

console.log(showForm)
  return (
<div className='h-full overflow-hidden'>
    {/*Header*/}
      <div className='border-b border-white h-auto flex flex-col justify-between p-5'>
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
            onClick={()=> setActiveTab(subject)}>
            {subject}
            </button>
          ))}
        </div>
      </div> {/*header End*/}
      {isLoading ? (<Lottie animationData={Animation} loop={true} className="w-[60%] h-[70%] m-auto" />):
      /* Lessons and Levels */
      (<div className=" h-[60%] p-5 overflow-scroll overflow-x-hidden mt-2
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {levelsData.map((lesson)=>(
          <div key={lesson.id} className="p-5 flex flex-col gap-15">
            <h2 className="text-white font-exo text-5xl">Lesson {lesson.Lesson} </h2>
            <div className="flex flex-wrap justify-center gap-10">
            {lesson.levels.map((level)=>(  
          /*Lesson Card*/
            <div key={level.id} className={`relative border-[#56EBFF] border w-[42%] p-5 flex flex-col gap-4 min-h-[180px] rounded-2xl bg-[#111827] transition-all duration-400 `}>
              <h2 className="text-3xl font-exo font-bold text-white">{level.title}</h2>
              <p className="text-white font-exo text-[0.8rem]">{level.desc}</p>
              <div className="flex gap-5">
                <div className="border mt-3 flex flex-wrap p-2 rounded-lg border-gray-500 gap-3 w-[100%]">
                  <DndContext collisionDetection={closestCorners} onDragEnd={(event) => handleDragEnd(event, level.id)}>
                    <SortableContext
                    items={levelStages[level.id]?.map(stage => stage.id) || []}
                    strategy={horizontalListSortingStrategy}>
                      {levelStages[level.id]?.map(stage => (
                        <SortableStage 
                          key={stage.id} 
                          stage={stage}  
                          onClick={() => {
                            setShowForm(true);
                            setStageId(stage.id);
                            setLevelId(level.id);
                            setLessonId(lesson.Lesson);}}/>))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
              <div className="flex justify-end gap-3 absolute top-3 right-5">
              <div className="text-white  text-2xl">
                <button className="hover:cursor-pointer hover:bg-gray-600 rounded p-2 border-gray-500 border" onClick={() => addNewTopicMutation.mutate({subject: activeTab,
                  lessonId: lesson.Lesson,
                  levelId: level.id})}><GoPlus /></button></div>
              <div className="text-white  text-2xl">
                <button className="hover:cursor-pointer hover:bg-gray-600 rounded p-2 border-gray-500 border" onClick={() =>  DeleteLevelMutaion.mutate({subject: activeTab,
                  lessonId: lesson.Lesson,
                  levelId: level.id})}><GoTrash /></button></div>
              </div>
            </div>
          /*Lesson Card*/
            ))}
            </div>
          </div>
        ))
        }
      </div>)}
      
      {showPopup &&(
        <div className={`fixed inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50 transition-all duration-300 ${popupVisible ? 'opacity-100 ' : 'opacity-0 '}`}
        onClick={closePopup}>
            <div 
            onClick={(e)=> e.stopPropagation()}
            className={`w-[40%] h-[60%] transition-all  duration-300 ${popupVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              <AddContent subject={activeTab} closePopup={() => setShowPopup(false)}/>
                {console.log(activeTab)}
            </div>
        </div>
      )}
      <AnimatePresence> 
      {showForm &&
      (<div 
      onClick={() => setShowForm(false)}
      className="fixed inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center ">
<motion.div
  onClick={(e) => e.stopPropagation()}
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0 }}
  className="w-[40%] h-[90%] transition-all overflow-x-hidden rounded-2xl scrollbar-custom">
  <LessonEdit 
    subject={activeTab} 
    lessonId={`Lesson${lessonId}`} 
    levelId={levelId} 
    stageId={stageId} />
</motion.div>
      </div>
      )}
      </AnimatePresence>
</div>
  )
}

export default ContentManagement