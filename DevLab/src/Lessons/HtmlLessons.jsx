import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy,doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useNavigate} from "react-router-dom"; 
import HtmlImage from "../assets/Images/html-Icon-Big.png"
import { MdOutlineLock } from "react-icons/md";
import Lottie from "lottie-react";
import Animation from '../assets/Lottie/LoadingLessonsLottie.json'
function HtmlLessons() {

    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLevels, setShowLevels] = useState(false);
useEffect(() => {
    const fetchData = async () => {
      const htmlRef = collection(db, "Html");
      const htmlSnapshot = await getDocs(htmlRef);
      const lessonData = await Promise.all(
        htmlSnapshot.docs.map(async (lessonDoc) => {
          const subcollectionName = `${lessonDoc.id}Levels`;
          const levelsRef = collection(db, "Html", lessonDoc.id, subcollectionName);
          const levelsSnapshot = await getDocs(levelsRef);
          const levels = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          return {
            id: lessonDoc.id,
            ...lessonDoc.data(),
            levels
          };
        })
      );
      setLessons(lessonData);
      setTimeout(() => setShowLevels(true), 100);
      setLoading(false);
    };

    fetchData();
  }, []);
    
  return (
    <>
        <div className="h-[100%]">
          {/*Upper Panel*/}
          <div className=" h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#FF5733] to-[#FFC300]">
            <div className="w-[80%] flex flex-col gap-7">
              <div className="p-3 flex flex-col gap-4">
                  <h1 className="font-exo text-white text-[3.5rem] font-bold text-shadow-lg text-shadow-black"> HTML: The Gateway to Web Adventure</h1>
                  <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black">Step into the world of Front-End Development with HTML and CSS as your weapons of creation. Your adventure begins with mastering the fundamentals—building structure and style to craft stunning, responsive websites. As you level up, you'll unlock the secrets of layout design, styling, and structure, gaining the skills to transform raw code into beautiful web pages. Conquer each challenge to earn badges of mastery and become a true HTML and CSS hero!</p>
              </div>
              <div>
                <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
                  <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}>
                  </div>
                </div>
              </div>
            </div>
              <div className="w-[30%] flex justify-center p-4">
              <img src={HtmlImage} alt="" className="w-[60%] h-[90%]"/>
              </div>
          </div>
        {/*Lower Part hehe*/}
        <div className="h-[60%] flex p-3">
        {/*Left Panel*/}
        {loading?
        /*Loading*/
      (<Lottie animationData={Animation} loop={true} className="w-[60%] h-[70%] mt-[30px]" />):
      (<div className="w-[60%] p-3 h-[100%] overflow-scroll overflow-x-hidden
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex flex-col gap-4">
          <h2 className="font-exo text-[3rem] font-bold text-white">{lesson.title}</h2> 
          <div className="flex flex-col gap-4">
            {lesson.levels.map((level) => (
              <div key={level.id} 
              className= {`w-full border flex gap-5 rounded-4xl transition-all duration-2400 ease-out transform
                    ${showLevels ? 'translate-y-0' : ' translate-y-20'}
                    ${level.status === false
                    ? "bg-[#060505] opacity-30 cursor-not-allowed"
                    : "bg-[#111827] hover:scale-102 cursor-pointer"}`}
              onClick={() => {
              if (level.status) {
              navigate(`/Main/Lessons/Html/${lesson.id}/${level.id}`);}}}>
                <div className=" text-white bg-black w-[15%] flex justify-center  text-[4rem] font-bold rounded-4xl">{level.symbol}</div>
                  <div className="p-4 text-white font-exo"> 
                    <p className="text-[1.4rem]">{level.title}</p>
                    <p className="text-[0.8rem]">{level.desc}</p>
                  </div>
              </div> 
            ))}
            </div>
        </div>))}
      </div>)
      }
        {/*Right Panel*/}
          <div className="w-[40%] flex flex-col gap-4 p-5">
            <h2 className="text-[2.5rem] font-exo font-bold text-white text-shadow-sm text-shadow-black  tracking-wider">About <span className="text-[#FF5733]">HTML</span></h2>
            <p className="font-exo text-white">Step into the world of web development! As a novice adventurer, you’ll unlock the powerful language that forms the backbone of the internet—HTML. In this first quest, you’ll discover how to craft the structure of your web pages, using simple tags and elements. Your mission: build your very first web page and lay the foundation for your journey into the digital realm</p>
          </div>

        </div>

        </div>

    </>
  )
}

export default HtmlLessons