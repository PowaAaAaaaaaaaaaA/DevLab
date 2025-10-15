// Utils
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJS,
} from "js-beautify";
// Hooks
import useGameModeData from "../../components/Custom Hooks/useGameModeData";
import useAnimatedNumber from "../../components/Custom Hooks/useAnimatedNumber";
import { useInventoryStore } from "../../ItemsLogics/Items-Store/useInventoryStore";
// Animation
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import Loading from '../../assets/Lottie/LoadingDots.json';

import useCodeRushTimer from "../../ItemsLogics/useCodeRushTimer";
import CodeWhisper from "../../ItemsLogics/CodeWhisper";
import { BrainFilter } from "../../ItemsLogics/BrainFilter";

function InstructionPanel({
  setIsCorrect,
  setShowisCorrect,
  submitAttempt,
  showPopup,
  showCodeWhisper,
  setShowCodeWhisper,
  setTimesUp,
  pauseTimer
}) {
  const activeBuffs = useInventoryStore((state) => state.activeBuffs);
  const { gamemodeId } = useParams();
  const { gameModeData, levelData, subject } = useGameModeData();
  const [timer, buffApplied, buffType] = useCodeRushTimer(
    gameModeData?.timer,
    gamemodeId,
    gameModeData,
    showPopup,
    pauseTimer
  );
  const { animatedValue } = useAnimatedNumber(buffApplied ? 30 : 0);

  // Format the Code to Display
  const [formattedCode, setFormattedCode] = useState({
    html: "",
    css: "",
    js: "",
  });

  useEffect(() => {
    if (!gameModeData || !subject) return;
    const codingInterface = gameModeData?.codingInterface || {};
    setFormattedCode({
      html: codingInterface.html
        ? beautifyHTML(codingInterface.html, { indent_size: 2 })
        : "",
      css: codingInterface.css
        ? beautifyCSS(codingInterface.css, { indent_size: 2 })
        : "",
      js: codingInterface.js
        ? beautifyJS(codingInterface.js, { indent_size: 2 })
        : "",
    });
  }, [gameModeData, subject]);

  // BrainBytes Options
  const [selectedOption, setSelectedOption] = useState(null);
  const [filtteredOpttions, setFilteredOptions] = useState([]);
  const [used, setUsed] = useState(false);

  const answerCheck = () => {
    if (!selectedOption) {
      toast.error("Select Answer", { position: "top-right", theme: "colored" });
      return;
    }
    const result = selectedOption === gameModeData.choices.correctAnswer;
    setIsCorrect(result);
    setShowisCorrect(true);
  };

  // Timer logic
  const FormatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (gamemodeId === "CodeRush" && gameModeData?.timer) setStarted(true);
  }, [gamemodeId, gameModeData?.timer]);

  useEffect(() => {
    if (started && gamemodeId === "CodeRush" && timer === 0) setTimesUp(true);
  }, [started, timer, gamemodeId, submitAttempt]);

  useEffect(() => {
    if (!gameModeData?.choices) return;

    let optionsArray = Object.entries(gameModeData.choices)
      .filter(([key]) => key !== "correctAnswer")
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    if (activeBuffs.includes("brainFilter")) {
      setUsed(true);
      BrainFilter(filtteredOpttions, gameModeData.choices.correctAnswer)
        .then((filtered) => setFilteredOptions(filtered))
        .catch(console.error);
    } else if (!used) {
      setFilteredOptions(optionsArray);
    }
  }, [gameModeData, activeBuffs]);

  if (!levelData || !gameModeData) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center  bg-black/98'>
        <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" />
      </div>
    );
  }

  const hasAnyCode = formattedCode.html || formattedCode.css || formattedCode.js;

  return (
    <div className="h-[100%] w-full bg-[#393F59] rounded-2xl text-white overflow-y-scroll p-6 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] flex flex-col gap-5 scrollbar-custom">
      <h2 className="text-[2rem] font-bold text-shadow-lg text-shadow-black text-[#E35460]">
        {levelData.levelOrder}. {gameModeData.title}
      </h2>
      <p className="whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] font-exo">
        {gameModeData.description}
      </p>

      {/* BrainBytes */}
      {gameModeData?.type === "BrainBytes" ? (
        <div className="mt-4 p-4 bg-[#25293B] rounded-2xl flex flex-col gap-3">
          <h3 className="font-bold text-xl mb-2 font-exo text-shadow-lg text-shadow-black">Instruction</h3>
          <p className="mb-2 whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] font-exo">
            {gameModeData.instruction}
          </p>
          <div className="bg-[#191C2B] p-3 rounded-xl text-white whitespace-pre-wrap flex flex-col justify-center overflow-hidden">
            <AnimatePresence>
              {filtteredOpttions.map(([key, value]) => (
                <motion.label
                  key={key}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.3, type: "pop", stiffness: 300 }}
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
                </motion.label>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={answerCheck}
            className="w-[30%] min-h-[8%] self-end rounded-[10px] font-exo font-bold bg-[#7F5AF0] hover:cursor-pointer hover:bg-[#6A4CD4] hover:scale-101 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.3)]"
          >
            Submit
          </motion.button>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-[#25293B] rounded-2xl">
          <h3 className="font-bold text-xl mb-2 text-shadow-lg text-shadow-black">Instruction</h3>
          <p className="mb-2 font-exo whitespace-pre-line leading-relaxed">{gameModeData.instruction}</p>

          {hasAnyCode && (
            <div>
              {formattedCode.html && (
                <>
                  <p className="font-bold mb-1 text-[#FF5733]">HTML</p>
                  <pre className="bg-[#191C2B] p-4 rounded-xl whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {formattedCode.html}
                  </pre>
                </>
              )}
              {formattedCode.css && (
                <>
                  <p className="font-bold mb-1 text-[#1E90FF]">CSS</p>
                  <pre className="bg-[#191C2B] p-4 rounded-xl whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {formattedCode.css}
                  </pre>
                </>
              )}
              {formattedCode.js && (
                <>
                  <p className="font-bold mb-1 text-[#F7DF1E]">JavaScript</p>
                  <pre className="bg-[#191C2B] p-4 rounded-xl whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {formattedCode.js}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* CodeRush Timer */}
      {gameModeData?.type === "CodeRush" && (
        <div className="font-bold text-[3.2rem] w-[60%] m-auto p-2 flex flex-col justify-center items-center bg-[#25293B] rounded-2xl relative">
          <p className="font-exo text-shadow-lg text-shadow-black text-[1.5rem]">Time:</p>
          <p className="text-[#E35460]">{FormatTimer(timer)}</p>
          <AnimatePresence>
            {buffApplied && (
              <>
                {buffType === "extraTime" && (
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
                {buffType === "timeFreeze" && (
                  <motion.span
                    key="time-freeze"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: -10, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.8 }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-2 text-blue-400 text-2xl font-bold"
                  >
                    Time Frozen!
                  </motion.span>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CodeCrafter Replication */}
      {gameModeData?.type === "CodeCrafter" && gameModeData?.replicationFile && (
        <div className="mt-6 p-4 bg-[#25293B] rounded-2xl flex flex-col gap-3">
          <h3 className="font-bold text-xl mb-2 text-shadow-lg text-shadow-black">Replication Target</h3>
          <iframe
            src={gameModeData.replicationFile}
            title="Replication Preview"
            className="w-full h-[400px] bg-white rounded-xl shadow-md"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

      {/* Code Whisper */}
      <AnimatePresence>
        {showCodeWhisper && (
          <CodeWhisper
            hint={gameModeData?.hint}
            onClose={async () => setShowCodeWhisper(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default InstructionPanel;
