// for the Text Editor
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from '@codemirror/lang-css';
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
// Animation
import Animation from "../../../assets/Lottie/OutputLottie.json";
import Lottie from "lottie-react";
import Evaluation_Popup from "../../GameModes_Popups/Evaluation_Popup";
import toast from "react-hot-toast";
// Utils
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { checkCssAchievements } from "../../../components/Achievements Utils/Css_KeyExtract";
import { unlockAchievement } from "../../../components/Custom Hooks/UnlockAchievement";
import { useGameStore } from "../../../components/OpenAI Prompts/useBugBustStore";
// Data
import useFetchUserData from "../../../components/BackEnd_Data/useFetchUserData";
import useFetchGameModeData from "../../../components/BackEnd_Data/useFetchGameModeData";
// Open AI
import lessonPrompt from "../../../components/OpenAI Prompts/lessonPrompt";


function Css_TE() {
  // Data
  const { userData } = useFetchUserData();
  const { gamemodeId } = useParams();
  const { gameModeData, subject } = useFetchGameModeData();
  const [description, setDescription] = useState("");
    // Utils
  const isCorrect = useGameStore((state) => state.isCorrect);
  const setSubmittedCode = useGameStore((state) => state.setSubmittedCode);

  const tabs = ["HTML", "CSS"];
  const [activeTab, setActiveTab] = useState("CSS");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  // PopUp
    const [showPopup, setShowPopup] = useState(false);
  // For the Code Mirror Input/Output
  const [code, setCode] = useState({
    HTML: "",
    CSS: "",
});
// Output Panel
  const iFrame = useRef(null);
  const [hasRunCode, setRunCode] = useState(false);
 // Determine the CodeMirror extension based on active tab
const getLanguageExtension = () => {
  switch (activeTab) {
    case "HTML":
      return html({ autoCloseTags: false });
    case "CSS":
      return css();
    case "JavaScript":
      return javascript({ jsx: true });
    default:
      return html({ autoCloseTags: false });
  }
};
// Handle code change based on active tab
const onChange = useCallback(
  (val) => {
    setCode((prev) => {
      const newCode = { ...prev, [activeTab]: val };
      setSubmittedCode({ [activeTab]: val }); //  updates only one key
      return newCode;
    });
  },
  [activeTab, setSubmittedCode]
);



// Run Button
  const runCode = () => {

  const allEmpty = !code.HTML.trim() && !code.CSS.trim();
  if (allEmpty) {
    toast.error("Please enter your code before running.", {
      position: "top-right",
    });
    return;
  }

    setRunCode(true);
    setTimeout(() => {
    const fullCode = 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
    <style>${code.CSS}</style>
    </head>
    <body>
    ${code.HTML}
    </body>
    </html>`;
      const doc =
        iFrame.current.contentDocument || iFrame.current.contentWindow.document;
      doc.open();
      doc.write(fullCode);
      doc.close();
    }, 0);

    if (gamemodeId !== "Lesson"){
        const unlocked = checkCssAchievements(code.CSS);
          if (unlocked.length > 0) {
            unlocked.forEach(title => {
            unlockAchievement(userData.uid, "Css", "cssAction", { achievementTitle: title,isCorrect});
          });
        }
      }


  };
  // Eval Button (For Lesson mode Only)
  const handleEvaluate = async () => {
  const allEmpty = !code.HTML.trim() && !code.CSS.trim();
  if (allEmpty) {
    toast.error("Please enter your code before evaluating.", {
      position: "top-right",
    });
    return;
  }

    if (gameModeData?.blocks) {
      const paragraphs = gameModeData.blocks
        .filter(block => block.type === "Paragraph")
        .map(block => block.value)
        .join("\n") || "";
      setDescription(paragraphs);
    }
    setIsEvaluating(true);
    try {
      const result = await lessonPrompt({
        receivedCode: {
          html: code.HTML,
          css: code.CSS,
          js: "",
        },
        instruction: gameModeData.instruction,
        description: description,
        subject,
      });

      setEvaluationResult(result);
      setShowPopup(true);

    } catch (error) {
      console.error("Error evaluating code:", error);
    } finally {
      setIsEvaluating(false);
    }
  };


return (
  <div className="flex flex-col md:flex-row gap-3 w-full lg:h-full md:h-full h-[100vh]">
    {/* Code Editor Panel */}
    <div 
      className="bg-[#191a26] h-[55%] md:h-full w-full md:w-1/2 rounded-2xl flex flex-col gap-3 items-center p-3 border-[#2a3141] border-[1px]"
    >
      {/* Tabs */}
      <div className="flex justify-center items-center gap-4 w-full mb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={() => setActiveTab(tab)}
            className={`font-exo font-bold rounded-xl px-4 py-2 text-sm sm:text-base w-[30%] bg-[#191a26] border border-[#2a3141] cursor-pointer
                        ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-white"}`}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* CodeMirror */}
      <div className="flex-1 min-h-0 overflow-auto w-full scrollbar-custom">
        <CodeMirror
          className="text-[1rem] h-full"
          value={code[activeTab]}
          onChange={onChange}
          height="100%"
          width="100%"
          extensions={[getLanguageExtension(), autocompletion({ override: [] }), EditorView.lineWrapping]}
          theme={tokyoNight}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around w-full mt-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05, background: "#7e22ce" }}
          transition={{ bounceDamping: 100 }}
          onClick={runCode}
          className="bg-[#9333EA] text-white font-bold rounded-xl p-2 sm:p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] text-sm sm:text-base"
        >
          RUN
        </motion.button>

        {/* EVALUATE BUTTON — only for Lesson mode */}
        {gamemodeId === "Lesson" && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className={`font-bold rounded-xl text-white p-2 sm:p-3 w-[45%] text-sm sm:text-base ${
              isEvaluating
                ? "bg-gray-600 opacity-50 cursor-not-allowed"
                : "bg-[#9333EA] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
            }`}
          >
            {isEvaluating ? "Evaluating..." : "EVALUATE"}
          </motion.button>
        )}
      </div>
    </div>

    {/* Output Panel */}
    <div 
      className="h-[45%] mb-2 md:h-full w-full md:w-1/2 rounded-2xl p-2 bg-[#F8F3FF] border-[#2a3141] border-[1px]"
    >
      {hasRunCode ? (
        <iframe
          ref={iFrame}
          title="output"
          className="w-full h-full rounded-xl"
          sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-top-navigation-by-user-activation"
        />
      ) : (
        <div className="w-full h-full flex items-center flex-col justify-center">
          <Lottie animationData={Animation} loop={true} className="w-[50%] h-[50%] sm:w-[70%] sm:h-[70%]" />
          <p className="text-sm text-center p-2">
            YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
          </p>
        </div>
      )}
    </div>

    {/* Evaluation Popup */}
    <AnimatePresence>
      {showPopup && evaluationResult && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Evaluation_Popup evaluationResult={evaluationResult} setShowPopup={setShowPopup} />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

}

export default Css_TE;
