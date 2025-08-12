import React, { useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import Lottie from "lottie-react";
import Animation from '../assets/Lottie/OutputLottie.json'
import {  motion } from "framer-motion";

function CodePlayground() {
const tabs = ["HTML", "CSS", "JavaScript"];
const [activeTab, setActiveTab] = useState("HTML");
const [run, setRun] = useState(false);


// useRef
const iFrame = useRef(null);
// Initial Text Each Tab
const [code, setCode] = useState({
    HTML: "<!-- Write your HTML code here -->",
    CSS: "/* Write your CSS code here */",
    JavaScript: "// Write your JavaScript code here",
});

// Handle code change based on active tab
const onChange = useCallback((val) => {
    setCode((prev) => ({
    ...prev,
    [activeTab]: val,
}));
}, [activeTab]);


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

// This will run the code when the Button is pressed hehe
const runCode = () => {
  setRun(true); // trigger iframe to appear
  // Slight delay to allow iframe to mount first ( kase kelangan double click yung "run" btn kapag wlaang delay TT)
setTimeout(() => {
    const fullCode = 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
    <style>${code.CSS}</style>
    </head>
    <body>
    ${code.HTML}
    <script>
    ${code.JavaScript}
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
return (
    <div className="bg-[#16161A] h-screen text-white font-exo flex flex-col p-3">
    <div className="text-3xl font-bold p-10">DEVLAB</div>

    <div className="flex p-1 gap-5 h-full">
        {/* Left Panel */}
        <div className="flex flex-col w-[60%]">
          {/* Tabs */}
        <div className="flex p-4 text-2xl gap-10 h-[10%] w-full">
            {tabs.map((tab) => (
                <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-exo font-bold rounded-2xl w-[17%] h-full bg-[#1E1E2E]  transition-all duration-300 ease-in-out transform${activeTab === tab  
                            ? "text-[#9333EA] scale-105 shadow-[0_0_10px_#9333EA]"
                            : "text-gray-100 hover:text-[#C084FC] hover:scale-105 hover:shadow-lg hover:border-[#9333EA] cursor-pointer"}`}>
                            {tab}
                </button>))}
        </div>
        {/* Code Editor wrapper */}
        <div className="px-4 w-full h-[92%] flex flex-col gap-3 rounded-3xl p-3 bg-[#1A1B26] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
            <CodeMirror
                className='text-xl'
                value={code[activeTab]}
                height="660px"
                extensions={[getLanguageExtension()]}
                onChange={onChange}
                theme={tokyoNight}/>
            <motion.button 
            whileTap={{scale:0.95}}
            whileHover={{scale:1.05, background:"#7e22ce"}}
            transition={{bounceDamping:100}}
            onClick={runCode} className="ml-auto px-4 py-2 bg-[#9333EA] rounded-xl text-white cursor-pointer w-[15%] hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]">Run Code</motion.button>
        </div>
        </div>
        {/* Output Panel */}
        <div className="bg-[#F8F3FF] w-[39%] h-full rounded-2xl shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
        {run ?(
            <iframe
            title="output"
            ref={iFrame}
            className="w-full h-full rounded-3xl"
            sandbox="allow-scripts allow-same-origin allow-modals"/>):(
            <div className='w-full h-full flex flex-col justify-center items-center rounded-3xl bg-[#F8F3FF]'>
            <Lottie animationData={Animation} className='w-[50%] h-[50%]'></Lottie>
            <p className='text-gray-700 font-bold'>YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT</p>
            </div>
        )}
        </div>
    </div>
    </div>
);
}

export default CodePlayground;
