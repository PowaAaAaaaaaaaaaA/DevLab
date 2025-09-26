import { auth } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

export default function useFetchLevelsData(subject) {
  const fetchData = async () => {
    if (!subject) return [];

    const currentUser = auth.currentUser;
    if (!currentUser) return [];

    const token = await currentUser.getIdToken(true);

    try {
      const res = await fetch(`http://localhost:8082/fireBase/getAllData/${subject}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch levels data", res.status);
        return [];
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching levels data:", error);
      return [];
    }
  };

  const {data: levelsData = [],isLoading,isError,refetch,} = useQuery({
    queryKey: ["lesson_data", subject],
    queryFn: fetchData,
    enabled: !!subject, // only fetch if subject is provided
  });

  return { levelsData, isLoading, isError, refetch };
}
