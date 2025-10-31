

import Image from '../assets/Images/Login-Image.jpg'
import { useState } from 'react'
import { auth, db } from '../Firebase/Firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import Loading from "../assets/Lottie/LoadingDots.json";

// react-icons
import { IoMail, IoLockClosed, IoPerson } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        toast.success("Verification email sent! Please check your inbox.", {
          position: "top-center",
          theme: "colored",
        });

        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: username,
          exp: 0,
          userLevel: 1,
          coins: 0,
          bio: "",
          isAdmin: false,
          lastOpenedLevel: {},
        });

        const subjects = ["Html", "Css", "JavaScript", "Database"];
        for (const subject of subjects) {
          await setDoc(doc(db, "Users", user.uid, "Progress", subject), {
            isActive: true,
          });
          await setDoc(doc(db, "Users", user.uid, "Progress", subject, "Lessons", "Lesson1"), {
            isActive: true,
          });
          await setDoc(doc(db, "Users", user.uid, "Progress", subject, "Lessons", "Lesson1", "Levels", "Level1"), {
            isActive: true,
            isCompleted: false,
            isRewardClaimed: false,
          });
          await setDoc(doc(db, "Users", user.uid, "Progress", subject, "Lessons", "Lesson1", "Levels", "Level1", "Stages", "Stage1"), {
            isActive: true,
            isCompleted: true,
          });
        }

        signOut(auth)
          .then(() => {
            toast.success(
              "Registered successfully! Please verify your email before logging in.",
              { position: "top-center", theme: "colored" }
            );
            navigate("/Login");
          })
          .catch((err) => {
            toast.error("Error signing out. Please try again.", {
              position: "top-center",
              theme: "colored",
            });
          });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex justify-center items-center px-4 py-8">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <Lottie animationData={Loading} loop className="w-1/2 h-1/2" />
        </div>
      )}

      <div className="w-full max-w-5xl bg-[#25293B] rounded-3xl shadow-lg shadow-cyan-500 flex flex-col sm:flex-row overflow-hidden">
        {/* Left */}
        <div
          className="hidden sm:flex w-1/2 bg-cover bg-center p-4 items-center justify-center"
          style={{ backgroundImage: `url(${Image})` }}
        >
          <h1 className="font-exo text-4xl lg:text-5xl font-bold text-[#F5F5F5] drop-shadow-xl">
            DEVLAB
          </h1>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center w-full sm:w-1/2 p-6">
          <FaUserPlus className="text-[#314A70] text-[7rem] mb-10" />

          <form autoComplete="off" className="w-full flex flex-col items-center gap-4" onSubmit={handleRegister}>
            {/* Email */}
            <div className="w-[85%] relative">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="bg-[#1E212F] text-white w-full h-12 rounded-2xl pl-12 pr-4 border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
              <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white" />
            </div>

            {/* Password */}
            <div className="w-[85%] relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="bg-[#1E212F] text-white w-full h-12 rounded-2xl pl-12 pr-4 border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
              <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white" />
            </div>

            {/* Confirm Password */}
            <div className="w-[85%] relative">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="bg-[#1E212F] text-white w-full h-12 rounded-2xl pl-12 pr-4 border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
              <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white" />
            </div>

            {/* Username */}
            <div className="w-[85%] relative">
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="bg-[#1E212F] text-white w-full h-12 rounded-2xl pl-12 pr-4 border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
              <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white" />
            </div>

            <div className="w-[60%] mt-4">
              <button
                type="submit"
                className="bg-[#7F5AF0] w-full text-lg rounded-3xl text-white p-3 font-bold cursor-pointer hover:bg-[#6A4CD4] hover:scale-105 transition-all duration-300 drop-shadow-xl"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;