import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import { useNavigate} from "react-router-dom"; 
import JsImage from "../assets/Images/js-Icon-Big.png"
import { MdOutlineLock } from "react-icons/md";
import Lottie from "lottie-react";
import Animation from '../assets/Lottie/LoadingLessonsLottie.json'


function JavaScriptLessons() {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLevels, setShowLevels] = useState(false);
    const [filterType, setFilterType] = useState("JavaScript(FrontEnd)");
    const [animateChange, setAnimateChange] = useState(false);
useEffect(() => {
        setAnimateChange(true); // trigger fade-out
        setShowLevels(false);   // hide levels
    const fetchData = async () => {
    const htmlRef = collection(db, filterType);
    const htmlSnapshot = await getDocs(htmlRef);
    const lessonData = await Promise.all(
        htmlSnapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, filterType, lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);
        const levels = levelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(levels)
        return {
            id: lessonDoc.id,
            ...lessonDoc.data(),
            levels
        };
    })
    );
    setLessons(lessonData);
    setTimeout(() => {setShowLevels(true); setAnimateChange(false);}, 100);
    setLoading(false);
};

    fetchData();
}, [filterType]);

return (
<>
    <div className="h-[100%]">
        {/*Upper Panel*/}
        <div className=" h-[40%] rounded-3xl p-5 flex bg-linear-to-r from-[#DECD41] to-[#FF8C00]">
            <div className="w-[80%] flex flex-col gap-7">
                <div className="p-3 flex flex-col gap-4">
                    <h1 className="font-exo text-white text-[2.3rem] font-bold text-shadow-lg text-shadow-black"> { } JavaScript: The Magic Behind Interactive Web Realms</h1>
                    <p className="w-[70%] text-white font-exo text-shadow-sm text-shadow-black">Step into the enchanted realm of code, where you’ll wield the powerful magic of JavaScript! As a budding sorcerer, you’ll learn to cast spells that bring your web pages to life—turning static sites into interactive, dynamic worlds. From summoning buttons that respond to clicks to conjuring animations and real-time interactions, your journey will unlock the secrets of crafting engaging, magical web experiences. Ready to harness the power of the web? The realm of interactivity awaits!</p>
                </div>
            <div>
                <div className="w-[70%] h-4 mb-4 bg-gray-200 rounded-full  dark:bg-gray-700">
                    <div className="h-4 rounded-full dark:bg-[#2CB67D]" style={{width: '56%'}}></div>
                </div>
            </div>
            </div>
                <div className="w-[30%] flex justify-center p-4">
                    <img src={JsImage} alt="" className="w-[60%] h-[90%]"/>
                </div>
            </div>
            {/*Lower Part hehe*/}
            <div className="h-[60%] flex p-3">
            {/*Left Panel*/}
            {loading ? (<Lottie animationData={Animation} loop={true} className="w-[60%] h-[70%] mt-[30px]" />):
(<div className="w-[60%]">
        <div className="w-[60%] px-3 mt-4">
            <label className="text-white font-exo mr-3">Select Type:</label>
                <select className="bg-[#1f2937] text-white p-2 rounded-md hover:cursor-pointer"value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}>
                    <option value="JavaScript(FrontEnd)" className="hover:cursor-pointer">Frontend</option>
                    <option value="JavaScript(BackEnd)" className="hover:cursor-pointer">Backend</option>
                </select>
        </div>  
    <div className="w-[100%] p-3 h-[90%] overflow-scroll overflow-x-hidden
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
                    className= {`w-full border flex gap-5 rounded-4xl transition-all duration-300 ease-out transform
                    ${showLevels ? 'translate-y-0' : ' translate-y-20'}
                    ${level.status === false
                    ? "bg-[#060505] opacity-30 cursor-not-allowed"
                    : "bg-[#111827] hover:scale-102 cursor-pointer"}
                    ${animateChange ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    onClick={async() => {
                    if (level.status) {
                        const user = auth.currentUser;
                            if(user){
                                const userRef = doc(db, "Users", user.uid);
                                    await updateDoc(userRef,{
                                        lastOpenedLevel: {
                                            lessonId: "JavaScript",    // since nasa JavaScript lesson Page, Hardcoded nalang   
                                            lessonDocId: lesson.id,    
                                            levelId: level.id          
                                        }
                                    })
                                }
                    navigate(`/Main/Lessons/JavaScript/${lesson.id}/${level.id}`);
                }
            }}>
                    <div className=" text-white bg-black w-[15%] flex justify-center items-center  text-[4rem] font-bold rounded-4xl">{level.symbol}</div>
                    <div className="p-4 text-white font-exo"> 
                        <p className="text-[1.4rem]">{level.title}</p>
                        <p className="text-[0.8rem]">{level.desc}</p>
                    </div>
                </div> 
                ))}
            </div>
        </div>))}
    </div>
</div>
    )}
            {/*Right Panel*/}
            <div className="w-[40%] flex flex-col gap-4 p-5">
                <h2 className="text-[2.5rem] font-exo font-bold text-white text-shadow-sm text-shadow-black  tracking-wider">About <span className="text-[#F7DF1E]">JavaScript</span></h2>
                <p className="font-exo text-white">Enter the world of dynamic, interactive web experiences! As a JavaScript mage, you'll learn to cast powerful spells that bring your web pages to life. From creating interactive buttons to controlling animations and data, you’ll master the art of making websites responsive to users' every action. Your mission: unlock the magic that makes the web not just a place to visit, but a realm to interact with!</p>
            </div>
    
            </div>
    
            </div>
    
        </>
)}


export default JavaScriptLessons