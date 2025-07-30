// Utils / Custom Hooks
import { useState } from "react";

// Navigation (React Router)
import { useParams} from "react-router-dom";
// PopUps
import GameMode_Instruction_PopUp from "./GameModes_Popups/GameMode_Instruction_PopUp";
import LevelCompleted_PopUp from "./GameModes_Popups/LevelCompleted_PopUp";
// for Animation / Icons
import { AnimatePresence } from "framer-motion";
// Components
import GameHeader from "./GameModes_Components/GameHeader";
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Database_TE from "./GameModes_Components/CodeEditor and Output Panel/Database_TE";
import GameFooter from "./GameModes_Components/GameFooter";


function BugBust({heart,gameOver,submitAttempt,roundKey}) {
  const type = "Bug Bust";
  // Navigate
  const { subject, lessonId, levelId, gamemodeId, topicId } = useParams();

  //Pop up
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);





  return subject !== "Database" ? (
  <>
    <div 
      key={roundKey}
      className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
      <GameHeader heart={heart} /> 
        {/* Content */}
        <div className="h-[83%] flex justify-around items-center p-4">
        {/* Instruction */}
      <InstructionPanel/>
        {/* Code Editor */}
          {subject === "Html" && ( <Html_TE submitAttempt={submitAttempt}/>)}
          {subject === "Css" && ( <Css_TE/>)} 
        </div>
        {/* Footer */}
      <GameFooter setLevelComplete={setLevelComplete}/>
    </div>
{/*Instruction Pop Up (1st Pop Up)*/}
      <AnimatePresence>
        {showPopup ? (
          <GameMode_Instruction_PopUp
            title="Hey Dev!!"
            message={`Welcome to ${type} — a fast-paced challenge where you’ll write and run code before time runs out! . 
                Your mission:  
                🧩 Read the task  
                💻 Write your code  
                🚀 Run it before the timer hits zero!`}
            onClose={() => setShowPopup(false)}
            buttonText="Start Challenge"/>) : null}
      </AnimatePresence>
{/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <LevelCompleted_PopUp
          heartsRemaining={heart}
          setLevelComplete={setLevelComplete}/>)}  
      </AnimatePresence>
      {/*GameOver PopUp (this popup when Life = 0)*/}
      <AnimatePresence>

      </AnimatePresence>
  </>
    
) : 
    /*DATABASE TAB*/
      /*DATABASE TAB*/
        /*DATABASE TAB*/
          /*DATABASE TAB*/
            /*DATABASE TAB*/
(
    <>
      <div className="h-screen bg-[#0D1117] flex flex-col">
        {/*Header*/}
          <GameHeader heart={heart} />
        {/*Contents*/}
        <div className="h-[83%] flex justify-around items-center p-4">
          {/*Instruction*/}
            <InstructionPanel/>
          {/*Coding Panel*/}
            <Database_TE/>
        </div>
        {/*Footer*/}
          <GameFooter setLevelComplete={setLevelComplete}/>
      </div>
{/*Instruction Pop Up (1st Pop Up)*/}
    <AnimatePresence>
      {showPopup && (
        <GameMode_Instruction_PopUp
          title="Hey Dev!!"
          message={`Welcome to ${type} — a fast-paced challenge where you’ll write and run code before time runs out! . 
    Your mission:  
🧩 Read the task  
💻 Write your code  
🚀 Run it before the timer hits zero!`}
          onClose={() => setShowPopup(false)}
          buttonText="Start Challenge"
        />
      )}
    </AnimatePresence>
{/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <LevelCompleted_PopUp
          heartsRemaining={heart}
          setLevelComplete={setLevelComplete}/>)}  
      </AnimatePresence>
    </>
  ); 
}

export default BugBust;
