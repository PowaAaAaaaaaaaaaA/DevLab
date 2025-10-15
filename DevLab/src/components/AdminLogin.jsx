// Utils
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
// Assets
import Image from "../assets/Images/Login-Image.jpg";
import logIcon from "../assets/Images/LoginIcon.png";
// Ui
import { toast } from "react-toastify";
import { IoPerson } from "react-icons/io5";
import { IoLockClosed } from "react-icons/io5";


function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      const userDb = doc(db, "Users", user.uid);
      const UserDocs = await getDoc(userDb);

      if (UserDocs.data().isAdmin && UserDocs.exists) {
        navigate("/Admin");
        console.log("sad");
      } else {
        toast.error("Access denied. Not an admin.", {
          position: "bottom-center",
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        theme: "colored",
      });
      console.log("sad");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex justify-center items-center">
      {/* LoginAdmin Wrapper*/}
      <div className="h-[70vh] w-[65%] bg-[#25293B] rounded-4xl shadow-lg shadow-cyan-500 flex">
        {/*Left pannel*/}
        <div
          className=" bg-cover bg-no-repeat h-[100%] w-[50%] rounded-4xl flex justify-center"
          style={{ backgroundImage: `url(${Image})` }}
        >
          <h1 className="self-center font-exo text-[3.5rem] font-bold text-[#F5F5F5] block text-shadow-lg/80">
            DEVLAB
          </h1>
        </div>
        {/*right pannel*/}
        <div className="flex w-[50%] items-center flex-col">
          <img src={logIcon} alt="" className="w-50 h-50 mt-10" />
          {/*Form*/}
          <form
            className="w-[100%] flex flex-col gap-5 items-center p-3.5"
            onSubmit={handleSubmit}
            autoComplete="off">
            <div className="w-[70%] flex justify-start items-center relative">
              <input
                type="text"
                name="Email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
                className="relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl pl-[35px] border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
              <IoPerson className="absolute text-white text-2xl ml-2" />
            </div>
            <div className="w-[70%] flex justify-start items-center relative">
              <input
                type="Password"
                name="Password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl pl-[35px] border-2 border-gray-700 focus:border-cyan-500 focus:outline-none"/>
              <IoLockClosed className="absolute text-white text-2xl ml-2" />
            </div>
            <div className="m-[2%] w-[35%]">
              <button className="bg-[#7F5AF0] w-[100%] text-[1.2rem] rounded-4xl text-white p-4 font-bold hover:cursor-pointer hover:bg-[#6A4CD4] hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.8)]">
                Login
              </button>
            </div>
            {/*Form End*/}
          </form>
          {/*right pannel End*/}
        </div>
        {/* LoginAdmin Wrapper End*/}
      </div>
      {/*End*/}
    </div>
  );
}

export default AdminLogin;
