

import { unlockStage } from "../../components/BackEnd_Functions/unlockStage";
import { unlockAchievement } from "../../components/Custom Hooks/UnlockAchievement";



export const goToNextStage = async ({subject,lessonId,levelId,stageId,navigate,setLevelComplete, userId}) => {

  try {
    const data = await unlockStage(subject, lessonId, levelId, stageId);
    console.log("Unlock response:", data);
    console.log("Unlock response:", data.nextStageType);



    if (data.isNextStageUnlocked) {
      navigate(
        `/Main/Lessons/${subject}/${lessonId}/${levelId}/${data.nextStageId}/${data.nextStageType}`
      );
    } else if (data.isNextLevelUnlocked) {
      setLevelComplete(true);
    }  else if (data.isNextLessonUnlocked) {
      await unlockAchievement(userId, subject, "lessonComplete", { lessonId });
      setLevelComplete(true);
    } else if (data.isWholeTopicFinished){
      setLevelComplete(true);
    }
  } catch (error) {
    console.error("Error in goToNextStage:", error.message);
  }
};
