import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJS,
} from "js-beautify";
import useGameModeData from "../../components/Custom Hooks/useGameModeData";
import Lottie from "lottie-react";
import Loading from "../../assets/Lottie/LoadingDots.json";

function LessonInstructionPanel() {
  const { gamemodeId } = useParams();
  const { gameModeData, levelData, subject } = useGameModeData();


  const [formattedCode, setFormattedCode] = useState("");

  // Format the codingInterface if it exists
  useEffect(() => {
    if (!gameModeData || !subject) return;
    const rawCode = gameModeData?.codingInterface || "";
    switch (subject) {
      case "Html":
        setFormattedCode(beautifyHTML(rawCode, { indent_size: 2 }));
        break;
      case "Css":
        setFormattedCode(beautifyCSS(rawCode, { indent_size: 2 }));
        break;
      case "JavaScript":
        setFormattedCode(beautifyJS(rawCode, { indent_size: 2 }));
        break;
      default:
        setFormattedCode(rawCode);
    }
  }, [gameModeData, subject]);

  if (!levelData || !gameModeData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98">
        <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" />
      </div>
    );
  }

  return (
    <div className="h-[100%] w-full bg-[#393F59] rounded-2xl text-white overflow-y-scroll p-6 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] flex flex-col gap-5 scrollbar-custom">
      {/* Title Section */}
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
        {levelData.order}. {gameModeData.title}
      </h2>

      {/* Render Blocks Dynamically */}
      <div className="flex flex-col gap-4">
        {gameModeData.blocks?.map((block) => {
          switch (block.type) {
            case "Header":
              return (
                <h3
                  key={block.id}
                  className="text-xl font-bold text-shadow-lg text-shadow-black"
                >
                  {block.value}
                </h3>
              );
            case "Paragraph":
              return (
                <p
                  key={block.id}
                  className="whitespace-pre-line text-justify leading-relaxed text-[0.9rem] font-exo"
                >
                  {block.value}
                </p>
              );
            case "Divider":
              return (
                <div
                  key={block.id}
                  className={`my-6 h-[2px] w-full rounded-full 
                    ${subject === "Html" ? "bg-gradient-to-r from-[#FF7F50] to-[#FF5733]" : ""} 
                    ${subject === "Css" ? "bg-gradient-to-r from-[#1E90FF] to-[#4169E1]" : ""} 
                    ${subject === "Database" ? "bg-gradient-to-r from-[#66BB6A] to-[#4CAF50]" : ""} 
                    ${subject === "JavaScript" ? "bg-gradient-to-r from-[#FFF176] to-[#F7DF1E]" : ""} 
                    shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                />);
            default:
              return null;
          }
        })}
      </div>

      {/* Coding Interface (if available) */}
      {gameModeData.codingInterface && (
        <div className="mt-4 p-4 bg-[#25293B] rounded-2xl">
          <h3 className="font-bold text-xl mb-2 text-shadow-lg text-shadow-black">
            Code Example
          </h3>
          <p className="bg-[#191C2B] p-4 rounded-xl text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {formattedCode}
          </p>
        </div>
      )}
    </div>
  );
}

export default LessonInstructionPanel;
