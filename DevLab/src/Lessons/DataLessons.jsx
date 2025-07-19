import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import DataImage from "../assets/Images/Database-Icon-Big.png";
import { MdOutlineLock } from "react-icons/md";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/LoadingLessonsLottie.json";

import { motion } from "framer-motion";

import { useQuery } from "@tanstack/react-query";

function DataLessons() {
  const navigate = useNavigate();
  const [showLockedModal, setShowLockedModal] = useState(false);

  const fetchData = async () => {
    const DatabaseRef = collection(db, "Database");
    const DatabaseSnapshot = await getDocs(DatabaseRef);

    const lessonData = await Promise.all(
      DatabaseSnapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, "Database", lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);

        const levels = await Promise.all(
          levelsSnapshot.docs.map(async (levelDoc) => {
            const topicsRef = collection(
              db,
              "Database",
              lessonDoc.id,
              "Levels",
              levelDoc.id,
              "Topics"
            );
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

  const { data, isLoading } = useQuery({
    queryKey: ["Data_Levels"],
    queryFn: () => fetchData(),
  });
  return (
    <>
      <div className="h-[100%]">
        {/*Upper Panel*/}
        <div className=" h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#4CAF50] to-[#124B15]">
          <div className="w-[80%] flex flex-col gap-7">
            <div className="p-3 flex flex-col gap-4">
              <h1 className="font-exo text-white text-[3rem] font-bold text-shadow-lg text-shadow-black">
                |||| Database: The Vault of Digital Knowledge
              </h1>
              <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black">
                Enter the fortress of data, where every piece of information is
                carefully guarded and stored! As a Database Guardian, you'll
                learn to unlock the vault of digital knowledge, mastering the
                art of organizing and retrieving data with precision. Harness
                the power of SQL to query vast treasures of information,
                ensuring your vault remains secure, efficient, and ever-growing.
                Your quest: become the ultimate protector of data, retrieving
                valuable insights from the depths of the digital realm!
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
            <img src={DataImage} alt="" className="w-[60%] h-[90%]" />
          </div>
        </div>
        {/*Lower Part hehe*/}
        <div className="h-[60%] flex p-3">
          {/*Left Panel*/}
          {isLoading ? (
            /*Loading*/
            <Lottie
              animationData={Animation}
              loop={true}
              className="w-[60%] h-[70%] mt-[30px]"
            />
          ) : (
            <div
              className="w-[60%] p-3 h-[100%] overflow-scroll overflow-x-hidden
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
                    {lesson.title}
                  </h2>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.3,
                          duration: 1,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-4"
                  >
                    {lesson.levels.map((level) => (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 100 },
                          show: { opacity: level.status ? 1 : 0.3, y: 0 },
                        }}
                        key={level.id}
                        className={`w-full border flex gap-5 rounded-4xl h-[120px]
              ${
                level.status === false
                  ? "bg-[#060505] opacity-30 cursor-pointer"
                  : "bg-[#111827] hover:scale-102 cursor-pointer"
              }`}
                        onClick={async () => {
                          if (level.status) {
                            const user = auth.currentUser;
                            if (user) {
                              const userRef = doc(db, "Users", user.uid);
                              await updateDoc(userRef, {
                                lastOpenedLevel: {
                                  lessonId: "Database", // since nasa Database lesson Page, Hardcoded nalang
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
                        }}
                      >
                        <div className=" text-white bg-black w-[15%] flex justify-center  text-[4rem] font-bold rounded-4xl">
                          {level.symbol}
                        </div>
                        <div className="p-4 text-white font-exo">
                          <p className="text-[1.4rem]">{level.title}</p>
                          <p className="text-[0.8rem]">{level.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
          {/*Right Panel*/}
          <div className="w-[40%] flex flex-col gap-4 p-5">
            <h2 className="text-[2.5rem] font-exo font-bold text-white text-shadow-sm text-shadow-black  tracking-wider">
              About <span className="text-[#4CAF50]">Database</span>
            </h2>
            <p className="font-exo text-white">
              Venture into the depths of data storage and mastery! As a Database
              Guardian, you’ll learn to organize and retrieve vast amounts of
              information with precision and speed. Harness the power of SQL to
              access and manipulate data, keeping your digital vault secure and
              efficient. Your quest: unlock the secrets of database querying and
              become the protector of vast digital knowledge!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataLessons;
