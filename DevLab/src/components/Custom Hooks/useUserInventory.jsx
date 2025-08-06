import { db, auth } from "../../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

export default function useUserInventory() {
  const fetchInventory = async () => {
    try {
      const userId = auth.currentUser.uid;
      const inventoryRef = collection(db, "Users", userId, "Inventory");
      const snapshot = await getDocs(inventoryRef);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: inventory, isLoading: loading } = useQuery({
    queryKey: ["User_Inventory"],
    queryFn: fetchInventory,
  });

  return { inventory, loading };
}
