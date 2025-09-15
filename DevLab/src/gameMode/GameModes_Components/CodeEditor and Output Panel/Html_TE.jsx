// for the Text Editor
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EditorView } from "@codemirror/view";
// (Disable Auto Complete for Mode "Bugbust")
import { htmlLanguage } from "@codemirror/lang-html";
import { LanguageSupport } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
// Animation
import Animation from '../../../assets/Lottie/OutputLottie.json'
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
// Utils
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
//
import { unlockAchievement } from "../../../components/Custom Hooks/UnlockAchievement";
import useUserDetails from "../../../components/Custom Hooks/useUserDetails";

function Html_TE({setIsCorrect,setShowisCorrect}) {
  const {Userdata, isLoading } = useUserDetails();

    const {gamemodeId} = useParams();
    // For the Code Mirror Input/Output
    const [code, setCode] = useState("");
    const iFrame = useRef(null);
    const [hasRunCode, setRunCode] = useState(false);
    const [isCorrect, setCorrect] = useState(true)

const extractTags = (html) => {
  const tagRegex = /<([a-zA-Z0-9]+)(\s|>)|<!--[\s\S]*?-->/g;
  const tags = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    if (match[0].startsWith('<!--')) {
      tags.push('<!--'); // push the whole comment
    } else {
      tags.push(`<${match[1].toLowerCase()}>`); // push normal tags
    }
  }

  return [...new Set(tags)]; // remove duplicates
};

    const runCode = () =>{
      setRunCode(true);
      setTimeout(() => {
        const fullCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        </head>
        <body>${code}
        </body>
        </html>`;
        const doc =
          iFrame.current.contentDocument ||
          iFrame.current.contentWindow.document;
        doc.open();
        doc.write(fullCode);
        doc.close();
      }, 0);

      if (gamemodeId === "Lesson"){  
      }else{
        setIsCorrect(isCorrect);
          // --- TAG USAGE ACHIEVEMENT ---
  const usedTags = extractTags(code); 
  if (usedTags.length > 0) {
    unlockAchievement(Userdata?.uid, "Html", "tagUsed", { usedTags, isCorrect});
  }
  setShowisCorrect(true)
      }
    }
  return (
    <>
      <div className="bg-[#191a26] h-[95%] rounded-2xl flex flex-col gap-3 items-center p-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] w-[47%] ml-auto">
        <div className="flex-1 min-h-0 overflow-auto w-full">
        <CodeMirror
          className="text-[1rem] h-full"
          value={code}
          onChange={(val) => setCode(val)}
          height="100%"
          width="100%"
          extensions={[
            new LanguageSupport(htmlLanguage, [autocompletion({ override: [] })]),
            html({ autoCloseTags: false }), 
            EditorView.lineWrapping
          ]}
          theme={tokyoNight} />
        </div>
        <div className="flex justify-around w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            onClick={runCode}
            className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]">
            RUN
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
            className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]">
            EVALUATE
          </motion.button>
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
            <Lottie
              animationData={Animation}
              loop={true}
              className="w-[70%] h-[70%]"/>
            <p className="text-[0.8rem]">
              YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
            </p>
          </div>
        )}
      </div>



    </>
  );
}

export default Html_TE;
