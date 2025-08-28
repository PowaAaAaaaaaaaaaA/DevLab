import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ComputerPurple from "../assets/Lottie/Loading.json";
import SmallLoading from "../assets/Lottie/loadingSmall.json";

function Loading() {
  // Sentences to display
  const sentences = [
    "Loading your coding adventure...",
    "Debugging is just problem-solving in disguise",
    "Every error is a step closer to mastery",
    "Keep coding, keep growing 🚀"
  ];

  const [index, setIndex] = useState(0);

  // Cycle sentences every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sentences.length]);

  return (
    <div className=" h-screen flex flex-col justify-center items-center bg-[#0D1117]">

      <div className=" h-[60%] w-[50%]">
        <Lottie animationData={ComputerPurple} className="w-full h-full" />
      </div>

      <div className=" h-[10%] w-[10%]">
        <Lottie animationData={SmallLoading} className="w-full h-full" />
      </div>
      {/* Animated Sentence */}
      <motion.h2
        key={sentences[index]} // Ensures animation triggers on change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="text-2xl text-center mt-5 font-exo text-white">
        {sentences[index]}
      </motion.h2>
    <h1 className="font-exo mt-10 font-bold text-[1.2rem] text-white">You're one crash away from greatness</h1>
    </div>
  );
}

export default Loading;
