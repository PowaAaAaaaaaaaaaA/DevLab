import { db, auth } from "../../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import useLevelsData from "./useLevelsData";
import { useQuery } from "@tanstack/react-query";

export default function useUserProgress(subject) {
  const { data: levelsData, isLoading: levelsLoading } = useLevelsData(subject);

  const fetchProgress = async () => {
    const userId = auth.currentUser.uid;
    const allProgress = {};
    let count = 0;

    if (!levelsData) return { allProgress, count };

    for (const lesson of levelsData) {
      const lessonId = lesson.id;
      const progressRef = collection(db,"Users",userId,"Progress",subject,"Lessons",lessonId,"Levels");
      const progressSnap = await getDocs(progressRef);

      progressSnap.forEach((doc) => {
        const status = doc.data().status;
        allProgress[`${lessonId}-${doc.id}`] = status;
        if (status === true) count += 1;
      });
    }

    return { allProgress, count };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userProgress_data", subject, levelsData],
    queryFn: fetchProgress,
    enabled: !!levelsData, // waits for levelsData before running
  });

  return {
    userProgress: data?.allProgress || {},
    completedCount: data?.count || 0,
    isLoading: isLoading || levelsLoading,
  };
}
