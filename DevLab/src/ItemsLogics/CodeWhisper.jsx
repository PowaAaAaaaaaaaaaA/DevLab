// components/CodeWhisper.jsx
import { useEffect } from "react";
import { db, auth } from "../Firebase/Firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { motion,AnimatePresence } from "framer-motion";

const CodeWhisper = ({ hint, onClose }) => {
  useEffect(() => {
    const removeRevealHint = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "Users", userId);

      await updateDoc(userRef, {
        activeBuffs: arrayRemove("revealHint"),
      });

      console.log("revealHint buff removed from userBuff.");
    };

    removeRevealHint();
  }, []);

  return (
  <AnimatePresence>
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 border-white border">
      <div className="bg-[#1E212F] p-5 rounded-xl shadow-lg max-w-md text-center border border-purple-800">
        <h2 className="text-xl font-semibold mb-4">Code Whisper</h2>
        <p className="text-gray-700">{hint}</p>
        <button
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          onClick={onClose}>
          Got it!
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
  );
};

export default CodeWhisper;
