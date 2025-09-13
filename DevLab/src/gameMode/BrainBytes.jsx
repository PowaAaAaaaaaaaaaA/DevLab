// Utils / Custom Hooks
import { useState } from "react";
// Navigation
import { useParams } from "react-router-dom";
// Pop Ups
import GameMode_Instruction_PopUp from "./GameModes_Popups/GameMode_Instruction_PopUp";
import LevelCompleted_PopUp from "./GameModes_Popups/LevelCompleted_PopUp";
// Animation
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import Correct from '../assets/Lottie/correctAnsLottie.json';
import Wrong from '../assets/Lottie/wrongAnsLottie.json';
// Components
import GameHeader from "./GameModes_Components/GameHeader";
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "./GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "./GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "./GameModes_Components/CodeEditor and Output Panel/Database_TE";
import GameFooter from "./GameModes_Components/GameFooter";

function BrainBytes({ heart, gameOver, submitAttempt, roundKey }) {
  const type = "Brain Bytes";

  // Route params
  const { subject, lessonId, levelId, gamemodeId, topicId } = useParams();

  // Popups
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showCodeWhisper, setShowCodeWhisper] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showisCorrect, setShowisCorrect] = useState(false);

  // Dynamic editor rendering
  const renderEditor = () => {
    switch (subject) {
      case "Html":
        return <Html_TE/>;
      case "Css":
        return <Css_TE/>;
      case "JavaScript":
        return <JavaScript_TE/>;
      case "Database":
        return <Database_TE/>;
      default:
        return <div className="text-white">Invalid subject</div>;
    }
  };

  return (
    <>
      {/* Main Content */}
      <div key={roundKey} className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
        <GameHeader heart={heart} />

        {/* Content */}
        <div className="h-[83%] flex flex-col md:flex-row p-10 gap-5">
          {/* Instruction Panel */}
          <div className="h-[40%] md:w-[35%] md:h-full w-full">
            <InstructionPanel
              setIsCorrect={setIsCorrect} 
              setShowisCorrect={setShowisCorrect}
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
          isCorrect={isCorrect}
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

      {/* Level Complete Pop Up */}
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
      {/* Correct / Wrong Answer PopUps */}
      {showisCorrect && (
        <AnimatePresence>
          {isCorrect ? (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-[80%] max-w-md text-center flex flex-col items-center gap-4"> 
                <Lottie animationData={Correct} loop={false} className="w-[70%] h-[70%]"/>
                <h1 className="font-exo font-bold text-black text-3xl">Correct Answer</h1>
                <motion.button
                  onClick={()=>{setShowisCorrect(false)}}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ bounceDamping: 100 }}
                  className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
                  Continue
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-[80%] max-w-md text-center flex flex-col items-center gap-4"> 
                <Lottie animationData={Wrong} loop={false} className="w-[100%] h-[100%]"/>
                <h1 className="font-exo font-bold text-black text-3xl">Wrong Answer</h1> 
                <motion.button
                  onClick={()=>{
                    submitAttempt(false)
                    setShowisCorrect(false)}}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ bounceDamping: 100 }}
                  className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
                  Retry
                </motion.button>
              </div>
            </div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default BrainBytes;
