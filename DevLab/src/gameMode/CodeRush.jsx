// Utils / Custom Hooks
import { useState } from "react";

// Navigation
import { useParams} from "react-router-dom";
// PopUps
import GameMode_Instruction_PopUp from "./GameModes_Popups/GameMode_Instruction_PopUp";
import LevelCompleted_PopUp from "./GameModes_Popups/LevelCompleted_PopUp";
// for Animation / Icons

import { AnimatePresence } from "framer-motion";


// Components 
import GameHeader from "./GameModes_Components/GameHeader"
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE"
import Css_TE from "./GameModes_Components/CodeEditor and Output Panel/Css_TE"
import JavaScript_TE from "./GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "./GameModes_Components/CodeEditor and Output Panel/Database_TE";
import GameFooter from "./GameModes_Components/GameFooter";


function CodeRush({heart,roundKey,gameOver,submitAttempt}) {  
  const type = "Code Rush"

  // Navigate
  const { subject, lessonId, levelId, topicId, gamemodeId } = useParams();
  //Pop up
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showCodeWhisper, setShowCodeWhisper] = useState(false);



  return subject !== "Database" ? (
    <>
      <div key={roundKey} className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
        <GameHeader heart={heart}/>
        {/* Content */}
        <div className="h-[83%] flex justify-around items-center p-4">
          {/* Instruction */}
          <InstructionPanel submitAttempt={submitAttempt} showPopup={showPopup} showCodeWhisper={showCodeWhisper} setShowCodeWhisper={setShowCodeWhisper}/>
          {/* Code Editor */}
          {subject === "Html" && ( <Html_TE submitAttempt={submitAttempt}/>)}
          {subject === "Css" && ( <Css_TE/>)}
          {subject === "JavaScript" && ( <JavaScript_TE/>)} 
        </div>
        {/* Footer */}
          <GameFooter setLevelComplete={setLevelComplete} setShowCodeWhisper={setShowCodeWhisper}/>
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
          buttonText="Start Challenge"/>
      )}
    </AnimatePresence>
    {/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <LevelCompleted_PopUp
          subj = {subject}
          lessonId = {lessonId}
          LevelId= {levelId}
          heartsRemaining={heart}
          setLevelComplete={setLevelComplete}/>)}  
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
          <GameHeader heart={heart}/>
        {/*Contents*/}
        <div className="h-[83%] flex justify-around items-center p-4">
          {/*Instruction*/}
            <InstructionPanel submitAttempt={submitAttempt} showPopup={showPopup} showCodeWhisper={showCodeWhisper} setShowCodeWhisper={setShowCodeWhisper} />
          {/*Coding Panel*/}
            <Database_TE/>
        </div>
        {/*Footer*/}
          <GameFooter setLevelComplete={setLevelComplete} setShowCodeWhisper={setShowCodeWhisper}/>
      </div>
{/*Instruction Pop Up (1st Pop Up)*/}
    <AnimatePresence>
      {showPopup && (
        <GameMode_Instruction_PopUp
          title="Hey Dev!!"
          message={`Welcome to **CodeRush** — a fast-paced challenge where you’ll write and run code before time runs out! . 
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

export default CodeRush;
