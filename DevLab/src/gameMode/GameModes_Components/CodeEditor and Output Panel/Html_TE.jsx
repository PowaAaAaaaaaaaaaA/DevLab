// Code Mirror
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EditorView } from "@codemirror/view";
import { htmlLanguage } from "@codemirror/lang-html";
import { LanguageSupport } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
// Ui's // PopUps
import Animation from "../../../assets/Lottie/OutputLottie.json";
import Lottie from "lottie-react";
import Evaluation_Popup from "../../GameModes_Popups/Evaluation_Popup";
// Utils
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { unlockAchievement } from "../../../components/Custom Hooks/UnlockAchievement";
import { extractTags } from "../../../components/Achievements Utils/Html_KeyExtract";
import { useGameStore } from "../../../components/OpenAI Prompts/useBugBustStore";
// Data
import useFetchUserData from "../../../components/BackEnd_Data/useFetchUserData";
import useGameModeData from "../../../components/Custom Hooks/useGameModeData";
// Open AI
import lessonPrompt from "../../../components/OpenAI Prompts/lessonPrompt";

function Html_TE() {
  // Data
  const { userData } = useFetchUserData();
  const { gamemodeId } = useParams();
  const { gameModeData, subject } = useGameModeData();
  const [description, setDescription] = useState("");

  // Utils
  const isCorrect = useGameStore((state) => state.isCorrect);
  const setSubmittedCode = useGameStore((state) => state.setSubmittedCode);
  const { setHtmlCode } = useGameStore();

  const iFrame = useRef(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hasRunCode, setRunCode] = useState(false);
  //  Popup state
  const [showPopup, setShowPopup] = useState(false);
  //
  const [code, setCode] = useState("");

  // Run Button
  const runCode = () => {
    setRunCode(true);
    setTimeout(() => {
      const fullCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head></head>
        <body>${code}</body>
        </html>`;
      const doc =
        iFrame.current.contentDocument ||
        iFrame.current.contentWindow.document;
      doc.open();
      doc.write(fullCode);
      doc.close();
    }, 0);
    if (gamemodeId !== "Lesson") {
      const usedTags = extractTags(code);
      if (usedTags.length > 0) {
        unlockAchievement(userData?.uid, "Html", "tagUsed", { usedTags, isCorrect });
      }
    }
    setHtmlCode(code);
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
          html: code,
          css: "",
          js: "",
        },
        instruction: gameModeData.instruction,
        description: description,
        subject,
      });
      console.log(result);
      setEvaluationResult(result);
      setShowPopup(true);

    } catch (error) {
      console.error("Error evaluating code:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <>
      <div className="bg-[#191a26] h-[95%] rounded-2xl flex flex-col gap-3 items-center p-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] w-[47%] ml-auto">
        <div className="flex-1 min-h-0 overflow-auto w-full scrollbar-custom">
          <CodeMirror
            className="text-[1rem] h-full"
            value={code}
              onChange={(val) => {setCode(val)
                setSubmittedCode(val)
              }}
            height="100%"
            width="100%"
            extensions={[
              new LanguageSupport(htmlLanguage, [autocompletion({ override: [] })]),
              html({ autoCloseTags: false }),
              EditorView.lineWrapping,
            ]}
            theme={tokyoNight}
          />
        </div>

        <div className="flex justify-around w-full">
          {/* RUN BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={runCode}
            className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]">
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

      {/* Output */}
      <div className="h-[95%] rounded-2xl p-2 bg-[#F8F3FF] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] w-[47%] ml-auto ">
        {hasRunCode ? (
          <iframe
            ref={iFrame}
            title="output"
            className="w-full h-full rounded-xl"
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-top-navigation-by-user-activation"
          />
        ) : (
          <div className="w-full h-full flex items-center flex-col">
            <Lottie animationData={Animation} loop={true} className="w-[70%] h-[70%]" />
            <p className="text-[0.8rem] text-center">
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
            exit={{ opacity: 0 }}>
              <Evaluation_Popup evaluationResult={evaluationResult} setShowPopup={setShowPopup}/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Html_TE;
