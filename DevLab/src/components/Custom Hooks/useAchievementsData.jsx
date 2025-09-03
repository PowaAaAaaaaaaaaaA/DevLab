import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

export default function useAchievementsData(subject) {
  const fetchData = async () => {
    const achievementsRef = doc(db, "Achievements", subject);
    const snapshot = await getDoc(achievementsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.data();
    const achievements = [];

    // Loop through each map field
    Object.keys(data).forEach((key) => {
      achievements.push({
        id: key,
        ...data[key],
      });
    });
    achievements.sort((a, b) => a.order - b.order);

    return achievements;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["achievements_data", subject],
    queryFn: fetchData,
  });

  return { data, isLoading };
}
