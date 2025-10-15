import { useParams, useNavigate } from "react-router-dom";
import CodeRush from "../CodeRush";
import BrainBytes from "../BrainBytes";
import LessonPage from "../../Lessons/LessonPage";
import BugBust from "../BugBust";
import CodeCrafter from "../CodeCrafter";
import { useEffect, useState } from "react";
import { useAttemptStore } from "../GameModes_Utils/useAttemptStore"
import Gameover_PopUp from "../GameModes_Popups/Gameover_PopUp";

const GameModeRouter = () => {
  const { subject, lessonId, levelId, stageId, gamemodeId } = useParams();
  const [back, setBack] = useState(null);

  const {heart,roundKey,gameOver,submitAttempt,resetHearts,loadHearts, } = useAttemptStore();

  // Load hearts from Firestore when component mounts
  useEffect(() => {
    let unsub;
    (async () => {
      unsub = await loadHearts(); // start listening to Firestore
    })();
    return () => {
      if (unsub) unsub();
    };
  }, [loadHearts]);

  // Prepare back route when game over
  useEffect(() => {
    if (gameOver) {
      setBack(`/Main/Lessons/${subject}/${lessonId}/${levelId}/Stage1/Lesson`);
    }
  }, [gameOver, subject, lessonId, levelId]);

  const props = { heart, roundKey, gameOver, submitAttempt, resetHearts };

  const components = {
    CodeRush: <CodeRush {...props} />,
    BrainBytes: <BrainBytes {...props} />,
    BugBust: <BugBust {...props} />,
    Lesson: <LessonPage />,
    CodeCrafter: <CodeCrafter {...props} />,
  };

  return (
    <>
      {components[gamemodeId] || <div>Game Mode Not Found</div>}
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
