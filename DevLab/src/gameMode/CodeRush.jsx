// React
import { useState, useEffect } from "react";
// Navigation (React Router)
import { useParams } from "react-router-dom";
// PopUps
import GameMode_Instruction_PopUp from "./GameModes_Popups/GameMode_Instruction_PopUp";
import LevelCompleted_PopUp from "./GameModes_Popups/LevelCompleted_PopUp";
import Gameover_PopUp from "./GameModes_Popups/Gameover_PopUp";
// for Animation / Icons
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import Correct from "../assets/Lottie/correctAnsLottie.json";
import Wrong from "../assets/Lottie/wrongAnsLottie.json";
// Components
import GameHeader from "./GameModes_Components/GameHeader";
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "./GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "./GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "./GameModes_Components/CodeEditor and Output Panel/Database_TE";
import GameFooter from "./GameModes_Components/GameFooter";

import { useErrorShield } from "../ItemsLogics/ErrorShield";

function CodeRush({ heart, roundKey, gameOver, submitAttempt, resetHearts }) {
  const type = "Code Rush";
  const { hasShield, consumeErrorShield } = useErrorShield();
  // Route params
  const { subject, lessonId, levelId, stageId, gamemodeId } = useParams();

  // Popups
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showCodeWhisper, setShowCodeWhisper] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
  const [stageCon, setStageCon] = useState("");
  const [isCorrect, setIsCorrect] = useState();
  const [showisCorrect, setShowisCorrect] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);

  useEffect(()=>{
    if(showisCorrect ||isCorrect ){
      setPauseTimer(true);
    }else{
      setPauseTimer(false);
    }
  },[showisCorrect]);
  useEffect(() => {
    if (gamemodeId === "Lesson") {
      setStageCon(stageId);
    }
  }, [gamemodeId, stageId]);

  // Dynamically render editor based on subject
  const renderEditor = () => {
    switch (subject) {
      case "Html":
        return <Html_TE  setIsCorrect={setIsCorrect} setShowisCorrect={setShowisCorrect}/>;
      case "Css":
        return <Css_TE setIsCorrect={setIsCorrect} setShowisCorrect={setShowisCorrect} />;
      case "JavaScript":
        return <JavaScript_TE setIsCorrect={setIsCorrect} setShowisCorrect={setShowisCorrect} />;
      case "Database":
        return <Database_TE setIsCorrect={setIsCorrect} setShowisCorrect={setShowisCorrect} />;
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
              showPopup={showPopup}
              showCodeWhisper={showCodeWhisper}
              setShowCodeWhisper={setShowCodeWhisper}
              setTimesUp={setTimesUp}
              pauseTimer={pauseTimer}
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

      {/* Instruction PopUp */}
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
            setLevelComplete={setLevelComplete}/>
        )}
      </AnimatePresence>

      {/* Times Up PopUp */}
      <AnimatePresence>
        {timesUp && (
          <GameMode_Instruction_PopUp
            title="Time’s Up!"
            message="⏳ You ran out of time! Be quicker next round."
            onClose={() => {
              setTimesUp(false); // close popup
              submitAttempt(false); // THEN lose HP
            }}
            buttonText="Continue"
          />
        )}
      </AnimatePresence>

      {/* Game Over PopUp */}
      <AnimatePresence>
        {gameOver && (
          <Gameover_PopUp
            gameOver={gameOver}
            resetHearts={resetHearts}
            stageCon={stageCon}/>
        )}
      </AnimatePresence>

      {/* Correct / Wrong Popup */}
      <AnimatePresence>
        {showisCorrect && (
        <AnimatePresence>
          {isCorrect ? (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-[80%] max-w-md text-center flex flex-col items-center gap-4"> 
              <Lottie
              animationData={Correct}
              loop={false}
              className="w-[70%] h-[70%]"/>
              <h1 className="font-exo font-bold text-black text-3xl">Correct Answer</h1>
        <motion.button
        onClick={()=>{
          submitAttempt(true)
          setShowisCorrect(false)}}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
          Continue
        </motion.button>
              </div>
            </div>
          ):(
            <AnimatePresence>
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-[80%] max-w-md text-center flex flex-col items-center gap-4"> 
              <Lottie
              animationData={Wrong}
              loop={false}
              className="w-[100%] h-[100%]"/>
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
          </AnimatePresence>
          )}
        </AnimatePresence>
        )}
      </AnimatePresence>
    </>
  );
}

export default CodeRush;
