import { useEffect, useState } from "react";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJS,
} from "js-beautify";
import useGameModeData from "../../components/Custom Hooks/useGameModeData";
import Lottie from "lottie-react";
import Loading from "../../assets/Lottie/LoadingDots.json";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

function LessonInstructionPanel() {
  const { gameModeData, levelData, subject } = useGameModeData();

  const [formattedCode, setFormattedCode] = useState({
    html: "",
    css: "",
    js: "",
    sql: "",
  });

  useEffect(() => {
    if (!gameModeData || !subject) return;

    const codingInterface = gameModeData?.codingInterface || {};

    const fixNewlines = (code) =>
      code?.replace(/\\n/g, "\n").trim() || "";

    setFormattedCode({
      html: codingInterface.html?.trim()
        ? beautifyHTML(fixNewlines(codingInterface.html), {
            indent_size: 2,
            preserve_newlines: true,
            wrap_line_length: 60,
          })
        : "",
      css: codingInterface.css?.trim()
        ? beautifyCSS(fixNewlines(codingInterface.css), {
            indent_size: 2,
            preserve_newlines: true,
            wrap_line_length: 60,
          })
        : "",
      js: codingInterface.js?.trim()
        ? beautifyJS(fixNewlines(codingInterface.js), {
            indent_size: 2,
            preserve_newlines: true,
            wrap_line_length: 60,
          })
        : "",
      sql: codingInterface.sql?.trim() || "",
    });
  }, [gameModeData, subject]);

  useEffect(() => {
    Prism.highlightAll();
  }, [formattedCode]);

  if (!levelData || !gameModeData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
        <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" />
      </div>
    );
  }

  const hasAnyCode =
    formattedCode.html || formattedCode.css || formattedCode.js || formattedCode.sql;

  const handleCopy = (code) => navigator.clipboard.writeText(code);

  return (
    <div className="h-full w-full bg-[#393F59] rounded-xl text-white overflow-y-auto p-5 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] flex flex-col gap-4 font-exo scrollbar-custom">
      {/* Title */}
      <h2
        className={`text-[2rem] font-bold text-shadow-lg text-shadow-black ${
          gameModeData?.type === "Lesson"
            ? subject === "Html"
              ? "text-[#FF5733]"
              : subject === "Css"
              ? "text-[#1E90FF]"
              : subject === "Database"
              ? "text-[#4CAF50]"
              : subject === "JavaScript"
              ? "text-[#F7DF1E]"
              : "text-white"
            : "text-[#E35460]"
        }`}
      >
        {levelData.levelOrder}. {gameModeData.title}
      </h2>

      {/* Dynamic Blocks */}
      <div className="flex flex-col gap-4">
        {gameModeData?.blocks?.map((block) => {
          switch (block.type) {
            case "Header":
              return (
                <h3 key={block.id} className="text-xl font-bold text-shadow-lg">
                  {block.value}
                </h3>
              );
            case "Paragraph":
              return (
                <p
                  key={block.id}
                  className="whitespace-pre-line text-justify leading-relaxed text-[0.95rem]"
                >
                  {block.value}
                </p>
              );
            case "Divider":
              return (
                <div
                  key={block.id}
                  className={`my-6 h-[2px] w-full rounded-full ${
                    subject === "Html"
                      ? "bg-gradient-to-r from-[#FF7F50] to-[#FF5733]"
                      : subject === "Css"
                      ? "bg-gradient-to-r from-[#1E90FF] to-[#4169E1]"
                      : subject === "Database"
                      ? "bg-gradient-to-r from-[#66BB6A] to-[#4CAF50]"
                      : subject === "JavaScript"
                      ? "bg-gradient-to-r from-[#FFF176] to-[#F7DF1E]"
                      : ""
                  }`}
                />
              );
            case "Image":
              return (
                <img
                  key={block.id}
                  src={block.value}
                  alt="Stage Block"
                  className="my-4 w-full max-h-[400px] object-contain rounded-2xl shadow-md"
                />
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Instruction + Code Example */}
      {(gameModeData.instruction || hasAnyCode) && (
        <div className="mt-4 p-4 bg-[#25293B] rounded-2xl">
          {gameModeData.instruction && (
            <>
              <h4 className="font-bold text-2xl mb-2">Instruction</h4>
              <p className="whitespace-pre-line text-justify leading-relaxed text-[0.9rem]">
                {gameModeData.instruction}
              </p>
            </>
          )}

          {hasAnyCode && (
            <>
              <p className="text-1xl mb-2 font-bold mt-3">Code Example</p>

              {/* HTML */}
              {formattedCode.html && (
                <CodeBlock
                  code={formattedCode.html}
                  language="html"
                  color="#FF5733"
                  handleCopy={handleCopy}
                />
              )}

              {/* CSS */}
              {formattedCode.css && (
                <CodeBlock
                  code={formattedCode.css}
                  language="css"
                  color="#1E90FF"
                  handleCopy={handleCopy}
                />
              )}

              {/* JavaScript */}
              {formattedCode.js && (
                <CodeBlock
                  code={formattedCode.js}
                  language="js"
                  color="#F7DF1E"
                  handleCopy={handleCopy}
                />
              )}

              {/* SQL */}
              {formattedCode.sql && (
                <CodeBlock
                  code={formattedCode.sql}
                  language="sql"
                  color="#4CAF50"
                  handleCopy={handleCopy}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Video Presentation */}
      {gameModeData.videoPresentation && (
        <div className="mt-6 p-4 bg-[#25293B] rounded-2xl">
          <h3 className="font-bold text-xl mb-2">Video Presentation</h3>
          <video
            src={gameModeData.videoPresentation}
            controls
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

// Reusable code block component
const CodeBlock = ({ code, language, color, handleCopy }) => (
  <div className="relative my-4 bg-[#1E1E2E] rounded-xl overflow-hidden border border-[#2A2A3C] shadow-md">
    <div className="flex justify-between items-center bg-[#25293B] px-4 py-2 border-b border-[#2A2A3C]">
      <p className="font-bold text-sm" style={{ color }}>{language.toUpperCase()}</p>
      <button
        onClick={() => handleCopy(code)}
        className="text-gray-300 hover:text-white text-xs bg-[#3A3F55] px-2 py-1 rounded transition-all hover:bg-[#4A5068]"
      >
        Copy
      </button>
    </div>
    <pre className={`language-${language} m-0 p-4 whitespace-pre-wrap break-words overflow-x-hidden text-sm leading-relaxed scrollbar-custom`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  </div>
);

export default LessonInstructionPanel;
