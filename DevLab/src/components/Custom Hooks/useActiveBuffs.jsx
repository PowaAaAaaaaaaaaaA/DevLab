import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/Firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function useActiveBuffs() {
  const [activeBuffs, setActiveBuffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "Users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setActiveBuffs(snap.data()?.activeBuffs || []);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { activeBuffs, loading };
}
