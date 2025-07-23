import { useParams ,useNavigate} from "react-router-dom";
import CodeRush from "../gameMode/CodeRush";
import BrainBytes from "../gameMode/BrainBytes";
import LessonPage from "../Lessons/LessonPage";
import BugBust from "../gameMode/BugBust";
import CodeCrafter from "./CodeCrafter";
import { useEffect } from "react";
import useAttemptCounter from "../gameMode/AttemptCounter";

const GameModeRouter = () => {



  const { subject,lessonId,levelId,topicId,gamemodeId } = useParams();
    const navigate = useNavigate(); 

  const { heart, roundKey, gameOver, submitAttempt,resetHearts} = useAttemptCounter(3);
  // If no Life na balik sa Lesson ng TOpic:Id
useEffect(() => {
  if (gameOver) {
    resetHearts();
    navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${topicId}/Lesson`);
    
  }
}, [gameOver,subject,lessonId,levelId,topicId]);



  const props = {heart,roundKey,gameOver,submitAttempt};


  const components = {
    CodeRush: <CodeRush key={roundKey} {...props} />,
    BrainBytes: <BrainBytes key={roundKey} {...props} />,
    BugBust: <BugBust key={roundKey} {...props} />,
    Lesson: <LessonPage />,
    CodeCrafter: <CodeCrafter key={roundKey} {...props} />,
  };

  return components[gamemodeId] || <div>Game Mode Not Found</div>;
};

export default GameModeRouter;
