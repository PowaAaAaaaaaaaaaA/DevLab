// Utils
import { useEffect, useState,  } from "react";
import { useParams } from "react-router-dom";
import {html as beautifyHTML,css as beautifyCSS,js as beautifyJS,} from "js-beautify";
// Hooks
import useGameModeData from "../../components/Custom Hooks/useGameModeData";
import useUserDetails from "../../components/Custom Hooks/useUserDetails";
import useAnimatedNumber from "../../components/Custom Hooks/useAnimatedNumber";
import useActiveBuffs from "../../components/Custom Hooks/useActiveBuffs";

// Animation
import { motion,AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
// 
import useCodeRushTimer from "../../ItemsLogics/useCodeRushTimer";
import CodeWhisper from "../../ItemsLogics/CodeWhisper";
import {BrainFilter} from "../../ItemsLogics/BrainFilter"

function InstructionPanel({submitAttempt, showPopup, showCodeWhisper, setShowCodeWhisper}) {

  const {gamemodeId} = useParams();
  const { gameModeData, levelData, subject } = useGameModeData();
  const {Userdata,refetch} = useUserDetails();
  const { activeBuffs, loading } = useActiveBuffs();

  const [timer,buffApplied] = useCodeRushTimer(gameModeData?.timer, gamemodeId,gameModeData,showPopup,Userdata?.activeBuffs,refetch)
  const {animatedValue} = useAnimatedNumber(buffApplied ? 30 : 0);
  
    // Format the Code to Display
  const [formattedCode, setFormattedCode] = useState("");
  useEffect(() => {
    if (!gameModeData || !subject) return;
    const rawCode = gameModeData?.preCode || "";
    switch (subject) {
      case "Html":
        setFormattedCode(beautifyHTML(rawCode, { indent_size: 2 }));
        break;
      case "Css":
        setFormattedCode(beautifyCSS(rawCode, { indent_size: 2 }));
        break;
      case "JavaScript":
        setFormattedCode(beautifyJS(rawCode, { indent_size: 2 }));
        break;
      default:
        setFormattedCode(rawCode);
    }
  }, [gameModeData, subject]);


  // BrainBytes Options
  const [selectedOption, setSelectedOption] = useState(null);
    // !! For BrainBytes (Checking Selected Answer)
  const answerCheck = () => {
      if (!selectedOption) {
        toast.error("Select Answer", {
          position: "top-right",
          theme: "colored",
        });
        return;
      }
      if (selectedOption === gameModeData.correctAnswer) {
        console.log("Correct Answer");
      } else {
        submitAttempt(false)
        console.log("Wrong");
      }
    };

const FormatTimer = (seconds) =>{
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const [filtteredOpttions, setFilteredOptions] = useState([])
const [used, setUsed] = useState(false)
useEffect(() => {
  if (!gameModeData?.options || loading) return; // wait for buffs to load

  let optionsArray = Object.entries(gameModeData.options)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
console.log(activeBuffs)
  if (activeBuffs.includes("brainFilter")) {
    setUsed(true)
    BrainFilter(filtteredOpttions, gameModeData.correctAnswer)
      .then((filtered) => setFilteredOptions(filtered))
      .catch(console.error);
  } else if(!used) {
    setFilteredOptions(optionsArray);
    console.log("else");
  }
}, [gameModeData, activeBuffs, loading]);


  return (
    <div
      className="h-[95%] w-[32%] bg-[#393F59] rounded-2xl text-white overflow-y-scroll p-6 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] flex flex-col gap-5
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100  
        [&::-webkit-scrollbar-thumb]:rounded-full
        dark:[&::-webkit-scrollbar-track]:bg-[#393F59]    
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      {levelData && gameModeData ? (
        <>
          {subject === "Html" && (
            <>
              <h2
                className={`text-[2rem] font-bold text-shadow-lg text-shadow-black ${
                  gameModeData?.type === "Lesson"
                    ? "text-[#FF5733]"
                    : "text-[#E35460]"
                }`}>
                {levelData.order}. {gameModeData.title}
              </h2>
            </>
          )}
          {subject === "Css" && (
            <>
              <h2
                className={`text-[2rem] font-bold text-shadow-lg text-shadow-black ${
                  gameModeData?.type === "Lesson"
                    ? "text-[#1E90FF]"
                    : "text-[#E35460]"
                }`}>
                {levelData.order}. {gameModeData.title}
              </h2>
            </>
          )}
          {subject === "Database" && (
            <>
              <h2
                className={`text-[2rem] font-bold text-shadow-lg text-shadow-black ${
                  gameModeData?.type === "Lesson"
                    ? "text-[#4CAF50]"
                    : "text-[#E35460]"
                }`}>
                {levelData.order}. {gameModeData.title}
              </h2>
            </>
          )}
          {subject === "JavaScript " && (
            <>
              <h2
                className={`text-[2rem] font-bold text-shadow-lg text-shadow-black ${
                  gameModeData?.type === "Lesson"
                    ? "text-[#F7DF1E]"
                    : "text-[#E35460]"
                }`}>
                {levelData.order}. {gameModeData.title}
              </h2>
            </>
          )}
          <p className="whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] font-exo">
            {gameModeData.topic}
          </p>
          {gameModeData?.type === "BrainBytes" ? (
            <div className="mt-4 p-4 bg-[#25293B] rounded-2xl flex flex-col gap-3">
              <h3 className="font-bold text-xl mb-2 font-exo text-shadow-lg text-shadow-black">
                Instruction
              </h3>
              <p className="mb-2 whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] font-exo ">
                {gameModeData.instruction}
              </p>
              {/*Mapping ng options*/}
              <div className="bg-[#191C2B] p-3 rounded-xl text-white whitespace-pre-wrap flex flex-col justify-center overflow-hidden">
{filtteredOpttions.map(([key, value]) => (
  <label
    key={key}
    className={`flex items-start gap-3 cursor-pointer p-3 m-2 rounded-xl hover:bg-gray-500 transition-all duration-500 ${
      selectedOption === key ? "bg-gray-500" : "bg-gray-700"
    }`}
  >
    <input
      type="radio"
      name="option"
      value={key}
      checked={selectedOption === key}
      onChange={() => setSelectedOption(key)}
      className="accent-purple-600 mt-1"
    />
    <span className="font-mono text-sm break-all">{key}: {value}</span>
  </label>
))}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, background: "#7e22ce" }}
                transition={{ bounceDamping: 100 }}
                onClick={answerCheck}
                className="w-[30%] min-h-[8%] self-end rounded-[10px] font-exo font-bold bg-[#7F5AF0] hover:cursor-pointer hover:bg-[#6A4CD4] hover:scale-101 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.3)]">
                Submit
              </motion.button>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-[#25293B] rounded-2xl">
              <h3 className="font-bold text-xl mb-2 text-shadow-lg text-shadow-black">
                Instruction
              </h3>
              <p className="mb-2 font-exo">{gameModeData.instruction}</p>
              <p className="bg-[#191C2B] p-4 rounded-xl text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {formattedCode}
              </p>
            </div>
          )}
          {gameModeData?.type === "CodeRush"?(
  <div className="font-bold text-[3.2rem] w-[60%] m-auto p-3 flex flex-col justify-center items-center bg-[#25293B] rounded-2xl relative overflow-hidden">
    <p className="font-exo text-shadow-lg text-shadow-black text-[1.5rem]">Time:</p>
    <p className="text-[#E35460]">{FormatTimer(timer)}</p>
    {/* Extra Time Animation */}
    <AnimatePresence>
      {buffApplied && (
        <motion.span
          key="extra-time"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -10, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className="absolute top-2 text-green-400 text-2xl font-bold"
        >
          +{animatedValue}s
        </motion.span>
      )}
    </AnimatePresence>
  </div>
          ):null}
  {/*Code Whisper*/}
  <AnimatePresence>
  {showCodeWhisper && (
    <CodeWhisper
    hint={gameModeData?.hint}
    onClose= {async() => {
          setShowCodeWhisper(false);
        }}/>
  )}
  </AnimatePresence>
        </>
      ) : (
        <p>Loading...</p>
      )
      }
    </div>
  );
}

export default InstructionPanel;
