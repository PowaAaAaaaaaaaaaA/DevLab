
import { useEffect, useState } from "react";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowDownTray } from "react-icons/hi2";
import { GoPlus, GoTrash } from "react-icons/go";
import Animation from "../assets/Lottie/LoadingLessonsLottie.json";
import Lottie from "lottie-react";
import { useIsMutating } from "@tanstack/react-query";
import Loading from '../assets/Lottie/LoadingDots.json'

import useFetchLevelsData from "../components/BackEnd_Data/useFetchLevelsData";
import AddContent from "./contentManagement Components/AddContent";
import LessonEdit from "./contentManagement Components/LessonEdit";

import SortableStage from "./contentManagement Components/SortableStage";

import { DndContext, closestCorners } from "@dnd-kit/core";
import {horizontalListSortingStrategy,SortableContext,arrayMove,} from "@dnd-kit/sortable";

import { useDeleteLevel } from "./contentManagement Components/BackEndFuntions/useDeleteLevel";
import {useAddStage} from "./contentManagement Components/BackEndFuntions/useAddStage"

function ContentManagement() {
 const isMutating = useIsMutating();

  const [activeTab, setActiveTab] = useState("Html");
  const { levelsData, isLoading, } = useFetchLevelsData(activeTab);
  const subjects = ["Html", "Css", "JavaScript", "Database"];

  const [showForm, setShowForm] = useState(false);
  const [stageId, setStageId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [lessonId, setLessonId] = useState(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [levelStages, setLevelStages] = useState({});

    const deleteLevelMutation = useDeleteLevel(activeTab);
    const  addStageMutation  = useAddStage(activeTab);

  // Load initial stages
  useEffect(() => {
    if (levelsData && Array.isArray(levelsData)) {
      const formatted = {};
      levelsData.forEach((lesson) => {
        if (lesson.levels && Array.isArray(lesson.levels)) {
          lesson.levels.forEach((level) => {
            // Create a unique key by combining lessonId and levelId
            const uniqueKey = `${lesson.Lesson}_${level.id}`;
            formatted[uniqueKey] = Array.isArray(level.stages)
              ? level.stages.sort((a, b) => a.order - b.order)
              : [];
          });
        }
      });
      setLevelStages(formatted);
    } else {
      setLevelStages({});
    }
  }, [levelsData]);

  // Persist updated stage order to Firestore
  const updateStageOrder = async (subject, lessonId, levelId, stages) => {
    try {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const stageRef = doc(db,subject,`Lesson${lessonId}`,"Levels",levelId,"Stages",stage.id);
        await updateDoc(stageRef, { order: i + 1 });
      }
    } catch (error) {
      console.error("Error updating stage order:", error);
    }
  };

  // Handle drag end
const handleDragEnd = async (event, lessonId, levelId) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const uniqueKey = `${lessonId}_${levelId}`;

  setLevelStages((prev) => {
    const updatedStages = [...(prev[uniqueKey] || [])]; // fallback to []
    const activeIndex = updatedStages.findIndex(
      (stage) => stage.id === active.id
    );
    const overIndex = updatedStages.findIndex(
      (stage) => stage.id === over.id
    );

    if (activeIndex === -1 || overIndex === -1) return prev;

    const reorderedStages = arrayMove(
      updatedStages,
      activeIndex,
      overIndex
    ).map((stage, index) => ({ ...stage, order: index + 1 }));

    // Save to Firestore
    updateStageOrder(activeTab, lessonId, levelId, reorderedStages);

    return {
      ...prev,
      [uniqueKey]: reorderedStages,
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




  return (
    <div className="h-full overflow-hidden px-4 sm:px-6 lg:px-10">
{/* Global loader overlay */}
      {isMutating > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <Lottie
            animationData={Loading}
            loop={true}
            className="w-[50%] h-[50%]"
          />
        </div>
      )}
      {/* Header */}
      <div className="border-b border-white h-auto flex flex-col justify-between p-5">
        <div className="flex text-white font-exo justify-between p-10">
          <h1 className="text-[3.2rem] font-bold bigText-laptop">Content Management</h1>
          <button
            onClick={openPopup}
            className="rounded-2xl w-[20%] h-[60%] flex gap-5 items-center p-3 justify-center bg-[#4CAF50] font-bold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(95,220,112,0.8)]">
            <span className=" text-2xl">
              <HiArrowDownTray />
            </span>
            New Activity
          </button>
        </div>
        <div className="flex flex-wrap justify-around gap-3">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`font-exo rounded-2xl px-3 py-2 text-sm md:text-lg w-[45%] md:w-[20%] font-bold text-white transition duration-500 hover:cursor-pointer ${
                activeTab === subject
                  ? "text-shadow-lg text-shadow-[#6b6bc5]"
                  : "hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Lottie
          animationData={Animation}
          loop={true}
          className="w-[60%] h-[70%] m-auto"
        />
      ) : (
        <div className=" h-[60%] p-5 overflow-scroll overflow-x-hidden mt-2 scrollbar-custom">
          {levelsData.map((lesson) => (
            <div key={lesson.id} className="p-5 flex flex-col gap-15">
              <h2 className="text-white font-exo text-5xl bigText-laptop">
                Lesson {lesson.Lesson} 
              </h2>
              <div className="flex flex-wrap justify-center gap-5">
                {lesson.levels.map((level) => (
                  <div
                    key={level.id}
                    className="relative border-[#56EBFF] border w-full sm:w-[48%] lg:w-[42%] p-4 flex flex-col gap-4 min-h-[180px] rounded-2xl bg-[#111827] transition-all duration-400">
                    <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-3xl font-exo font-bold w-[73%] text-white mediuText-laptop">
                      {level.title}
                    </h2>
                    <div className="flex justify-end gap-3 ">
                      <div className="text-white text-2xl">
                        <button
                          className="hover:cursor-pointer hover:bg-green-500 rounded p-2 border-gray-500 border "
                          onClick={() =>
                            addStageMutation.mutate({
                              category: activeTab,   
                              lessonId: `Lesson${lesson.Lesson}`,     
                              levelId: level.id,           
                            })
                          }>
                          <GoPlus />
                        </button>
                      </div>
                      <div className="text-white text-2xl">
                        <button
                          className="hover:cursor-pointer hover:bg-red-600 rounded p-2 border-gray-500 border "
                          onClick={() =>
                            deleteLevelMutation.mutate({
                              category: activeTab,
                              lessonId: `Lesson${lesson.Lesson}`,
                              levelId: level.id,
                            })
                          }
                        >
                          <GoTrash />
                        </button>
                      </div>
                    </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="border flex flex-wrap p-2 rounded-lg border-gray-500 gap-3 w-full justify-center">
                        <DndContext
                          collisionDetection={closestCorners}
                          onDragEnd={(event) =>
                            handleDragEnd(event, lesson.Lesson, level.id)
                          }>
                          <SortableContext
                            items={
                              levelStages[`${lesson.Lesson}_${level.id}`]?.map(
                                (stage) => stage.id
                              ) || []
                            }
                            strategy={horizontalListSortingStrategy}>
                            {levelStages[`${lesson.Lesson}_${level.id}`]?.map(
                              (stage) => (
                                <SortableStage
                                  key={stage.id}
                                  stage={stage}
                                  onClick={() => {
                                    setShowForm(true);
                                    setStageId(stage.id);
                                    setLevelId(level.id);
                                    setLessonId(lesson.Lesson);
                                  }}
                                />
                              )
                            )}
                          </SortableContext>
                        </DndContext>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {showPopup && (
        <div
          className={`fixed inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50 transition-all duration-300 ${
            popupVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closePopup}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[40%] h-[60%] transition-all duration-300 ${
              popupVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}>
            <AddContent
              subject={activeTab}
              closePopup={() => setShowPopup(false)}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div
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
                stageId={stageId}
                setShowForm={setShowForm}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContentManagement;
