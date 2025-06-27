import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import { useNavigate,Outlet } from "react-router-dom"; 
import CssImage from "../assets/Images/css-Icon-Big.png"
import { MdOutlineLock } from "react-icons/md";
import Lottie from "lottie-react";
import Animation from '../assets/Lottie/LoadingLessonsLottie.json'

function CssLessons() {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLevels, setShowLevels] = useState(false);
useEffect(() => {
    const fetchData = async () => {
    const cssRef = collection(db, "Css");
    const cssSnapshot = await getDocs(cssRef);
    const lessonData = await Promise.all(
        cssSnapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, "Css", lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);
        const levels = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
        id: lessonDoc.id,
        ...lessonDoc.data(),
        levels
    };
}));
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
        <div className="h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#00509E] to-[#00BFFF]">
            <div className="w-[80%] flex flex-col gap-7">
                <div className="p-3 flex flex-col gap-4">
                    <h1 className="font-exo text-white text-[3rem] font-bold text-shadow-lg text-shadow-black">   # CSS: The Art of Styling Your Digital World</h1>
                    <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black">Step into the world of Front-End Development with HTML and CSS as your weapons of creation. Your adventure begins with mastering the fundamentals—building structure and style to craft stunning, responsive websites. As you level up, you'll unlock the secrets of layout design, styling, and structure, gaining the skills to transform raw code into beautiful web pages. Conquer each challenge to earn badges of mastery and become a true HTML and CSS hero!</p>
                </div>
                <div>
                    <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
                        <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
                    </div>
                </div>
            </div>
                <div className="w-[30%] flex justify-center p-4">
                    <img src={CssImage} alt="" className="w-[60%] h-[90%]"/>
                </div>
        </div>
        {/*Lower Part hehe*/}
            <div className="h-[60%] flex p-3">
        {/*Left Panel*/}
            {loading? (<Lottie animationData={Animation} loop={true} className="w-[60%] h-[70%] mt-[30px]" />):
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
                onClick={async() => {
                if (level.status) {
                    const user = auth.currentUser;
                    if (user){
                        const userRef = doc(db, "Users", user.uid);
                            await updateDoc(userRef,{
                                lastOpenedLevel: {
                                    lessonId: "Css",    // since nasa CSS lesson Page, Hardcoded nalang   
                                    lessonDocId: lesson.id,    
                                    levelId: level.id          
                                }
                            })
                        }
                navigate(`/Main/Lessons/Css/${lesson.id}/${level.id}`);
                }
            }}>
                    <div className=" text-white bg-black w-[15%] flex justify-center  text-[4rem] font-bold rounded-4xl">{level.symbol}</div>
                    <div className="p-4 text-white font-exo"> 
                        <p className="text-[1.4rem]">{level.title}</p>
                        <p className="text-[0.8rem]">{level.desc}</p>
                    </div>
                </div> ))}
            </div>
        </div>))}
    </div>)}
            {/*Right Panel*/}
            <div className="w-[40%] flex flex-col gap-4 p-5">
                <h2 className="text-[2.5rem] font-exo font-bold text-white text-shadow-sm text-shadow-black  tracking-wider">About <span className="text-[#1E90FF]">CSS</span></h2>
                <p className="font-exo text-white">Embark on a creative journey where you become a master of design! As an aspiring stylist, you’ll wield the magic of CSS to transform plain web pages into stunning digital artworks. Learn to craft colors, layouts, and typography that will bring your creations to life. Your quest: turn your simple web page into a visually captivating masterpiece that wows users across the globe!</p>
            </div>
            </div>
</div>
</>
)}
export default CssLessons