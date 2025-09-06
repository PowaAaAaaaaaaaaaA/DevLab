// React
import { useEffect, useState } from "react";
// Navigation (React Router)
import { useParams } from "react-router-dom";
// PopUps
import GameMode_Instruction_PopUp from "./GameModes_Popups/GameMode_Instruction_PopUp";
import LevelCompleted_PopUp from "./GameModes_Popups/LevelCompleted_PopUp";
import Gameover_PopUp from "./GameModes_Popups/Gameover_PopUp";
// for Animation / Icons
import { AnimatePresence } from "framer-motion";
// Components
import GameHeader from "./GameModes_Components/GameHeader";
import GameFooter from "./GameModes_Components/GameFooter";
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "./GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "./GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "./GameModes_Components/CodeEditor and Output Panel/Database_TE";



function CodeCrafter({ heart, roundKey, gameOver, submitAttempt,resetHearts }) {
  const type = "Code Crafter";

  // Route params
  const { subject, lessonId, levelId ,stageId,gamemodeId } = useParams();

  // Popups
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showCodeWhisper, setShowCodeWhisper] = useState(false);

const [stageCon, setStageCon] = useState("");

  useEffect(()=>{
    if (gamemodeId =="Lesson"){
      setStageCon(stageId);
    }
  },[gamemodeId])

  // Dynamically render editor based on subject
  const renderEditor = () => {
    switch (subject) {
      case "Html":
        return <Html_TE submitAttempt={submitAttempt} />;
      case "Css":
        return <Css_TE submitAttempt={submitAttempt}/>;
      case "JavaScript":
        return <JavaScript_TE submitAttempt={submitAttempt}/>;
      case "Database":
        return <Database_TE submitAttempt={submitAttempt}/>;
      default:
        return <div className="text-white">Invalid or missing subject.</div>;
    }
  };

  return (
    <>
      <div key={roundKey} className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
        <GameHeader heart={heart} />

        {/* Content */}
        <div className="h-[83%] flex flex-col md:flex-row p-10 gap-5">
          {/* Instruction Panel */}
          <div className="h-[40%] md:w-[35%] md:h-full w-full">
            <InstructionPanel
              showCodeWhisper={showCodeWhisper}
              setShowCodeWhisper={setShowCodeWhisper}
            />
          </div>

          {/* Code Editor */}
          <div className="h-[60%] md:w-[80%] md:h-full w-full flex">
            {renderEditor()}
          </div>
        </div>

        {/* Footer */}
        <GameFooter
          setLevelComplete={setLevelComplete}
          setShowCodeWhisper={setShowCodeWhisper}
        />
      </div>

      {/* Instruction PopUp */}
      <AnimatePresence>
        {showPopup && (
          <GameMode_Instruction_PopUp
            title="Hey Dev!!"
            message={`Welcome to ${type} — a creative challenge where you’ll craft code to build something amazing!
Your mission:
🧩 Understand the task  
💻 Write your code  
🚀 See your creation come to life!`}
            onClose={() => setShowPopup(false)}
            buttonText="Start Challenge"
          />
        )}
      </AnimatePresence>

      {/* Level Complete PopUp */}
      <AnimatePresence>
        {levelComplete && (
          <LevelCompleted_PopUp
            subj={subject}
            lessonId={lessonId}
            LevelId={levelId}
            heartsRemaining={heart}
            setLevelComplete={setLevelComplete}
          />
        )}
      </AnimatePresence>

      {/**/}
      <AnimatePresence>
        {gameOver &&(
          <Gameover_PopUp gameOver={gameOver} resetHearts={resetHearts} stageCon={stageCon}></Gameover_PopUp>
        )}
      </AnimatePresence>
    </>
  );
}

export default CodeCrafter;
