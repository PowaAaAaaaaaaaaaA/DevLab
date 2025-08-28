import { useState } from "react";
import { useErrorShield } from "../../ItemsLogics/ErrorShield";

const useAttemptCounter = (initialHearts) => {
  const [heart, setHearts] = useState(initialHearts);
  const [roundKey, setRoundKey] = useState(0);
  const { hasShield, consumeErrorShield } = useErrorShield();

  const gameOver = heart <= 0;

  const submitAttempt = async (isCorrect) => {
    if (isCorrect || gameOver) return;

    if (hasShield) {
      const used = await consumeErrorShield();
      if (used) {
        // skip heart loss, but still restart round if you want
        setRoundKey((prev) => prev + 1);
        return;
      }
    }

    const remaining = heart - 1;
    setHearts(remaining);
    if (remaining > 0) setRoundKey((prev) => prev + 1);
  };

  const resetHearts = () => {
    setHearts(initialHearts);
    setRoundKey((prev) => prev + 1);
  };

  return { heart, roundKey, gameOver, submitAttempt, resetHearts };
};

export default useAttemptCounter;
