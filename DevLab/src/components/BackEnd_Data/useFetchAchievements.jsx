import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../../Firebase/Firebase";

export default function useFetchAchievements(category) {
  const fetchAchievements = async () => {
    if (!category) return [];

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const token = await currentUser.getIdToken(true);

    const { data } = await axios.get(
      `https://api-soyulx5clq-uc.a.run.app/fireBase/achievements/${category}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Convert object from backend into array and sort by 'order' if exists
    return Object.keys(data || {})
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["achievementsData", category],
    queryFn: fetchAchievements,
    enabled: !!category,
  });

  return { achievements: data, isLoading, isError, refetch };
}
