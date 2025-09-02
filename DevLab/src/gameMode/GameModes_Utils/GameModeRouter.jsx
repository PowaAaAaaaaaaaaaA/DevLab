import { useParams, useNavigate } from "react-router-dom";
import CodeRush from "../CodeRush";
import BrainBytes from "../BrainBytes";
import LessonPage from "../../Lessons/LessonPage";
import BugBust from "../BugBust";
import CodeCrafter from "../CodeCrafter";
import { useEffect, useState } from "react";
import useAttemptCounter from "./AttemptCounter";

import Gameover_PopUp from "../GameModes_Popups/Gameover_PopUp";

const GameModeRouter = () => {
  const { subject, lessonId, levelId, stageId, gamemodeId } = useParams();

  const [stageCon, setStageCon] = useState("");
  const [back, setBack] = useState(null);

  const navigate = useNavigate();

  const { heart, roundKey, gameOver, submitAttempt, resetHearts } = useAttemptCounter(3);

  // Update stageCon if the gamemode is Lesson
  useEffect(() => {
    if (gamemodeId === "Lesson") {
      setStageCon(stageId);
    }
  }, [gamemodeId, stageId]);

  // When game over, prepare the back route
  useEffect(() => {
    if (gameOver) {
      setBack(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${stageCon}/Lesson`);
    }
  }, [gameOver, subject, lessonId, levelId, stageCon]);

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
        />
      )}
    </>
  );
};

export default GameModeRouter;
