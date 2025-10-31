import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
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

import { useDeleteLevel } from "./contentManagement Components/BackEndFuntions/useDeleteLevel";
import { useAddStage } from "./contentManagement Components/BackEndFuntions/useAddStage";

function ContentManagement() {
  const isMutating = useIsMutating();
  const [activeTab, setActiveTab] = useState("Html");
  const { levelsData, isLoading } = useFetchLevelsData(activeTab);
  const subjects = ["Html", "Css", "JavaScript", "Database"];

  const [showForm, setShowForm] = useState(false);
  const [stageId, setStageId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [lessonId, setLessonId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [levelStages, setLevelStages] = useState({});

  const deleteLevelMutation = useDeleteLevel(activeTab);
  const addStageMutation = useAddStage(activeTab);

  useEffect(() => {
    if (levelsData && Array.isArray(levelsData)) {
      const formatted = {};
      levelsData.forEach((lesson) => {
        if (lesson.levels && Array.isArray(lesson.levels)) {
          lesson.levels.forEach((level) => {
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
      {isMutating > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <Lottie animationData={Loading} loop={true} className="w-[60%] h-[60%] sm:w-[40%] sm:h-[40%]" />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white h-auto flex flex-col justify-between p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row text-white font-exo justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-[2.5rem] sm:text-[3.2rem] font-bold text-center sm:text-left bigText-laptop">
            Content Management
          </h1>
          <button
            onClick={openPopup}
            className="cursor-pointer rounded-2xl w-full sm:w-[45%] lg:w-[20%] flex gap-3 sm:gap-5 items-center p-3 justify-center bg-[#4CAF50] font-bold text-white hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(95,220,112,0.8)]"
          >
            <HiArrowDownTray className="text-2xl" />
            New Activity
          </button>
        </div>

        {/* Subject Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-around gap-3 mt-5">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`font-exo rounded-2xl px-3 py-2 text-base sm:text-lg w-[45%] sm:w-[22%] font-bold text-white transition duration-500 hover:cursor-pointer ${
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

      {/* Main Content */}
      {isLoading ? (
        <Lottie
          animationData={Animation}
          loop={true}
          className="w-[80%] sm:w-[60%] h-[50vh] m-auto"
        />
      ) : (
        <div className="h-[65vh] sm:h-[70%] p-4 sm:p-6 overflow-y-auto mt-4 scrollbar-custom">
          {levelsData.map((lesson) => (
            <div key={lesson.id} className="p-3 sm:p-5 flex flex-col gap-8">
              <h2 className="text-white font-exo text-3xl sm:text-5xl text-center sm:text-left bigText-laptop">
                Lesson {lesson.Lesson}
              </h2>

              <div className="flex flex-wrap justify-center gap-5">
                {lesson.levels.map((level) => (
                  <div
                    key={level.id}
                    className="relative border-[#56EBFF] border w-full sm:w-[80%] lg:w-[100%] p-4 flex flex-col gap-4 min-h-[180px] rounded-2xl bg-[#111827] transition-all duration-400"
                  >
                    {/* Level Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-exo font-bold w-full sm:w-[70%] text-white text-center sm:text-left mediuText-laptop">
                        {level.title}
                      </h2>
                      <div className="flex justify-center sm:justify-end gap-3">
                        <button
                          className="text-white text-2xl hover:cursor-pointer hover:bg-green-500 rounded p-2 border-gray-500 border transition"
                          onClick={() =>
                            addStageMutation.mutate({
                              category: activeTab,
                              lessonId: `Lesson${lesson.Lesson}`,
                              levelId: level.id,
                            })
                          }
                        >
                          <GoPlus />
                        </button>
                        <button
                          className="text-white text-2xl hover:cursor-pointer hover:bg-red-600 rounded p-2 border-gray-500 border transition"
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

                    {/* Stage List */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="border flex flex-wrap p-2 rounded-lg border-gray-500 gap-3 w-full justify-center">
                        {(() => {
                          const uniqueKey = `${lesson.Lesson}_${level.id}`;
                          const stages = levelStages[uniqueKey] || [];
                          return stages.length === 0 ? (
                            <p className="text-white font-exo text-lg">No stages yet</p>
                          ) : (
                            stages.map((stage) => (
                              <div
                                key={stage.id}
                                onClick={() => {
                                  setStageId(stage.id);
                                  setLessonId(lesson.Lesson);
                                  setLevelId(level.id);
                                  setShowForm(true);
                                }}
                                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white font-exo cursor-pointer hover:bg-gray-700 transition"
                              >
                                {stage.id}
                              </div>
                            ))
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popups */}
      {showPopup && (
        <div
          className={`fixed inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50 transition-all duration-300 ${
            popupVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closePopup}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[90%] sm:w-[60%] lg:w-[40%] h-[60%] transition-all duration-300 ${
              popupVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <AddContent subject={activeTab} closePopup={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="w-[95%] sm:w-[70%] lg:w-[40%] h-[90%] transition-all overflow-x-hidden rounded-2xl scrollbar-custom"
            >
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
