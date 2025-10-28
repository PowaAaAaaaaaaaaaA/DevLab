import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/Firebase";
import { doc, onSnapshot } from "firebase/firestore";

import Lottie from "lottie-react";
import loadingDots from "../../assets/Lottie/LoadingDots.json"


// Game Modes
import CodeRush from "../CodeRush";
import BrainBytes from "../BrainBytes";
import LessonPage from "../../Lessons/LessonPage";
import BugBust from "../BugBust";
import CodeCrafter from "../CodeCrafter";
import Gameover_PopUp from "../GameModes_Popups/Gameover_PopUp";

// Store
import { useAttemptStore } from "../GameModes_Utils/useAttemptStore";

const GameModeRouter = () => {
  const { subject, lessonId, levelId, stageId, gamemodeId } = useParams();
  const navigate = useNavigate();

  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [back, setBack] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { heart, roundKey, gameOver, submitAttempt, resetHearts, loadHearts } =
    useAttemptStore();

  //  Load hearts when the component mounts
  useEffect(() => {
    loadHearts();
  }, [loadHearts]);

  //  Set back route when game is over
  useEffect(() => {
    if (gameOver) {
      setBack(`/Main/Lessons/${subject}/${lessonId}/${levelId}/Stage1/Lesson`);
    }
  }, [gameOver, subject, lessonId, levelId]);

useEffect(() => {
  const user = auth.currentUser;
  if (!user) {
    navigate("/Login");
    return;
  }

  //  Real-time stage reference
  const stageRef = doc(
    db,
    "Users",
    user.uid,
    "Progress",
    subject,
    "Lessons",
    lessonId,
    "Levels",
    levelId,
    "Stages",
    stageId
  );

  //  Listen for live updates
  const unsubscribe = onSnapshot(
    stageRef,
    (stageSnap) => {
      if (!stageSnap.exists()) {
        setIsAllowed(false);
        setErrorMessage("This stage does not exist or has not been unlocked yet.");
        setChecking(false);
        return;
      }

      const data = stageSnap.data();

      if (data.isActive === true || data.isCompleted === true) {
        setIsAllowed(true);
        setErrorMessage("");
      } else {
        setIsAllowed(false);
        setErrorMessage("This stage is locked. Complete the previous stage to unlock it.");
      }

      setChecking(false);
    },
    (error) => {
      console.error("Realtime listener error:", error);
      setErrorMessage("Error checking access. Please try again later.");
      setChecking(false);
    }
  );

  //  Clean up listener when unmounting or params change
  return () => unsubscribe();
}, [subject, lessonId, levelId, stageId, navigate]);



  console.log(isAllowed);

  //  Props for all game components
  const props = { heart, roundKey, gameOver, submitAttempt, resetHearts };

  //  Available Game Modes
  const components = {
    CodeRush: <CodeRush {...props} />,
    BrainBytes: <BrainBytes {...props} />,
    BugBust: <BugBust {...props} />,
    Lesson: <LessonPage />,
    CodeCrafter: <CodeCrafter {...props} />,
  };

  //  While checking
  if (checking)
    return (
  <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
    <Lottie animationData={loadingDots} loop className="w-[50%] h-[50%]" />
  </div>
    );

  //  If not allowed
  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-3xl font-bold mb-4">🔒 Access Denied</h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  //  If allowed, render the correct game mode
  return (
    <>
      {components[gamemodeId] || (
        <div className="flex items-center justify-center min-h-screen text-lg">
          Game Mode Not Found
        </div>
      )}

      {gameOver && (
        <Gameover_PopUp
          gameOver={gameOver}
          resetHearts={resetHearts}
          Back={back}
          subject={subject}
          lessonId={lessonId}
          levelId={levelId}
          stageId={stageId}
        />
      )}
    </>
  );
};

export default GameModeRouter;
