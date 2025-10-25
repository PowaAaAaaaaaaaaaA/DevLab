// Utils / Custom Hooks
import { useState, useEffect } from "react";
// Navigation
import { useParams } from "react-router-dom";
import { goToNextStage } from "./GameModes_Utils/Util_Navigation";
import { useNavigate } from "react-router-dom";
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
import Gameover_PopUp from "./GameModes_Popups/Gameover_PopUp";
import GameFooter from "./GameModes_Components/GameFooter";

import { useErrorShield } from "../ItemsLogics/ErrorShield";

import useFetchUserData from "../components/BackEnd_Data/useFetchUserData";

function BrainBytes({ heart, roundKey, gameOver, submitAttempt, resetHearts }) {
  const type = "Brain Bytes";
  const { hasShield, consumeErrorShield } = useErrorShield();
  const navigate = useNavigate();
  // Route params
  const { subject, lessonId, levelId ,stageId,gamemodeId } = useParams();

  // Popups
  const [isNavigating, setIsNavigating] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showCodeWhisper, setShowCodeWhisper] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showisCorrect, setShowisCorrect] = useState(false);

  const { userData, } = useFetchUserData();
  const userId = userData?.uid;
  // Dynamic editor rendering


  return (
    <>
      {/* Main Content */}
      <div key={roundKey} className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
        <GameHeader heart={heart} />

        {/* Content */}
        <div className="h-[83%] flex flex-col md:flex-row p-10 gap-5 justify-center">
          {/* Instruction Panel */}
          <div className="h-[40%] md:w-[40%] md:h-full w-full">
            <InstructionPanel
              setIsCorrect={setIsCorrect} 
              setShowisCorrect={setShowisCorrect}
              showCodeWhisper={showCodeWhisper}
              setShowCodeWhisper={setShowCodeWhisper}
            />
          </div>
        </div>
        {/* Footer */}
        <GameFooter
          setLevelComplete={setLevelComplete}
          setShowCodeWhisper={setShowCodeWhisper}
          isCorrect={isCorrect}
        />
      </div>
      {/*Game Over Popup*/ }
      <AnimatePresence>
        {gameOver &&(
          <Gameover_PopUp gameOver={gameOver} resetHearts={resetHearts}></Gameover_PopUp>
        )}
      </AnimatePresence>
      {/* Instruction Pop Up */}
      <AnimatePresence>
        {showPopup && (
          <GameMode_Instruction_PopUp
            title="Hey Dev!!"
            message={`Welcome to ${type} — a test of your logic and knowledge!
Your mission:
🧠 Read the question carefully
💡 Choose or write the correct answer
🏆 Prove your coding smarts and earn your reward!`}
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
            resetHearts={resetHearts}
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
  disabled={isNavigating}
  onClick={async () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setShowisCorrect(false);
    await goToNextStage({ subject, lessonId, levelId, stageId, navigate, setLevelComplete, userId });
    setIsNavigating(false);
  }}
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
  className={`bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold 
    ${isNavigating ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer"}
  `}
>
  {isNavigating ? "Loading..." : "Continue"}
</motion.button>

              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-[80%] max-w-md text-center flex flex-col items-center gap-4"> 
                <Lottie animationData={Wrong} loop={false} className="w-[100%] h-[100%]"/>
                <h1 className="font-exo font-bold text-black text-3xl">Wrong Answer</h1> 
                <motion.button
        onClick={async () => {
          setShowisCorrect(false);
          //  Check for Error Shield first
          if (await consumeErrorShield()) {
            console.log("ErrorShield consumed! Preventing heart loss.");
            return; // Do NOT call submitAttempt(false)
          }
          submitAttempt(false);
        }}
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
