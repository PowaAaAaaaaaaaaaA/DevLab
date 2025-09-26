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
// Utils
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { unlockAchievement } from "../../../components/Custom Hooks/UnlockAchievement";
import { extractJsKeywords } from "../../../components/Achievements Utils/Js_KeyExtract";
// Data
import useFetchUserData from "../../../components/BackEnd_Data/useFetchUserData";

function JavaScript_TE({setIsCorrect}) {
  // Data
  const {gamemodeId} = useParams();
  const { userData } = useFetchUserData();
  // UTils
  const tabs = ["HTML", "CSS", "JavaScript"];
  const [activeTab, setActiveTab] = useState("JavaScript");
  const [isCorrect, setCorrect] = useState(true)
    // Output states
  const iFrame = useRef(null);
  const [hasRunCode, setRunCode] = useState(false);
  // Code states
  const [code, setCode] = useState({
    HTML: "<!-- Write your HTML code here -->",
    CSS: "/* Write your CSS code here */",
    JavaScript: "// Hello World"
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
    },
    [activeTab]
  );
// Run Button
const runCode = () => {
  if (gamemodeId === "Lesson") {
    // skip achievement tracking for lesson preview
  } else {
    setIsCorrect(isCorrect);
  }
  setRunCode(true);
  consoleRef.current = [];
  setLogs([]);
  if (gamemodeId !== "Lesson") {
    const usedTags = extractJsKeywords(code.JavaScript);
    if (usedTags.length > 0) {
      unlockAchievement(userData?.uid, "JavaScript", "tagUsed", {
        usedTags,
        isCorrect,
      });
    }
    console.log("Used JS tags:", usedTags);
  }
  setTimeout(() => {
    if (gamemodeId === "Lesson") {
      // do nothing special for lesson
    } else {
      submitAttempt(isCorrect);
    }
    const fullCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>${code.CSS}</style>
      </head>
      <body>
        ${code.HTML}
        <script>
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
    const doc =
      iFrame.current.contentDocument || iFrame.current.contentWindow.document;
    doc.open();
    doc.write(fullCode);
    doc.close();
  }, 0);

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
      <div className="w-[47%] ml-auto h-full">
        <div className="flex p-4 text-2xl gap-10 h-[10%] w-full">
          {tabs.map((tab) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, background: "#7e22ce" }}
              transition={{ bounceDamping: 100 }}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-exo font-bold rounded-2xl w-[30%] h-auto text-[1rem] bg-[#191a26] cursor-pointer ${
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
          <div className="flex-1 min-h-0 overflow-auto w-full">
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, background: "#7e22ce" }}
              transition={{ bounceDamping: 100 }}
              className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
            >
              EVALUATE
            </motion.button>
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
              sandbox="allow-scripts allow-same-origin"
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

        {/* Console Output */}
        <div className="h-32 p-2 bg-black text-green-400 font-mono overflow-auto rounded-xl shadow-inner border border-white">
          {logs.length > 0 ? (
            logs.map((log, i) => <div key={i}>{log}</div>)
          ) : (
            <div className="text-gray-500">Console output will appear here...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default JavaScript_TE;
