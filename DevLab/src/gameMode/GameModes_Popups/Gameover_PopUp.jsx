import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Gameover from "../../assets/Lottie/SadSignout.json";
import Lottie from "lottie-react";
import { callGameOver } from "../../components/BackEnd_Functions/callGameOver";
import { useState } from "react";

function Gameover_PopUp({ gameOver, resetHearts, Back, subject, lessonId, levelId, stageId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoBack = async () => {
    if (!gameOver || !Back) return;
    try {
      setLoading(true);
      await callGameOver(subject, lessonId, levelId, stageId); //  Call API before resetting
      resetHearts();
      navigate(Back);
    } catch (error) {
      console.error("Error calling gameOver API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoDashboard = async () => {
    try {
      setLoading(true);
      await callGameOver(subject, lessonId, levelId, stageId); //  Also call before dashboard
      resetHearts();
      navigate("/main");
    } catch (error) {
      console.error("Error calling gameOver API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center flex flex-col items-center gap-4"
      >
        <h1 className="font-exo text-4xl text-[#ea3333] font-bold">Game Over !!</h1>

        <Lottie animationData={Gameover} loop={true} className="w-[30%] h-[40%] mt-[20px]" />

        <p className="font-exo font-bold p-2">
          "System Crash: No remaining lives detected in memory. Restart required to allocate new hearts."
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={handleGoBack}
          disabled={loading}
          className={`${
            loading ? "opacity-50 cursor-not-allowed" : ""
          } bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]`}
        >
          {loading ? "Processing..." : "Go back to the 1st Lesson"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={handleGoDashboard}
          disabled={loading}
          className={`${
            loading ? "opacity-50 cursor-not-allowed" : ""
          } bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]`}
        >
          {loading ? "Processing..." : "Go Back to Dashboard"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Gameover_PopUp;
