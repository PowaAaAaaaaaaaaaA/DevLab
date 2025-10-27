// Assets
import Image from "../assets/Images/Login-Image.jpg";
import Loading from "../assets/Lottie/LoadingDots.json";
// Utils
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
// Ui
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { IoPerson } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { IoEye, IoEyeOff } from "react-icons/io5";
// Components
import ForgotPassword from "./ForgotPassword";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set persistence based on "Remember Me"
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Attempt sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Refresh user info to make sure emailVerified is up-to-date
      await user.reload();

      //  Block unverified accounts
      if (!user.emailVerified) {
        await signOut(auth); // Force logout immediately
        toast.error("Your email has not been verified yet.", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
        return; //  Stop here completely — no navigation, no Firestore fetch
      }

      //  Check user document in Firestore
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.isSuspend) {
          await signOut(auth);
          toast.error(
            "Your account has been suspended. Please contact support.",
            {
              position: "top-center",
              theme: "colored",
            }
          );
          setLoading(false);
          return; //  Stop here too
        }
      }

      toast.success("Login successful!", {
        position: "top-center",
        theme: "colored",
      });

      navigate("/Main"); //  Only verified + active users reach here
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials.", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/95">
          <Lottie
            animationData={Loading}
            loop={true}
            className="w-[50%] h-[50%]"
          />
        </div>
      )}

      <div className="min-h-screen bg-[#0D1117] flex justify-center items-center">
        {/* Login Wrapper*/}
        <div className="h-[70vh] w-[65%] bg-[#25293B] rounded-4xl shadow-lg shadow-cyan-500 flex">
          {/*Left pannel*/}
          <div
            className=" bg-cover bg-no-repeat h-[100%] w-[50%] rounded-4xl hidden justify-center sm:flex 
"
            style={{ backgroundImage: `url(${Image})` }}
          >
            <h1 className="self-center font-exo text-[2.5rem] lg:text-[3.5rem] font-bold text-[#F5F5F5] block">
              DEVLAB
            </h1>
          </div>

          {/*right pannel*/}
          <div className="flex items-center w-full flex-col sm:w-[50%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="text-[#314A70] h-[40%] w-[40%] mt-[3%] mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <form
              className="w-[100%] flex flex-col items-center p-3.5"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              {/*Email Input*/}
              <div className="w-[70%] flex justify-center relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="Email"
                  name="email"
                  id="Email"
                  placeholder="Email"
                  className="relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl pl-[50px] border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"
                />
                <span className="absolute text-white left-3 self-center text-1xl md:text-2xl">
                  <IoPerson />
                </span>
              </div>
              {/*Password Input*/}
              <div className="w-[70%] flex justify-center relative m-[3%]">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="Password"
                  placeholder="Password"
                  className="relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] border-2 border-gray-700 focus:border-cyan-500  focus:outline-none"
                />
                <span className="absolute text-white left-3 self-center text-1xl md:text-2xl">
                  <IoLockOpen />
                </span>
                {/* Toggle visibility button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 self-center text-white text-1xl md:text-2xl hover:text-cyan-400 transition"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />} {/* toggle icons */}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                }}
                className="text-white text-sm hover:underline cursor-pointer"
              >
                Forgot Password
              </button>
              {/*Remember Meeee*/}
              <div className="m-[2%]">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  className="peer cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-white pl-2 cursor-pointer transition-all duration-300 peer-checked:text-green-400 hover:drop-shadow-[0_0_6px_rgba(147,197,253,0.8)]"
                >
                  Remember Me
                </label>
              </div>
              <div className="m-[2%] w-[35%]">
                <button
                  type="submit"
                  className="bg-[#7F5AF0] w-[100%] text-[0.8rem] md:text-[1.2rem] rounded-4xl text-white p-4 font-bold hover:cursor-pointer hover:bg-[#6A4CD4] hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.8)]"
                >
                  Login
                </button>
              </div>
            </form>
            {/*Register Link*/}
            <div className="text-white text-center">
              <p>
                Dont have an account?{" "}
                <Link
                  to="/Register"
                  className="text-blue-200 hover:cursor-pointer hover:underline hover:drop-shadow-[0_0_6px_rgba(147,197,253,0.8)] transition-all duration-300"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {showForgot && (
        <ForgotPassword onClose={() => setShowForgot(false)}></ForgotPassword>
      )}
    </>
  );
}
export default Login;
