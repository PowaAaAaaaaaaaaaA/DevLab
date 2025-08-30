import { useParams ,useNavigate} from "react-router-dom";
import CodeRush from "../CodeRush";
import BrainBytes from "../BrainBytes";
import LessonPage from "../../Lessons/LessonPage";
import BugBust from "../BugBust";
import CodeCrafter from "../CodeCrafter";
import { useEffect, useState } from "react";
import useAttemptCounter from "./AttemptCounter";

import Gameover_PopUp from "../GameModes_Popups/Gameover_PopUp";

const GameModeRouter = () => {



  const [stageCon, setStageCon] = useState("");

  const { subject,lessonId,levelId,stageId,gamemodeId } = useParams();
  const navigate = useNavigate(); 


console.log(stageCon)
  const { heart, roundKey, gameOver, submitAttempt,resetHearts} = useAttemptCounter(3);
  // If no Life na balik sa Lesson ng TOpic:Id
useEffect(() => {
  if (gamemodeId == "Lesson"){
    setStageCon(stageId)
  }
  if (gameOver) {
    resetHearts();
    navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${stageCon}/Lesson`);
    
  }
}, [gameOver,subject,lessonId,levelId,stageId]);



  const props = {heart,roundKey,gameOver,submitAttempt};


  const components = {
    CodeRush: <CodeRush  {...props} />,
    BrainBytes: <BrainBytes {...props} />,
    BugBust: <BugBust  {...props} />,
    Lesson: <LessonPage />,
    CodeCrafter: <CodeCrafter  {...props} />,
  };

  return components[gamemodeId] || <div>Game Mode Not Found</div>;
};

export default GameModeRouter;
