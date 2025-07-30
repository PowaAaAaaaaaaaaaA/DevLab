import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import { useNavigate} from "react-router-dom";
import CssImage from "../assets/Images/css-Icon-Big.png";
import { MdOutlineLock } from "react-icons/md";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/LoadingLessonsLottie.json";
import LockAnimation from '../assets/Lottie/LockItem.json'
import {motion} from "framer-motion"

import useLevelsData from "../components/Custom Hooks/useLevelsData";
import useUserProgress from "../components/Custom Hooks/useUserProgress";
import useSubjProgressBar from "../components/Custom Hooks/useSubjProgressBar";


function CssLessons() {
    // Level Fetch (Custom Hooks)
    const { data, isLoading } = useLevelsData("Css");
    // User Progress
    const {userProgress, completedCount} = useUserProgress("Css");
    // Subject Levels Progress Bar
    const {animatedBar} = useSubjProgressBar("Css")
    
    const navigate = useNavigate();
    const [showLockedModal, setShowLockedModal] = useState(false);


  return (
    <>
      <div className="h-[100%]">
        {/*Upper Panel*/}
        <div className="h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#00509E] to-[#00BFFF]">
          <div className="w-[80%] flex flex-col gap-7">
            <div className="p-3 flex flex-col gap-4">
              <h1 className="font-exo text-white text-[3rem] font-bold text-shadow-lg text-shadow-black">
                # CSS: The Art of Styling Your Digital World
              </h1>
              <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black">
                Step into the world of Front-End Development with HTML and CSS
                as your weapons of creation. Your adventure begins with
                mastering the fundamentals—building structure and style to craft
                stunning, responsive websites. As you level up, you'll unlock
                the secrets of layout design, styling, and structure, gaining
                the skills to transform raw code into beautiful web pages.
                Conquer each challenge to earn badges of mastery and become a
                true HTML and CSS hero!
              </p>
            </div>
            <div>
              <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
                <div
                  className="h-4 rounded-full dark:bg-[#2CB67D]"
                  style={{ width: `${animatedBar}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="w-[30%] flex justify-center p-4">
            <img src={CssImage} alt="" className="w-[60%] h-[90%]" />
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
            <div
              className="w-[60%] p-3 h-[100%] overflow-scroll overflow-x-hidden
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {data.map((lesson) => (
                <div key={lesson.id} className="flex flex-col gap-4">
                  <h2 className="font-exo text-[3rem] font-bold text-white">
                    {lesson.title}
                  </h2>
                  <motion.div
                  variants={{hidden:{opacity: 0}, 
                  show:{opacity:1, 
                  transition:{staggerChildren:0.3,duration: 1, ease: "easeOut",}},}}
                  initial = "hidden"
                  animate="show"
                  className="flex flex-col gap-4">
                    {lesson.levels.map((level) => {
            const isUnlocked = userProgress[`${lesson.id}-${level.id}`];
                      return(
                      <motion.div
                      variants={{hidden:{opacity:0, y:100}, show:{opacity: isUnlocked ? 1 : 0.3, y:0 }}}
                      key={level.id} 
                      whileHover={{scale:1.02}}
                      className= {`group w-full border flex gap-5 rounded-4xl h-[120px]
                    ${isUnlocked === false
                    ? "bg-[#060505]  cursor-pointer"
                    : "bg-[#111827]  cursor-pointer "}`}
                        onClick={async () => {
                          if (!isUnlocked) {
                            setShowLockedModal(true);// show the modal
                            return;}
                          if (isUnlocked) {
                            const user = auth.currentUser;
                            if (user) {
                              const userRef = doc(db, "Users", user.uid);
                              await updateDoc(userRef, {
                                lastOpenedLevel: {
                                  lessonId: "Css", // since nasa CSS lesson Page, Hardcoded nalang
                                  lessonDocId: lesson.id,
                                  levelId: level.id,
                                },
                              });
                            }const firstTopic = level.topics?.[0];
                             //  get the first topic if it exists
                            navigate(`/Main/Lessons/Css/${lesson.id}/${level.id}/${firstTopic.id}/Lesson`);
                          }
                        }}> 
                        <div className=" text-white bg-black min-w-[15%] text-[4rem] font-bold rounded-4xl flex justify-center items-center"><span className="pb-4">{level.symbol}</span></div>
                        <div className="p-4 text-white font-exo">
                          <p className="text-[1.4rem]">{level.title}</p>
                          <p className="text-[0.7rem] line-clamp-3 text-gray-500">{level.desc}</p>
                        </div>
                      </motion.div>
                      )
}
)}
                  </motion.div >
                </div>
              ))}
            </div>
          )}
          {/*Right Panel*/}
          <div className="w-[40%] flex flex-col gap-4 p-5">
            <h2 className="text-[2.5rem] font-exo font-bold text-white text-shadow-sm text-shadow-black  tracking-wider">
              About <span className="text-[#1E90FF]">CSS</span>
            </h2>
            <p className="font-exo text-white">
              Embark on a creative journey where you become a master of design!
              As an aspiring stylist, you’ll wield the magic of CSS to transform
              plain web pages into stunning digital artworks. Learn to craft
              colors, layouts, and typography that will bring your creations to
              life. Your quest: turn your simple web page into a visually
              captivating masterpiece that wows users across the globe!
            </p>
          </div>
        </div>
{/*This is PopUp for the Locked Levels*/}
      {showLockedModal && (  
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl w-[400px] text-center shadow-lg border border-gray-600 flex flex-col items-center">
            <Lottie animationData={LockAnimation} className="w-[50%] h-[50%]"></Lottie>
              <h2 className="text-2xl font-bold mb-4">Level Locked</h2>
              <p className="mb-6">You must complete the previous levels to unlock <span className="text-[#FF5733] font-bold"></span>.</p>
              <button
                className="bg-[#7F5AF0] px-6 py-2 rounded-2xl text-white font-bold hover:bg-[#6A4CD4] transition w-[90%] cursor-pointer"
                onClick={() => setShowLockedModal(false)}>Okay</button>
          </div>
        </div>)}
      </div>
    </>
  );
}
export default CssLessons;
