import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase"; // adjust the path to your Firebase config

const useFetchUsers = async () => {
  try {
    const userRef = collection(db, "Users");
    const snapshot = await getDocs(userRef);

    const data = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

export default useFetchUsers;
