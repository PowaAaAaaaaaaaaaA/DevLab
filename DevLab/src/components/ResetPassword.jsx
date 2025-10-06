import { motion } from "framer-motion";
import { useState } from "react";
import { auth } from "../Firebase/Firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function ResetPassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all fields.", {
        position: "bottom-center",
        theme: "colored",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        position: "bottom-center",
        theme: "colored",
      });
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      toast.error("No authenticated user found.", {
        position: "bottom-center",
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success("Password has been reset!", {
        position: "bottom-center",
        theme: "colored",
      });
      onClose();
    } catch (error) {
      console.error(error);
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/wrong-password") {
        message = "Current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters.";
      }
      toast.error(message, {
        position: "bottom-center",
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex justify-center items-center">
      <motion.div
        className="relative bg-gradient-to-b from-cyan-400 to-purple-500 rounded-2xl shadow-lg p-[2px] w-[90%] max-w-md text-white"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="bg-[#1E212F] rounded-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white hover:text-gray-300 text-lg"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
          <p className="text-sm mb-4 text-center text-gray-300">
            Enter your current password and a new password.
          </p>

          {/* Current Password Field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 pr-10 rounded-md bg-[#2C2F3F] text-white outline-none border border-gray-600 focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white text-xl hover:text-cyan-400"
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>

          {/* New Password Field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 pr-10 rounded-md bg-[#2C2F3F] text-white outline-none border border-gray-600 focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white text-xl hover:text-cyan-400"
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>

          {/* Reset Password Button */}
          <button
            disabled={loading}
            onClick={handleResetPassword}
            className={`w-full py-2 rounded-md font-bold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#7F5AF0] hover:bg-[#6A4CD4]"
            }`}
          >
            {loading ? "Updating..." : "Set New Password"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
