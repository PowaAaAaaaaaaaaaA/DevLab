import { auth } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

export default function useFetchUserProgress(subject) {
  const fetchProgress = async () => {
    if (!subject) return null;

    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const token = await currentUser.getIdToken(true);

    const res = await fetch(`http://localhost:8082/fireBase/userProgres/${subject}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Failed to fetch user progress", res.status);
      return null;
    }
    return res.json();
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userProgress_data", subject],
    queryFn: fetchProgress,
    enabled: !!subject, // only run when subject is provided
  });
  return {
    userProgress: data?.allProgress || {},
    userStageProgress: data?.allStages || {},
    completedLevels: data?.completedLevels || 0,
    completedStages: data?.completedStages || 0,
    isLoading,
    isError,
    refetch,
  };
}
