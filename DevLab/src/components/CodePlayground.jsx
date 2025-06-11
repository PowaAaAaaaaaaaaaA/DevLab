import React, { useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

function CodePlayground() {
const tabs = ["HTML", "CSS", "JavaScript"];
const [activeTab, setActiveTab] = useState("HTML");


const iFrame = useRef(null);

// Store code for each tab
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


const runCode = () => {
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
    const iframe =  iFrame.current;
    if (iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(fullCode);
    doc.close();
    }
};

return (
    <div className="bg-[#16161A] h-screen text-white font-exo flex flex-col">
    <div className="text-3xl font-bold p-10">DEVLAB</div>

    <div className="flex p-1 gap-1.5 h-full">
        {/* Left Panel */}
        <div className="flex flex-col w-[60%]">
          {/* Tabs */}
        <div className="flex p-4 text-2xl gap-10 h-[8%] w-full">
            {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-exo font-bold rounded-2xl w-[17%] h-full bg-[#1E1E2E] transition ${
                activeTab === tab
                    ? "text-[#9333EA]"
                    : "text-gray-100 hover:text-gray-200"
                }`}>
                {tab}
            </button>
            ))}
        </div>

          {/* Code Editor */}
        <div className="px-4 w-full h-full">
            <CodeMirror
                value={code[activeTab]}
                height="400px"
                extensions={[getLanguageExtension()]}
                onChange={onChange}
                theme="dark"
            />
        </div>
            <button
                onClick={runCode}
                className="ml-auto px-4 py-2 bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 transition">Run Code</button>
        </div>

        {/* Output Panel */}
        <div className="bg-[#D9D9D9] w-[39%] h-full rounded-2xl border-2 border-black shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
        <iframe
            title="output"
            ref={iFrame}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
        />
        </div>
    </div>
    </div>
);
}

export default CodePlayground;
