// Code Mirror
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
// Ui's // PopUps
import Animation from "../../../assets/Lottie/OutputLottie.json";
import Lottie from "lottie-react";
import Evaluation_Popup from "../../GameModes_Popups/Evaluation_Popup";
// Utils
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { unlockAchievement } from "../../../components/Custom Hooks/UnlockAchievement";
import { extractJsKeywords } from "../../../components/Achievements Utils/Js_KeyExtract";
import { useGameStore } from "../../../components/OpenAI Prompts/useBugBustStore";
// Data
import useFetchUserData from "../../../components/BackEnd_Data/useFetchUserData";
import useGameModeData from "../../../components/Custom Hooks/useGameModeData";
// Open AI
import lessonPrompt from "../../../components/OpenAI Prompts/lessonPrompt";

function JavaScript_TE() {
  // Data
  const { userData } = useFetchUserData();
  const { gamemodeId } = useParams();
  const { gameModeData,subject } = useGameModeData();
  const [description, setDescription] = useState("");
  // UTils
  const isCorrect = useGameStore((state) => state.isCorrect);
  const setSubmittedCode = useGameStore((state) => state.setSubmittedCode);

  const tabs = ["HTML", "CSS", "JavaScript"];
  const [activeTab, setActiveTab] = useState("JavaScript");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
    // Output states
  const iFrame = useRef(null);
  const [hasRunCode, setRunCode] = useState(false);
    //  Popup state
  const [showPopup, setShowPopup] = useState(false);
  // Code states
  const [code, setCode] = useState({
    HTML: "<!-- Write your HTML code here -->",
    CSS: "/* Write your CSS code here */",
    JavaScript: "// Write your JavaScript code here"
  });
  // Console log states
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef([]);

  // Get language for CodeMirror
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
// Handle editor changes
const onChange = useCallback(
  (val) => {
    setCode((prev) => ({
      ...prev,
      [activeTab]: val,
    }));

    // Only store JavaScript code in zustand
    if (activeTab === "JavaScript") {
      setSubmittedCode(val);
    }
  },
  [activeTab, setSubmittedCode]
);


// Run Button

const runCode = () => {
  consoleRef.current = [];
  setLogs([]);
  setRunCode(true);

  if (gamemodeId !== "Lesson") {
    const usedTags = extractJsKeywords(code.JavaScript);
    if (usedTags.length > 0) {
      unlockAchievement(userData?.uid, "JavaScript", "tagUsed", { usedTags, isCorrect });
    }
  }

  setTimeout(() => {
    const fullCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>${code.CSS}</style>
      </head>
      <body>
        ${code.HTML}
        <script>
          // Override console.log to send logs to parent
          const sendLog = (...args) => {
            window.parent.postMessage({ type: 'console-log', args }, '*');
          };
          console.log = sendLog;

          try {
            ${code.JavaScript}
          } catch (err) {
            sendLog('Error:', err.message);
          }
        </script>
      </body>
      </html>
    `;

    if (iFrame.current) {
      iFrame.current.srcdoc = fullCode;
    }
  }, 0);
};



// Eval Button (For Lesson mode Only)
  const handleEvaluate = async () => {
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
          js: code.JavaScript,
        },
        instruction: gameModeData.instruction,
        description: description,
        subject,
      });
      console.log(description);
      setEvaluationResult(result);
      setShowPopup(true);

    } catch (error) {
      console.error("Error evaluating code:", error);
    } finally {
      setIsEvaluating(false);
    }

  };
  // Listen for messages from iframe for console logs
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "console-log") {
        consoleRef.current.push(event.data.args.join(" "));
        setLogs([...consoleRef.current]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return (
    <>
      {/* Code Editor */}
      <div className="w-[47%] ml-auto h-full ">
        <div className="flex p-4 text-2xl gap-10 h-[10%] w-full">
          {tabs.map((tab) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, background: "#7e22ce" }}
              transition={{ bounceDamping: 100 }}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-exo font-bold rounded-2xl w-[30%] h-auto text-[1rem] bg-[#191a26] cursor-pointer  ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
        <div className="bg-[#191a26] h-[88%] w-full rounded-2xl flex flex-col gap-3 items-center p-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
          <div className="flex-1 min-h-0 overflow-auto w-full scrollbar-custom">
            <CodeMirror
              className="text-[1rem]"
              value={code[activeTab]}
              onChange={onChange}
              height="100%"
              width="100%"
              extensions={[getLanguageExtension(), autocompletion({ override: [] }), EditorView.lineWrapping]}
              theme={tokyoNight}
            />
          </div>
          <div className="flex justify-around w-full">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, background: "#7e22ce" }}
              transition={{ bounceDamping: 100 }}
              onClick={runCode}
              className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
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
      className={`bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] ${
        isEvaluating ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isEvaluating ? "Evaluating..." : "EVALUATE"}
    </motion.button>
  )}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="h-full w-[47%] ml-auto flex flex-col gap-4">
        {/* Visual Output */}
        <div className="flex-1 rounded-2xl p-2 bg-[#F8F3FF] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
          {hasRunCode ? (
            <iframe
              ref={iFrame}
              title="output"
              className="w-full h-full rounded-xl"
              sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-top-navigation-by-user-activation"
            />
          ) : (
            <div className="w-full h-full flex items-center flex-col">
              <Lottie
                animationData={Animation}
                loop={true}
                className="w-[70%] h-[70%]"
              />
              <p className="text-[0.8rem]">
                YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
              </p>
            </div>
          )}
        </div>
<div className="h-32 p-2 bg-black text-gray-400 font-mono overflow-auto rounded-xl border shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] scrollbar-custom">
  {!hasRunCode ? (
    <div className="text-gray-500 ">Console output will appear here...</div>
  ) : logs.length > 0 ? (
    logs.map((log, i) => <div key={i}>{log}</div>)
  ) : (
    <div className="text-gray-500">No console output</div>
  )}
</div>



      </div>
      {/* Evaluation Popup */}
      <AnimatePresence>
        {showPopup && evaluationResult && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
              <Evaluation_Popup evaluationResult={evaluationResult} setShowPopup={setShowPopup}/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default JavaScript_TE;
