// Navigation (React Router)
import { useParams } from "react-router-dom";
// Components
import GameHeader from "../gameMode/GameModes_Components/GameHeader";
import InstructionPanel from "../gameMode/GameModes_Components/InstructionPanel";
import GameFooter from "../gameMode/GameModes_Components/GameFooter";
import Html_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Database_TE";

function LessonPage() {
  const { subject } = useParams();

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
    <div className="h-screen bg-[#0D1117] flex flex-col">
      {/* Header */}
      <GameHeader />
      {/* Content */}
      <div className="h-[83%] flex justify-around items-center p-4">
        {/* Instruction */}
        <InstructionPanel />
        {/* Code Editor and Output Panel */}
        {renderEditor()}
      </div>
      {/* Footer */}
      <GameFooter />
    </div>
  );
}

export default LessonPage;
