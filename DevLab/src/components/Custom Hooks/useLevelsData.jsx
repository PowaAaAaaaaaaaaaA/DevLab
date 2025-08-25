// Hook for FetchingLevels
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

export default function useLevelsData(subject) {
  const fetchData = async () => {
    const lessonsRef = collection(db, subject);
    const lessonSnapshot = await getDocs(lessonsRef);

    const lessons = await Promise.all(
      lessonSnapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, subject, lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);

        const levels = await Promise.all(
          levelsSnapshot.docs.map(async (levelDoc) => {
            const stagesRef = collection(db,subject,lessonDoc.id,"Levels",levelDoc.id,"Stages");
            const stagesSnapshot = await getDocs(stagesRef);

            const stages = stagesSnapshot.docs.map((stageDoc) => ({
              id: stageDoc.id,
              ...stageDoc.data(),
            }));

            return {
              id: levelDoc.id,
              ...levelDoc.data(),
              stages,
            };
          })
        );

        return {
          id: lessonDoc.id,
          ...lessonDoc.data(),
          levels,
        };
      })
    );

    return lessons;
  };

  const { data: levelsData, isLoading } = useQuery({
    queryKey: ["lesson_data", subject],
    queryFn: fetchData,
  });

  return {levelsData, isLoading };
}
