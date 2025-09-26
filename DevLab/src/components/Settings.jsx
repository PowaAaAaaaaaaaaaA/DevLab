// Uis
import { IoPerson } from "react-icons/io5";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import LogoutAnimation from "../assets/Lottie/SadSignout.json";
import defaultAvatar from '../assets/Images/profile_handler.png'
// Firebase
import { auth, db,storage } from "../Firebase/Firebase";
import { updateDoc,doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Utils
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// Components
import AdminLogin from "../assets/Lottie/AdminLogin.json";
// Data
import useFetchUserData from "./BackEnd_Data/useFetchUserData";


function Settings() {


  const { userData, refetch } = useFetchUserData();

  const [showLogoutPopUp, setShowLogoutPopUp] = useState(false);
  const [showAdminPopup, setAdminPopup] = useState(false);
  const navigate = useNavigate();

  // Logout
  const logout = async () => {
    try {
      sessionStorage.removeItem('dashboardLoaded');
      await auth.signOut();
      navigate("/Login"); // Use navigate
    } catch (error) {
      console.log(error);
    }
  };

  // Admin Login
  const admin = async () => {
    try {
      //await auth.signOut();
      navigate("/AdminLogin"); // Use navigate
    } catch (error) {
      console.log(error);
    }
  };
// Updating Username or Bio
  const [newUserName, setUserName] = useState("");
  const [newBio, setBio] = useState("");
  useEffect(() => {
    if (userData) {
      setUserName(userData.username || "");
      setBio(userData.bio || "");
    }
  }, [userData]);
  // Save Button
  const saveDetails = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const getUser = doc(db, "Users", user.uid);
    console.log("Saving:", newUserName, newBio);
    toast.success("Save Changes", {
      position: "top-center",
      theme: "colored",
    });
    try {
      await updateDoc(getUser, {
        username: newUserName || userData.username,
        bio: newBio || userData.bio,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // Update Imagese (Storage)
  const uploadImage = async (file, type = "profile") => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in.");

    const fileRef = ref(storage, `userProfiles/${user.uid}/${type}.jpg`);
    // Upload file to storage
    await uploadBytes(fileRef, file);
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    // Update Firestore with the new URL (safe with merge)
    await setDoc(
      doc(db, "Users", user.uid),
      { [`${type}Image`]: downloadURL },
      { merge: true }
    );

    return downloadURL;
  };
  return (
    <>
      <div className="bg-[#111827] flex flex-col items-center gap-5 p-5 h-[95%] w-[40%] m-auto mt-5 rounded-3xl border-2 shadow-2xl shadow-black">
{/* Profile Image */}
<motion.div
  className="w-[35%] h-[25%] rounded-full overflow-hidden border border-gray-600 cursor-pointer relative"
  whileHover={{ opacity: 0.5 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}>
  <img
    src={userData?.profileImage || defaultAvatar}
    alt="Profile"
    className="w-full h-full object-cover"/>
  <input
    type="file"
    accept="image/*"
    className="absolute inset-0 opacity-0 cursor-pointer"
    onChange={async (e) => {
      if (e.target.files[0]) {
        await uploadImage(e.target.files[0], "profile");
        await refetch();
        toast.success("Profile picture updated!");
      }
    }}
  />
</motion.div>

{/* Background Image */}
<motion.div 
  whileHover={{ opacity: 0.5 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
className="w-[70%] h-[10%] rounded-3xl overflow-hidden border border-gray-600 relative">
  <img
    src={userData?.backgroundImage || defaultAvatar}
    alt="Background"
    className="w-full h-full object-cover"/>
  <input
    type="file"
    accept="image/*"
    className="absolute inset-0 opacity-0 cursor-pointer"
    onChange={async (e) => {
      if (e.target.files[0]) {
        await uploadImage(e.target.files[0], "background");
        await refetch();
        toast.success("Background image updated!");
      }
    }}
  />
</motion.div>
        <form
          action=""
          className="w-[55%] h-[50%] flex flex-col gap-3 p-1 "
          onSubmit={saveDetails}>
          <label htmlFor="" className="text-white font-exo font-light">
            Username
          </label>
          <div className="relative w-[100%] h-[15%] flex justify-items-start items-center">
            <input
              type="text"
              placeholder={userData ? userData.username : "Loading..."}
              onChange={(e) => setUserName(e.target.value)}
              className="w-[100%] h-[100%] text-white bg-[#1E212F] rounded-2xl  p-2 pl-10"/>
            <IoPerson className="absolute text-white text-2xl ml-2" />
          </div>
          <label htmlFor="" className="text-white font-exo font-light">
            Bio
          </label>
          <div className="w-[100%] h-[50%]">
            <textarea
              name=""
              id=""
              maxLength="50"
              placeholder={userData ? userData.bio : "Loading..."}
              onChange={(e) => setBio(e.target.value)}
              className="w-[100%] h-[100%] text-white bg-[#1E212F] rounded-2xl p-2 resize-none ">
              </textarea>
          </div>
          <motion.button
            whileTap={{scale:0.95}}
            whileHover={{scale:1.05}}
            transition={{bounceDamping:100}}
            type="submit"
            className="bg-[#7F5AF0] w-[80%] font-exo p-2 m-auto rounded-4xl text-[1rem] font-bold text-white hover:cursor-pointer  hover:bg-[#6A4CD4] hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.4)]">
            Save Changes
          </motion.button>
        </form>
        <motion.button
          whileTap={{scale:0.95}}
          whileHover={{scale:1.05}}
          transition={{bounceDamping:100}}
          className="bg-[#FF6166] p-3 w-[43%] rounded-3xl font-exo font-bold text-white mt-1.5 hover:cursor-pointerhover:bg-[#6A4CD4] hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.4)]
hover:cursor-pointer"
          onClick={()=>{setTimeout(() => {
            setShowLogoutPopUp(true)
          },300)}}>
          Logout
        </motion.button>

        <Link>
          <button
            onClick={() => setAdminPopup(true)}
            className="text-white font-exo  hover:text-red-500 hover:cursor-pointer transition duration-300 hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]">
            Login as Administrator
          </button>
        </Link>
      </div>
    <AnimatePresence initial={false}>
      {showLogoutPopUp && (
        <div className="fixed  inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center ">
          <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="bg-[#1E212F] text-white p-6 rounded-2xl text-center shadow-lg w-[20%] opacity-100 flex flex-col items-center">
            <h2 className="text-xl font-bold font-exo">Confirm Logout</h2>
            <Lottie
              animationData={LogoutAnimation}
              loop={true}
              className="w-[40%] h-[50%] mt-[30px]"/>
            <p className="mb-6 font-exo">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4 w-[100%]">
              <motion.button
                whileTap={{scale:0.95}}
                whileHover={{scale:1.05}}
                transition={{bounceDamping:100}}                
                onClick={logout}
                className="bg-[#FF6166] p-3 w-[40%] rounded-3xl font-exo font-bold text-white hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.4)]
hover:cursor-pointer">
                Yes, Logout
              </motion.button>
              <motion.button
                whileTap={{scale:0.95}}
                whileHover={{scale:1.05}}
                transition={{bounceDamping:100}}  
                onClick={() => setTimeout(() => {
                  setShowLogoutPopUp(false)
                }, 200)}
                className="bg-gray-500 p-3 w-[40%] rounded-3xl font-exo font-bold text-white hover:drop-shadow-[0_0_6px_rgba(128,128,128,0.4)]
hover:cursor-pointer">
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    <AnimatePresence initial={false}>
      {showAdminPopup ? (
        <div 
        className="fixed inset-0 flex bg-black/80 backdrop-blur-1xl items-center justify-center z-50">
          <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="bg-[#1E212F] w-[25%] h-auto text-white rounded-2xl text-center p-4 flex flex-col items-center">
            <h2 className="font-exo text-3xl">Admin Login</h2>
            <Lottie
              animationData={AdminLogin}
              loop={true}
              className="w-[40%] h-[50%] mt-[30px]"/>
            <p className="font-exo text-[1rem] mt-1.5">Confirm Admin Login</p>
            <div className="flex justify-center gap-5 mt-5 w-[100%]">
              <motion.button
                whileTap={{scale:0.95}}
                whileHover={{scale:1.05}}
                transition={{bounceDamping:100}} 
                onClick={admin}
                className="bg-[#1EDB3E] p-3 w-[40%] rounded-3xl font-exo font-bold text-white   hover:drop-shadow-[0_0_6px_rgba(30,219,62,0.4)]
hover:cursor-pointer">
                Proceed
              </motion.button>
              <motion.button
                whileTap={{scale:0.95}}
                whileHover={{scale:1.05}}
                transition={{bounceDamping:100}} 
                onClick={() => setAdminPopup(false)}
                className="bg-[#FF6166] p-3 w-[40%] rounded-3xl font-exo font-bold text-white   hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.4)]
hover:cursor-pointer">
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      ):null}
    </AnimatePresence>
    </>
  );
}

export default Settings;
