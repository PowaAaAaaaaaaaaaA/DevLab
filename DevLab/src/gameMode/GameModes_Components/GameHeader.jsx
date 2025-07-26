// Utils / Custom Hooks
import useLevelBar from "../../components/Custom Hooks/useLevelBar";
import useUserDetails from "../../components/Custom Hooks/useUserDetails";
// Navigation
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
// Icons
import { MdArrowBackIos } from "react-icons/md";
import { LuHeart } from "react-icons/lu";
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
          <div className="flex gap-2 mb-4 w-[12%]">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < heart ? 'text-red-500 text-4xl' : 'text-gray-500 text-4xl'}>
                <LuHeart />
              </span>
              ))}
          </div>
      )}

      <div className="w-[12%] h-[90%] flex items-center gap-2">
        <div className="border h-[90%] w-[35%] rounded-full bg-gray-600"></div>
        <div className=" w-[100%] self-end h-[70%]">
          {/*Progress Bar*/}
          <div className="w-[90%] h-4 mb-2 bg-gray-200 rounded-full  dark:bg-gray-700">
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
