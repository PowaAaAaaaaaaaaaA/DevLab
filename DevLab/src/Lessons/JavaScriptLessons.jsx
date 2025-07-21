import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import JsImage from "../assets/Images/js-Icon-Big.png";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/LoadingLessonsLottie.json";
import LockAnimation from "../assets/Lottie/LockItem.json";
import { motion } from "framer-motion";

import { useQuery } from "@tanstack/react-query";

function JavaScriptLessons() {
  const { data, isLoading } = useQuery({
    queryKey: ["Js_Levels"],
    queryFn: () => fetchData(),
  });

  const navigate = useNavigate();
  const [showLockedModal, setShowLockedModal] = useState(false);

  const fetchData = async () => {
    const JavaScriptRef = collection(db, "JavaScript");
    const JavaScriptSnapshot = await getDocs(JavaScriptRef);

    const lessonData = await Promise.all(
      JavaScriptSnapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, "JavaScript", lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);

        const levels = await Promise.all(
          levelsSnapshot.docs.map(async (levelDoc) => {
            const topicsRef = collection(db,"JavaScript",lessonDoc.id,"Levels",levelDoc.id,"Topics");
            const topicsSnapshot = await getDocs(topicsRef);
            const topics = topicsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            return {
              id: levelDoc.id,
              ...levelDoc.data(),
              topics,
            };
          })
        );
        return {
          id: lessonDoc.id,
          ...lessonDoc.data(),
          levels,
        };
      })
    );
    return lessonData;
  };

  return (
    <>
      <div className="h-[100%]">
        {/*Upper Panel*/}
        <div className=" h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#DECD41] to-[#FF8C00]">
          <div className="w-[80%] flex flex-col gap-7">
            <div className="p-3 flex flex-col gap-4">
              <h1 className="font-exo text-white text-[2.3rem] font-bold text-shadow-lg text-shadow-black">
                {} JavaScript: The Magic Behind Interactive Web Realms
              </h1>
              <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black">
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
              <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
                <div
                  className="h-4 rounded-full dark:bg-[#2CB67D]"
                  style={{ width: "56%" }}
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
          {isLoading ? (
            <Lottie
              animationData={Animation}
              loop={true}
              className="w-[60%] h-[70%] mt-[30px]"
            />
          ) : (
            <div className="w-[60%]">
              <div
                className="w-[100%] p-3 h-[90%] overflow-scroll overflow-x-hidden
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
              >
                {data.map((lesson) => (
                  <div key={lesson.id} className="flex flex-col gap-4">
                    <h2 className="font-exo text-[3rem] font-bold text-white">
                      {lesson?.title}
                    </h2>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: {opacity: 1,transition: {staggerChildren: 0.3,duration: 1,ease: "easeOut",},
                        },
                      }}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-4">
                      {lesson.levels.map((level) => (
                        <motion.div
                          key={level.id}
                          variants={{
                            hidden: { opacity: 0, y: 100 },
                            show: { opacity: level.status ? 1 : 0.3, y: 0 },
                          }}
                            whileHover={{scale:1.02}}
                            className= {`group w-full border flex gap-5 rounded-4xl h-[120px]
                    ${level.status === false
                    ? "bg-[#060505]  cursor-pointer"
                    : "bg-[#111827]  cursor-pointer "}`}
                          onClick={async () => {
                            if (!level.status) {
                              setShowLockedModal(true); // show the modal
                              return;}
                            if (level.status) {
                              const user = auth.currentUser;
                              if (user) {
                                const userRef = doc(db, "Users", user.uid);
                                await updateDoc(userRef, {
                                  lastOpenedLevel: {
                                    lessonId: "JavaScript", // since nasa JavaScript lesson Page, Hardcoded nalang
                                    lessonDocId: lesson.id,
                                    levelId: level.id,
                                  },
                                });
                              }
                              const firstTopic = level.topics?.[0];
                              navigate(
                                `/Main/Lessons/Html/${lesson.id}/${level.id}/${firstTopic.id}/Lesson`
                              );
                            }
                          }}>
                          <div className=" text-white bg-black w-[15%] flex justify-center items-center  text-[4rem] font-bold rounded-4xl">
                            {level?.symbol}
                          </div>
                          <div className="p-4 text-white font-exo">
                            <p className="text-[1.4rem]">
                              {level?.title}
                            </p>
                            <p className="text-[0.7rem] line-clamp-3 text-gray-500">
                              {level?.desc }
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </div>
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
