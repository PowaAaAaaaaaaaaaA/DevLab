import { useCallback, useState } from "react";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../Firebase/Firebase";
import useActiveBuffs from "../components/Custom Hooks/useActiveBuffs";

export const useErrorShield = () => {
  const { activeBuffs } = useActiveBuffs();
  const [consuming, setConsuming] = useState(false);

  const hasShield = activeBuffs.includes("errorShield");

  // returns true if the shield was consumed for this attempt
  const consumeErrorShield = useCallback(async () => {
    if (!hasShield || consuming) return false;

    setConsuming(true);// prevent double-consume in same tick
    try {
      const userRef = doc(db, "Users", auth.currentUser.uid);
      await updateDoc(userRef, { activeBuffs: arrayRemove("errorShield") });
      return true;
    } finally {
      setConsuming(false);
    }
  }, [hasShield, consuming]);

  return { hasShield, consumeErrorShield };
};
