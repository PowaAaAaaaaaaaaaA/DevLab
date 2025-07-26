// for the Text Editor
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from '@codemirror/lang-css';
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
// Animation
import Animation from "../../../assets/Lottie/OutputLottie.json";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
// Utils
import { useState, useRef, useCallback } from "react";

function Css_TE() {

  const tabs = ["HTML", "CSS"];
  const [activeTab, setActiveTab] = useState("CSS");
  // For the Code Mirror Input/Output
  const [code, setCode] = useState({
    HTML: "<!-- Write your HTML code here -->",
    CSS: "/* Write your CSS code here */",
});
  const iFrame = useRef(null);
  const [hasRunCode, setRunCode] = useState(false);

  // Determine the CodeMirror extension based on active tab
const getLanguageExtension = () => {
    switch (activeTab) {
        case "HTML":
    return html();
        case "CSS":
    return css();

    default:
    return html();
    }
};


// Handle code change based on active tab
const onChange = useCallback((val) => {
    setCode((prev) => ({
    ...prev,
    [activeTab]: val,
}));
}, [activeTab]);






  const runCode = () => {
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
  };

  return (
    <>
       {/* Tabs */}
      <div className="w-[32%] h-[100%]">
        <div className="flex p-4 text-2xl gap-10 h-[8%] w-full">
            {tabs.map((tab) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05, background: "#7e22ce" }}
                  transition={{ bounceDamping: 100 }}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-exo font-bold rounded-2xl w-[30%] h-full text-[1.3rem] bg-[#191a26]  cursor-pointer ${activeTab === tab  
                            ? "text-white "
                            : "text-gray-500 hover:text-white "}`} >
                  {tab}
                </motion.button>))}
        </div>
      <div className=" bg-[#191a26] h-[90%] w-[100%] rounded-2xl flex flex-col gap-3 items-center p-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
        <CodeMirror
          className="text-[1rem]"
          value={code[activeTab]}
          onChange={onChange}
          height="570px"
          width="600px"
          extensions={[getLanguageExtension()]}
          theme={tokyoNight}/>
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
    </div>



      {/* Output */}
      <div className="h-[95%] w-[32%] rounded-2xl p-2 bg-[#F8F3FF] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
        {hasRunCode ? (
          <iframe
            ref={iFrame}
            title="output"
            className="w-full h-full rounded-xl"
            sandbox="allow-scripts allow-same-origin"/>
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

export default Css_TE;
