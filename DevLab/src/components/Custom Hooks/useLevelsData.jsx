import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";


// Hook for FetchingLevels

export default function useLevelsData(subject) {
  const fetchData = async () => {
    const SubjectRef = collection(db, subject);
    const SubjectSnapshot = await getDocs(SubjectRef);

    const lessonData = await Promise.all(
      SubjectSnapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, subject, lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);

        const levels = await Promise.all(
          levelsSnapshot.docs.map(async (levelDoc) => {
            const topicsRef = collection(db,subject,lessonDoc.id,"Levels",levelDoc.id,"Topics");
            const topicsSnapshot = await getDocs(topicsRef);
            const topics = topicsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return {
              id: levelDoc.id,
              ...levelDoc.data(),
              topics,
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

    return lessonData;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["lesson_data", subject],
    queryFn: fetchData,
  });

  return { data, isLoading };
}
