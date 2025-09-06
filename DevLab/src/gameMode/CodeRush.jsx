// React
import { useState, useEffect } from "react";
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
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "./GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "./GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "./GameModes_Components/CodeEditor and Output Panel/Database_TE";
import GameFooter from "./GameModes_Components/GameFooter";

function CodeRush({ heart, roundKey, gameOver, submitAttempt,resetHearts }) {
  const type = "Code Rush";

  // Route params
  const { subject, lessonId, levelId ,stageId,gamemodeId } = useParams();

  // Popups
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showCodeWhisper, setShowCodeWhisper] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
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
        return <div className="text-white">Invalid subject</div>;
    }
  };

  return (
    <>
      <div key={roundKey} className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
        <GameHeader heart={heart} />

        {/* Content */}
        <div className="h-[83%] flex flex-col md:flex-row p-10 gap-5">
          {/* Instruction */}
          <div className="h-[40%] md:w-[35%] md:h-full w-full">
            <InstructionPanel
              submitAttempt={submitAttempt}
              showPopup = {showPopup}
              showCodeWhisper={showCodeWhisper}
              setShowCodeWhisper={setShowCodeWhisper}
              setTimesUp = {setTimesUp}
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

      {/* Instruction Pop Up */}
      <AnimatePresence>
        {showPopup && (
          <GameMode_Instruction_PopUp
            title="Hey Dev!!"
            message={`Welcome to ${type} — a fast-paced challenge where you’ll write and run code before time runs out!
Your mission:
🧩 Read the task  
💻 Write your code  
🚀 Run it before the timer hits zero!`}
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
            {/* Times Up PopUp */}
      <AnimatePresence>
        {timesUp && (
<GameMode_Instruction_PopUp
  title="Time’s Up!"
  message="⏳ You ran out of time! Be quicker next round."
  onClose={() => {
    setTimesUp(false);      // close popup
    submitAttempt(false);   // THEN lose HP
  }}
  buttonText="Continue"/>
        )}
      </AnimatePresence>
      {/*Game Over PopUp*/}
            <AnimatePresence>
        {gameOver &&(
          <Gameover_PopUp gameOver={gameOver} resetHearts={resetHearts} stageCon={stageCon}></Gameover_PopUp>
        )}
      </AnimatePresence>
    </>
  );
}

export default CodeRush;
