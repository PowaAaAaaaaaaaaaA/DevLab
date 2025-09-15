import { useCallback, useState } from "react";
import { useInventoryStore } from "./Items-Store/useInventoryStore";

export const useErrorShield = () => {
  const { removeBuff } = useInventoryStore.getState();
  const activeBuffs = useInventoryStore((state) => state.activeBuffs);
  const [consuming, setConsuming] = useState(false);

  const hasShield = activeBuffs.includes("errorShield");

  // returns true if the shield was consumed for this attempt
  const consumeErrorShield = useCallback(async () => {
    if (!hasShield || consuming) return false;

    setConsuming(true);// prevent double-consume in same tick
    try {
          removeBuff("errorShield");
          console.log("removing the area");
      return true;
    } finally {
      setConsuming(false);
    }
  }, [hasShield, consuming]);

  return { hasShield, consumeErrorShield };
};
