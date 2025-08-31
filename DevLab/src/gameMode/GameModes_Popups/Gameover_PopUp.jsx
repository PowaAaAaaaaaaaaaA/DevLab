import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Gameover_PopUp({ gameOver, resetHearts, Back }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (gameOver && Back) {
      resetHearts();
      navigate(Back); // Navigate to the route passed from GameModeRouter
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={handleGoBack}
          className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
          Go back to the previous Lesson
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Gameover_PopUp;
