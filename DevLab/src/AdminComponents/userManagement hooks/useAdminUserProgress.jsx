import { db } from "../../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";

import { useQuery } from "@tanstack/react-query";
import useFetchLevelsData from "../../components/BackEnd_Data/useFetchLevelsData";

export default function useAdminUserProgress(subject, userId) {
  const { levelsData, isLoading: levelsLoading, } = useFetchLevelsData(subject);

  const fetchAdminProgress = async () => {
    if (!userId || !levelsData) {
      return { allProgress: {}, allStages: {}, completedLevels: 0, completedStages: 0 };
    }

    const allProgress = {}; // stores level completion
    const allStages = {};   // stores stage completion
    let completedLevels = 0;
    let completedStages = 0;

    for (const lesson of levelsData) {
      const lessonId = lesson.id;

      // Levels under a lesson
      const levelsRef = collection(db, "Users", userId, "Progress", subject, "Lessons", lessonId, "Levels");
      const levelsSnap = await getDocs(levelsRef);

      for (const levelDoc of levelsSnap.docs) {
        const levelId = levelDoc.id;
        const status = levelDoc.data().isCompleted;
        allProgress[`${lessonId}-${levelId}`] = status;

        if (status === true) completedLevels += 1;

        // Stages under a level
        const stagesRef = collection(db, "Users", userId, "Progress", subject, "Lessons", lessonId, "Levels", levelId, "Stages");
        const stagesSnap = await getDocs(stagesRef);

        stagesSnap.forEach((stageDoc) => {
          const stageStatus = stageDoc.data().isCompleted;
          allStages[`${lessonId}-${levelId}-${stageDoc.id}`] = stageStatus;

          if (stageStatus === true) completedStages += 1;
        });
      }
    }

    return { allProgress, allStages, completedLevels, completedStages };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminUserProgress", subject, userId, levelsData],
    queryFn: fetchAdminProgress,
    enabled: !!userId && !!levelsData, // Only run if userId and levelsData are ready
  });

  return {
    userProgress: data?.allProgress || {},
    userStageProgress: data?.allStages || {},
    completedLevels: data?.completedLevels || 0,
    completedStages: data?.completedStages || 0,
    isLoading: isLoading || levelsLoading,
  };
}
