import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import JsImage from "../assets/Images/js-Icon-Big.png";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/LoadingLessonsLottie.json";
import LockAnimation from "../assets/Lottie/LockItem.json";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock } from "react-icons/fa";

import useLevelsData from "../components/Custom Hooks/useLevelsData";
import useUserProgress from "../components/Custom Hooks/useUserProgress";
import useSubjProgressBar from "../components/Custom Hooks/useSubjProgressBar";

import '../index.css'

function JavaScriptLessons() {
  // Level Fetch (Custom Hooks)
  const { levelsData, isLoading } = useLevelsData("JavaScript");
  // Unlocked and Locked Levels
  const {userProgress,isLoading: progressLoading,userStageProgress} = useUserProgress("JavaScript");
  // Subject Levels Progress Bar
  const { animatedBar,total} = useSubjProgressBar("JavaScript");
  const navigate = useNavigate();
  const [showLockedModal, setShowLockedModal] = useState(false);

  const [expandedLevel, setExpandedLevel] = useState(null);
console.log(total);
  return (
    <>
      <div className="h-[100%]">
        {/*Upper Panel*/}
        <div className="h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#DECD41] to-[#FF8C00]">
          <div className="w-[80%] flex flex-col gap-7">
            <div className="p-3 flex flex-col gap-4">
              <h1 className="font-exo text-white text-[2.3rem] font-bold text-shadow-lg text-shadow-black bigText-laptop">
                {"{ }"} JavaScript: The Magic Behind Interactive Web Realms
              </h1>
              <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black textSmall-laptop">
                Step into the enchanted realm of code, where you’ll wield the
                powerful magic of JavaScript! As a budding sorcerer, you’ll
                learn to cast spells that bring your web pages to life—turning
                static sites into interactive, dynamic worlds. From summoning
                buttons that respond to clicks to conjuring animations and
                real-time interactions, your journey will unlock the secrets of
                crafting engaging, magical web experiences. Ready to harness the
                power of the web? The realm of interactivity awaits!
              </p>
            </div>
            <div>
              <div className="w-[70%] min-h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
                <div
                  className="h-4 rounded-full dark:bg-[#2CB67D]"
                  style={{ width: `${animatedBar}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="w-[30%] flex justify-center p-4">
            <img src={JsImage} alt="" className="w-[60%] h-[90%]" />
          </div>
        </div>
        {/*Lower Part hehe*/}
        <div className="h-[60%] flex p-3">
          {/*Left Panel*/}
          {isLoading || progressLoading ? (
            /*Loading*/
            <Lottie
              animationData={Animation}
              loop={true}
              className="w-[60%] h-[70%] mt-[30px]"/>
          ) : (
            <div
              className="w-[60%] p-3 h-[100%] overflow-scroll overflow-x-hidden scrollbar-custom">
              {levelsData.map((lesson) => (
                <div key={lesson.id} className="flex flex-col gap-4">
                  <h2 className="font-exo text-[3rem] font-bold text-white">
                    Lesson {lesson.Lesson}
                  </h2>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.3,
                          duration: 0.1,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-4">
                    {lesson.levels.map((level) => {
                      // Level Locked or Unlocked
                      const isUnlocked = userProgress[`${lesson.id}-${level.id}`];
                      // unique identifier
                      const isExpanded = expandedLevel === `${lesson.id}-${level.id}`;
                      const toggleLevel = (lessonId, levelId) => {
                      const key = `${lessonId}-${levelId}`; 
                      setExpandedLevel(prev => (prev === key ? null : key));};
                      return (
                        <motion.div
                          key={`${lesson.id}-${level.id}`}
                          className="flex flex-col gap-2">
                          {/* Level Card */}
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 100 },
                              show: { opacity: isUnlocked ?  1 : 0.4, y: 0 },
                            }}
                            whileHover={{ scale: 1.02 }}
                            className={`group w-full border flex gap-5 rounded-4xl h-[120px] relative
                            ${
                              isUnlocked ? "bg-[#111827]" : "bg-[#060505]"
                            } cursor-pointer`}
                            onClick={async() => {
                              if (!isUnlocked) {
                                setShowLockedModal(true);
                                return;} if (isUnlocked) {
                                const user = auth.currentUser;
                                if (user) {
                                  const userRef = doc(db, "Users", user.uid);
                                  await updateDoc(userRef, {
                                    lastOpenedLevel: {
                                      subject: "JavaScript", // since nasa Js lesson Panalang
                                      lessonId: lesson.id,
                                      levelId: level.id,
                                    },
                                  });
                                }}
                              toggleLevel(lesson.id, level.id);
                            }}>
                              {!isUnlocked && (
                                <div className="absolute top-10 right-0 left-105 text-white">
                                  <FaLock className="text-[3rem] text-white" />
                                </div>
                              )}
                            <div className="text-white bg-black min-w-[20%] text-[3rem] font-bold rounded-4xl flex justify-center items-center">
                              <span className="pb-4">{level.symbol}</span>
                            </div>
                            <div className="p-4 text-white font-exo">
                              <p className="text-[1.4rem]">{level.title}</p>
                              <p className="text-[0.7rem] line-clamp-3 text-gray-500">
                                {level.description}
                              </p>
                            </div>
                          </motion.div>
                          {/* Dropdown Stages */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.2,
                                  staggerChildren: 0.1,
                                }}
                                className=" p-5 bg-gray-900 rounded-2xl">
                                <motion.div
                                  className="flex flex-col gap-2"
                                  initial="hidden"
                                  animate="visible"
                                  variants={{
                                    hidden: {},
                                    visible: {
                                      transition: {
                                        staggerChildren: 0.1, // delay between each stage
                                      },
                                    },
                                  }}>
                                  {level.stages
                                    ?.filter((stage) => stage.type === "Lesson")
                                    .sort((a, b) => a.order - b.order)
                                    .map((stage) => {
                                      // Check if stage is unlocked
                                      const isStageUnlocked =
                                        userStageProgress[`${lesson.id}-${level.id}-${stage.id}`];
                                      return (
                                        <motion.div
                                          variants={{
                                            hidden: { opacity: 0, scale: 0.2 },
                                            visible: { opacity: 1, scale: 1 },
                                          }}
                                          transition={{
                                            duration: 0.1,
                                            ease: "easeOut",
                                          }}
                                          key={stage.id}
                                          className={`p-3 rounded-xl min-h-[100px] text-white transition cursor-pointer relative
                                          ${
                                            isStageUnlocked
                                              ? "bg-[#1E1E2E] hover:bg-[#DECD41]/90"
                                              : "bg-gray-800 pacity-50"
                                          }`}
                                          onClick={() => {
                                            if (isStageUnlocked) {
                                              navigate(
                                                `/Main/Lessons/JavaScript/${lesson.id}/${level.id}/${stage.id}/${stage.type}`
                                              );
                                            }
                                          }}>
                                          <p className="font-exo">
                                            {stage.title}
                                          </p>
                                          <p className="text-gray-600 text-sm line-clamp-3">
                                            {stage.description}
                                          </p>
                                          {!isStageUnlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                              <FaLock className="text-[3rem] text-white" />
                                            </div>
                                          )}
                                        </motion.div>
                                      );
                                    })}
                                  {level.stages?.filter(
                                    (stage) => stage.type === "Lesson"
                                  ).length === 0 && (
                                    <p className="text-gray-400 italic">
                                      No Lesson stages found.
                                    </p>
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
          {/*Right Panel*/}
          <div className="w-[40%] flex flex-col gap-4 p-5">
            <h2 className="text-[2.5rem] font-exo font-bold text-white text-shadow-sm text-shadow-black  tracking-wider">
              About <span className="text-[#F7DF1E]">JavaScript</span>
            </h2>
            <p className="font-exo text-white">
              Enter the world of dynamic, interactive web experiences! As a
              JavaScript mage, you'll learn to cast powerful spells that bring
              your web pages to life. From creating interactive buttons to
              controlling animations and data, you’ll master the art of making
              websites responsive to users' every action. Your mission: unlock
              the magic that makes the web not just a place to visit, but a
              realm to interact with!
            </p>
          </div>
        </div>
        {/*This is PopUp for the Locked Levels*/}
        {showLockedModal && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl w-[400px] text-center shadow-lg border border-gray-600 flex flex-col items-center">
              <Lottie
                animationData={LockAnimation}
                className="w-[50%] h-[50%]"
              ></Lottie>
              <h2 className="text-2xl font-bold mb-4">Level Locked</h2>
              <p className="mb-6">
                You must complete the previous levels to unlock{" "}
                <span className="text-[#FF5733] font-bold"></span>.
              </p>
              <button
                className="bg-[#7F5AF0] px-6 py-2 rounded-2xl text-white font-bold hover:bg-[#6A4CD4] transition w-[90%] cursor-pointer"
                onClick={() => setShowLockedModal(false)}
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default JavaScriptLessons;
