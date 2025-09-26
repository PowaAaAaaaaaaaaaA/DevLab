import { auth } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

const useFetchUserData = () => {
  const {data: userData,refetch,isLoading,isError,} = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken(true);
      const uid = currentUser.uid;

        const res = await fetch(`http://localhost:8082/fireBase/getSpecificUser/${uid}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error(`Failed to fetch user: ${res.status}`);
        return null;
      }
      const data = await res.json();
      return { ...data, uid };
    },
  });
  return { userData, refetch, isLoading, isError };
};
export default useFetchUserData;
