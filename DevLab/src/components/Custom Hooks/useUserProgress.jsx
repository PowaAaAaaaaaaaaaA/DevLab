import { db, auth } from "../../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import useLevelsData from "./useLevelsData";
import { useQuery } from "@tanstack/react-query";
import useFetchLevelsData from "../BackEnd_Data/useFetchLevelsData";


export default function useUserProgress(subject) {
  const { levelsData, isLoading:levelsLoading, isError, refetch } = useFetchLevelsData(subject);
  const fetchProgress = async () => {
    const userId = auth.currentUser.uid;
    const allProgress = {}; // stores level completion
    const allStages = {};   // stores stage completion
    let completedLevels = 0;
    let completedStages = 0;

    if (!levelsData) return { allProgress, allStages, completedLevels, completedStages };

    for (const lesson of levelsData) {
      const lessonId = lesson.id;
      const levelsRef = collection(db, "Users", userId, "Progress", subject, "Lessons", lessonId, "Levels");
      const levelsSnap = await getDocs(levelsRef); 

      for (const levelDoc of levelsSnap.docs) { 
        const levelId = levelDoc.id;
        const status = levelDoc.data().status;
        allProgress[`${lessonId}-${levelId}`] = status;

        if (status === true) completedLevels += 1;

        // Fetch Stages inside this Level
        const stagesRef = collection(db, "Users", userId, "Progress", subject, "Lessons", lessonId, "Levels", levelId, "Stages");
        const stagesSnap = await getDocs(stagesRef);

        stagesSnap.forEach((stageDoc) => {
          const stageStatus = stageDoc.data().status;
          allStages[`${lessonId}-${levelId}-${stageDoc.id}`] = stageStatus;
          if (stageStatus === true) completedStages += 1;
        });
      }
    }

    return { allProgress, allStages, completedLevels, completedStages };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userProgress_data", subject, levelsData],
    queryFn: fetchProgress,
    enabled: !!levelsData, // waits for levelsData before running
  });

  return {
    userProgress: data?.allProgress || {},   
    userStageProgress: data?.allStages || {},    
    completedLevels: data?.completedLevels || 0, 
    completedStages: data?.completedStages || 0, 
    isLoading: isLoading || levelsLoading,
  };
}
