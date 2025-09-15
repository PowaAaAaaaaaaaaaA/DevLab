// Utils / Custom Hooks
import useLevelBar from "../../components/Custom Hooks/useLevelBar";
import useUserDetails from "../../components/Custom Hooks/useUserDetails";
// Navigation
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
// Icons
import { MdArrowBackIos } from "react-icons/md";
import { LuHeart } from "react-icons/lu";

import defaultAvatar from '../../assets/Images/profile_handler.png'

function GameHeader({heart}) {

    const { animatedExp } = useLevelBar();
    const {gamemodeId} = useParams();
    const { Userdata, isLoading } = useUserDetails();

  return (
    <div className="flex justify-between h-[10%] p-3 items-center">
      <div className="flex items-center p-3">
        <Link to="/Main" className="text-[3rem] text-white">
          <MdArrowBackIos />
        </Link>
        <h1 className="text-[2.5rem] font-exo font-bold text-white">DEVLAB</h1>
      </div>
      {gamemodeId !== "Lesson" && (
          <div className="flex gap-2 mb-4 w-auto justify-center">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < heart ? 'text-red-500 text-4xl' : 'text-gray-500 text-4xl'}>
                <LuHeart />
              </span>
              ))}
          </div>
      )}

      <div className="w-auto h-[90%] flex items-center gap-2 mr-[10px]">
        <div className="border rounded-full bg-gray-600 overflow-hidden w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
          <img
            src={Userdata?.profileImage || defaultAvatar}
            alt="Profile"
            className="w-full h-full object-cover"/>
        </div>

        <div className=" w-auto self-end h-[70%]">
          {/*Progress Bar*/}
          <div className="w-[150px] h-4 mb-2 bg-gray-200 rounded-full  dark:bg-gray-700">
            <div
              className="h-4 rounded-full dark:bg-[#2CB67D]"
              style={{ width: `${(animatedExp / 100) * 100}%` }}>
            </div>
          </div>
          <div className=" flex justify-between">
            <p className="text-white font-inter font-bold">
              Lvl {Userdata?.userLevel}
            </p>
            <p className="text-white font-inter font-bold">
              {Userdata?.exp} / 100xp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameHeader;
