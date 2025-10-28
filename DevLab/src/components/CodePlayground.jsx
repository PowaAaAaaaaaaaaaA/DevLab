// Utils
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css'
// CodeMirror
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EditorView } from "@codemirror/view"; 
// Ui
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
// Assets
import Animation from "../assets/Lottie/OutputLottie.json";
// Components
import CodePlaygroundEval_PopUp from "../gameMode/GameModes_Popups/CodePlaygroundEval_PopUp";
import codePlaygroundEval from "./OpenAI Prompts/codePlaygroundEval";


function CodePlayground() {
  const tabs = ["HTML", "CSS", "JavaScript"];
  const [activeTab, setActiveTab] = useState("HTML");
  const [run, setRun] = useState(false);
  const navigate = useNavigate();
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  // useRef
  const iFrame = useRef(null);

  // Initial Text Each Tab
  const [code, setCode] = useState({
    HTML: "<!-- Write your HTML code here -->",
    CSS: "/* Write your CSS code here */",
    JavaScript: "// Write your JavaScript code here",
  });
  // Handle code change based on active tab
  const onChange = useCallback(
    (val) => {
      setCode((prev) => ({
        ...prev,
        [activeTab]: val,
      }));
    },
    [activeTab]
  );
  // Determine the CodeMirror extension based on active tab
  const getLanguageExtension = () => {
    switch (activeTab) {
      case "HTML":
        return html();
      case "CSS":
        return css();
      case "JavaScript":
        return javascript({ jsx: true });
      default:
        return javascript();
    }
  };

  // This will run the code when the Button is pressed 
  const runCode = () => {
    setRun(true); // trigger iframe to appear
    // Slight delay to allow iframe to mount first ( kase kelangan double click yung "run" btn kapag wlaang delay TT)
    setTimeout(() => {
      const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>${code.CSS}</style>
</head>
<body>
  ${code.HTML}
  <script>
  (() => {
    ${code.JavaScript}
  })();
  </script>
</body>
</html>`;
      const iframe = iFrame.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(fullCode);
        doc.close();
      }
    }, 0);
  };

const [isEvaluating, setIsEvaluating] = useState(false);
//Eval Button
  const handleEvaluate = async () => {
  setIsEvaluating(true);
  try {
    const result = await codePlaygroundEval({
      html: code.HTML,
      css: code.CSS,
      js: code.JavaScript,
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
<div className="bg-[#16161A] lg:h-screen xl:h-screen text-white font-exo h-auto flex flex-col p-3">
  <div className="text-4xl sm:text-5xl font-bold p-4 sm:p-10">
    <span className="cursor-pointer" onClick={() => navigate("/main")}>
      DEVLAB
    </span>
  </div>

  <div className="flex flex-col lg:flex-row p-1 gap-5 flex-1 min-h-0">
    {/* Left Panel */}
    <div className="flex flex-col lg:w-3/5 w-full md:h-[70vh] sm:h-[60vh] h-[90vh]">
      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap p-2 text-[1rem] sm:text-[1.1rem] gap-2 sm:gap-10 w-full h-[10%]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-exo font-bold lg:w-[25%] md:w-[30%] sm:w-[30%] rounded-2xl flex-1 sm:flex-none h-full bg-[#1E1E2E] transition-all duration-300 ease-in-out transform${
              activeTab === tab
                ? `${
                    tab === "HTML"
                      ? "text-[#FF4500] shadow-[0_0_15px_#FF4500]"
                      : tab === "CSS"
                      ? "text-[#2965f1] shadow-[0_0_15px_#2965f1]"
                      : tab === "JavaScript"
                      ? "text-[#f7df1e] shadow-[0_0_15px_#f7df1e]"
                      : "text-[#9333EA]"
                  } scale-105`
                : "text-gray-100 hover:scale-105 cursor-pointer"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Code Editor wrapper */}
      <div className="px-2 p-4 sm:px-4 w-full flex flex-col flex-1 min-h-0 gap-3 rounded-3xl bg-[#1A1B26] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
        {/* CodeMirror container */}
        <div className="flex-1 min-h-0 overflow-auto">
          <CodeMirror
            className="text-base sm:text-xl h-full scrollbar-custom"
            height="100%"
            value={code[activeTab]}
            extensions={[getLanguageExtension(), EditorView.lineWrapping]}
            onChange={onChange}
            theme={tokyoNight}
          />
        </div>

        <motion.div className="flex flex-col sm:flex-row justify-end gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="px-4 py-2 bg-[#7e22ce] rounded-xl text-white cursor-pointer w-full sm:w-[15%] hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
          >
            {isEvaluating ? "Evaluating..." : "EVALUATE"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#9333EA" }}
            transition={{ bounceDamping: 100 }}
            onClick={runCode}
            className="px-4 py-2 bg-[#9333EA] rounded-xl text-white cursor-pointer w-full sm:w-[15%] hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
          >
            Run Code
          </motion.button>
        </motion.div>
      </div>
    </div>

    {/* Output Panel */}
    <div className="bg-[#F8F3FF] text-black w-full lg:w-[39%] h-[50vh] sm:h-full rounded-3xl shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] overflow-auto">
      {run ? (
        <iframe
          title="output"
          ref={iFrame}
          className="w-full h-full rounded-3xl"
          sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-top-navigation-by-user-activation"
        />
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center rounded-2xl bg-[#F8F3FF] p-2">
          <Lottie
            animationData={Animation}
            className="w-[50%] sm:w-[40%] h-[50%] sm:h-[40%]"
          />
          <p className="text-gray-700 font-bold text-center mt-2 text-sm sm:text-base px-2">
            YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
          </p>
        </div>
      )}
    </div>
  </div>

  <AnimatePresence>
    {showPopup && evaluationResult && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CodePlaygroundEval_PopUp
          evaluationResult={evaluationResult}
          setShowPopup={setShowPopup}
        />
      </motion.div>
    )}
  </AnimatePresence>
</div>

  );
}

export default CodePlayground;
