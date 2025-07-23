import { useState } from 'react';

const useAttemptCounter = (initialHearts) => {
  const [heart, setHearts] = useState(initialHearts);
  const [roundKey, setRoundKey] = useState(0);

  const gameOver = heart <= 0;

  const submitAttempt = (isCorrect) => {
    if (isCorrect || gameOver) return;

    const remaining = heart - 1;
    setHearts(remaining);

    if (remaining > 0) {
      setRoundKey(prev => prev + 1); // restart current game mode
    }
    // if remaining === 0, game over triggers automatically
  };  const resetHearts = () => {
    setHearts(initialHearts);
    setRoundKey(prev => prev + 1); // Optional rerender trigger
  };

  return {heart,roundKey,gameOver,submitAttempt,resetHearts};
};

export default useAttemptCounter;
