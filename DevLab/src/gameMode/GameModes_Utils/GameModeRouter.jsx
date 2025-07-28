import { useParams ,useNavigate} from "react-router-dom";
import CodeRush from "../CodeRush";
import BrainBytes from "../BrainBytes";
import LessonPage from "../../Lessons/LessonPage";
import BugBust from "../BugBust";
import CodeCrafter from "../CodeCrafter";
import { useEffect } from "react";
import useAttemptCounter from "./AttemptCounter";

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
    CodeRush: <CodeRush  {...props} />,
    BrainBytes: <BrainBytes {...props} />,
    BugBust: <BugBust  {...props} />,
    Lesson: <LessonPage />,
    CodeCrafter: <CodeCrafter  {...props} />,
  };

  return components[gamemodeId] || <div>Game Mode Not Found</div>;
};

export default GameModeRouter;
