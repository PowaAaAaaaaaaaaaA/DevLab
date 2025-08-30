// Navigation (React Router)
import { useParams } from "react-router-dom";
import { useState } from "react";
// Components
import GameHeader from "../gameMode/GameModes_Components/GameHeader";
import InstructionPanel from "../gameMode/GameModes_Components/InstructionPanel";
import GameFooter from "../gameMode/GameModes_Components/GameFooter";
import Html_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Database_TE";
// ICons 
import { LuChevronLast } from "react-icons/lu";
import { LuChevronFirst } from "react-icons/lu";

function LessonPage() {
  const { subject } = useParams();
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  // Helper function to render editor dynamically
  const renderEditor = () => {
    switch (subject) {
      case "Html":
        return <Html_TE />;
      case "Css":
        return <Css_TE />;
      case "JavaScript":
        return <JavaScript_TE />;
      case "Database":
        return <Database_TE />;
      default:
        return <div className="text-white">Invalid subject</div>;
    }
  };

  return (
    <div className="h-screen bg-[#0D1117] flex flex-col overflow-hidden">
      {/* Header */}
      <GameHeader />

      {/* Content */}
      <div className="relative h-[83%] flex p-4 transition-all duration-500 ">
        {/* Instruction Panel */}
        <div
          className={`bg-[#161B22]transition-all duration-500 ${
            isEditorVisible ? "w-[35%]" : "w-full"}`}>
          <InstructionPanel />
        </div>

        {/* Code Editor and Output Panel */}
        <div
          className={` transition-all flex duration-500 ${
            isEditorVisible ? "w-[80%]" : "w-0 overflow-hidden"
          }`}>
          {isEditorVisible && renderEditor()}
        </div>

  {/* Hover-Reveal Toggle Button */}
  <div className="absolute top-1/2 -translate-y-1/2 right-0">
    <button
      onClick={() => setIsEditorVisible((prev) => !prev)}
      className="relative -right-[80%] hover:right-0 transition-all duration-300 bg-[#238636] text-white rounded-l-lg p-7 shadow-lg text-4xl cursor-pointer" >
      {isEditorVisible ? <LuChevronLast /> : <LuChevronFirst />}
    </button>
  </div>
      </div>

      {/* Footer */}
      <GameFooter />
    </div>
  );
}

export default LessonPage;
