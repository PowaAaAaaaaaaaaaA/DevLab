import { auth} from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

const useFetchShopItems = () => {
  const { data: shopItems = [] } = useQuery({
    queryKey: ["ShopItems"],
    queryFn: async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }
      const token = await currentUser?.getIdToken(true);
      try {
        const res = await fetch('http://localhost:8082/fireBase/Shop' ,{
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          console.log(
            "Something went wrong when fetching shop items..." + res.status
          );
          return [];
        }

        const data = await res.json();
        console.log(data);
        return data ?? [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  return { shopItems };
};

export default useFetchShopItems;
