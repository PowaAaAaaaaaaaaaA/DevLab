import { db } from "../../Firebase/Firebase";
import { doc, updateDoc } from "firebase/firestore";

const setSuspended = async (uid, isSuspended) => {
  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, {
    suspend: !isSuspended,
  });
};

export default setSuspended;