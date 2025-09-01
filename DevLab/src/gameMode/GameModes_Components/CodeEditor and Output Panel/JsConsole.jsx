import { useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

function JsConsole() {
  const [code, setCode] = useState(
    "// Write your JS code here\nconsole.log('Hello DevLab!');"
  );
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef([]);

  const runCode = () => {
    // Clear previous logs
    consoleRef.current = [];
    setLogs([]);

    // Custom console.log
    const customLog = (...args) => {
      consoleRef.current.push(args.join(" "));
      setLogs([...consoleRef.current]);
    };

    try {
      // eslint-disable-next-line no-new-func
      const func = new Function("console", code);
      func({ log: customLog });
    } catch (error) {
      customLog("Error:", error.message);
    }
  };

  return (
    <div className="flex w-full h-screen bg-[#1e1e2e] p-4">
      {/* Code Editor */}
      <div className="flex-1">
        <CodeMirror
          value={code}
          height="300px"
          extensions={[javascript()]}
          theme={tokyoNight}
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* Run Button */}
      <button
        onClick={runCode}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-800"
      >
        Run Code
      </button>

      {/* Console Output */}
      <div className="mt-4 p-3 bg-black text-green-400 font-mono h-48 overflow-auto rounded-lg shadow-inner border border-white">
        {logs.length > 0 ? (
          logs.map((log, i) => <div key={i}> {log}</div>)
        ) : (
          <div className="text-gray-500">
            Console output will appear here...
          </div>
        )}
      </div>
    </div>
  );
}

export default JsConsole;
