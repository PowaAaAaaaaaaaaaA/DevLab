// components/CodeWhisper.jsx
import { useEffect } from "react";
import { motion,AnimatePresence } from "framer-motion";

import { useInventoryStore } from "./Items-Store/useInventoryStore";
const CodeWhisper = ({ hint, onClose }) => {
    const { removeBuff } = useInventoryStore.getState();
  useEffect(() => {
    const removeRevealHint = async () => {

removeBuff("revealHint");
      console.log("revealHint buff removed from userBuff.");
    };

    removeRevealHint();
  }, []);

  return (

    <div 
    className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-[#1E212F] p-5 rounded-xl shadow-lg min-w-md text-center border border-purple-800">
        <h2 className="text-3xl font-exo font-semibold mb-4">Code Whisper</h2>
        <div className="rounded bg-gray-900 p-5">
          <p className="font-exo text-[1.2rem] text-gray-300">Hint: {hint}</p>
        </div>
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, background: "#7e22ce" }}
            transition={{ bounceDamping: 100 }}
          className="mt-5 px-4 py-2 text-white rounded-lg cursor-pointer bg-[#9333EA]"
          onClick={()=>setTimeout (onClose, 500)}>
          Got it!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CodeWhisper;
