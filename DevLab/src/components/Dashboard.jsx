// Assets
import HtmlIcons from '../assets/navbarIcons/HTML.png'
import CssIcons from '../assets/navbarIcons/css.png'
import DataIcons from '../assets/navbarIcons/database.png'
import JsIcons from '../assets/navbarIcons/JavaScript.png'
import Coins from '../assets/Images/DevCoins.png'
import defaultAvatar from './../assets/Images/profile_handler.png'
import LoadingSmall from '../assets/Lottie/loadingSmall.json'
import Loading from './Loading'
// Utils
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Lottie from 'lottie-react'
import '../index.css'
// Components
import useLevelBar from './Custom Hooks/useLevelBar'
import useSubjProgressBar from './Custom Hooks/useSubjProgressBar'
import useUserInventory from './Custom Hooks/useUserInventory'
import useFetchUserData from './BackEnd_Data/useFetchUserData.jsx'
import { fetchShopItems } from './BackEnd_Data/useFethShopItems.jsx'




function Dashboard() {

  const icons = import.meta.glob('../assets/ItemsIcon/*', { eager: true });
  // User Details (Custom Hook)
  const { userData, isLoading,isFetching } = useFetchUserData();
  const {animatedExp} = useLevelBar();
  const {inventory, loading} = useUserInventory();
  // Subject ProgressbAr
  const {animatedBar: htmlProgress} = useSubjProgressBar("Html")
  const {animatedBar: CssProgress} = useSubjProgressBar("Css")
  const {animatedBar: JsProgress} = useSubjProgressBar("JavaScript")
  const {animatedBar: DbProgress} = useSubjProgressBar("Database")
  //
  const [loadingDashboard , setLoading] = useState(true);

// pre-fetching data sa Achievement and Shop
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(["ShopItems"], fetchShopItems);
  }, [queryClient]);


// Intial Loading
if (loadingDashboard) {
  return <Loading onComplete={() => setLoading(false)} />;
}


  // Show Loading Screen first
//   // Show Loading Screen
// if (loadingDashboard) {
//   return (
//     <div className="fixed top-0 left-0 w-screen h-screen z-50">
//       <Loading />
//     </div>
//   );
// }
const subjectIcons = {
  Html: HtmlIcons,
  Css: CssIcons,
  JavaScript: JsIcons,
  Database: DataIcons,
};

  return (
// Dashboard Wrapper
  <div className='h-[100%] w-[100%] flex flex-col gap-2 '>
    { !isLoading ? 
    (
<div className='flex min-h-[40%] gap-2'>
    <div
  className="shadow-black shadow-md w-[60%] min-h-[40%] rounded-3xl flex items-center gap-5 p-2 bg-cover bg-center"
  style={{
    backgroundImage: `url(${userData?.backgroundImage})`,
    backgroundColor: "#111827", // fallback if no image
  }}>
  <div className="w-[40%] h-[90%] flex items-center flex-col gap-5 p-2  ">
    <div className="w-[90%] h-[80%] rounded-full overflow-hidden">
      <img
        src={userData?.profileImage || defaultAvatar}
        alt="Profile"
        className="w-full h-full object-cover"/>
    </div>

    <div className="text-white font-inter text-[0.8rem] break-words w-[100%] rounded-2xl backdrop-blur-[10px] text-shadow-lg/60 ">
      <p className="text-center">{userData?.bio}</p>
    </div>
  </div>

  <div className="h-auto w-[100%] flex flex-col p-2 gap-2 backdrop-blur-[2px] rounded-3xl ">
    <p className="text-white font-inter font-bold text-shadow-lg/60">Good to see you!</p>
    <h1 className="sm:text-[1.5rem] md:text-[2.5rem] lg:text-[3.5rem] text-white font-inter font-bold break-words leading-tight text-shadow-lg/60 ">
      {userData?.username}
    </h1>
    <p className="text-white font-inter font-bold text-shadow-lg/60">
      Level {userData?.userLevel}
    </p>
    {/* Progress Bar */}
    <div className="w-[100%] h-4 mb-3 mt-3 bg-gray-200 rounded-full dark:bg-gray-700 ">
      <div
        className="h-4 rounded-full dark:bg-[#2CB67D]"
        style={{ width: `${(animatedExp / 100) * 100}%` }}
      ></div>
    </div>
    {/* Progress Bar */}  
    <div className="flex w-[100%] justify-around ">
      <p className="text-white font-inter font-bold text-shadow-lg/60">
        User Xp: {userData?.exp} / 100
      </p>
      <div className="text-white font-inter font-bold text-shadow-lg/60 ">
        <div className="flex items-center gap-2 sm:gap-3 text-white font-inter font-bold text-shadow-lg/60">
  <img 
    src={Coins} 
    alt="Coins" 
    className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain" 
  />
  <span className="text-sm sm:text-base md:text-lg lg:text-xl truncate">
    {userData?.coins}
  </span>
</div>
      </div>
    </div>
  </div>
</div>
{/* Subject Progress Section */}
<div className="w-[40%] bg-[#111827] rounded-3xl p-5 flex flex-col justify-center gap-4 shadow-black shadow-md">
  <h2 className="text-white font-exo text-[1.5rem] font-bold text-center tracking-wide">
    Your Progress
  </h2>

  {/* HTML */}
  <div className="flex items-center gap-4">
    <img src={HtmlIcons} alt="HTML" className="w-6 h-6" />
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-white font-exo text-sm sm:text-base">HTML Development</span>
        <span className="text-gray-400 font-exo text-sm">{Math.round(htmlProgress)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 ease-in-out"
          style={{ width: `${htmlProgress}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* CSS */}
  <div className="flex items-center gap-4">
    <img src={CssIcons} alt="CSS" className="w-6 h-6" />
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-white font-exo text-sm sm:text-base">CSS Development</span>
        <span className="text-gray-400 font-exo text-sm">{Math.round(CssProgress)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-700 ease-in-out"
          style={{ width: `${CssProgress}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* JavaScript */}
  <div className="flex items-center gap-4">
    <img src={JsIcons} alt="JavaScript" className="w-6 h-6" />
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-white font-exo text-sm sm:text-base">JavaScript Development</span>
        <span className="text-gray-400 font-exo text-sm">{Math.round(JsProgress)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-300 to-orange-500 transition-all duration-700 ease-in-out"
          style={{ width: `${JsProgress}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* Database */}
  <div className="flex items-center gap-4">
    <img src={DataIcons} alt="Database" className="w-6 h-6" />
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-white font-exo text-sm sm:text-base">Database Querying</span>
        <span className="text-gray-400 font-exo text-sm">{Math.round(DbProgress)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-700 transition-all duration-700 ease-in-out"
          style={{ width: `${DbProgress}%` }}
        ></div>
      </div>
    </div>
  </div>
</div>

</div>
): 
    /*LOADING*/
(<div className='bg-[#111827] shadow-black shadow-md w-[100%] min-h-[40%] rounded-3xl flex items-center gap-5 p-10'>
  <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center h-[100%]">
    <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded-sm sm:w-96 dark:bg-gray-700">
        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
    </div>
    <div className="w-full">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
    </div>
      <span className="sr-only">Loading...</span>
    </div>
  </div>)}
    {/*Profile*/}
    

    {/*Bottom Part*/}
<div className='flex gap-2 h-[60%] '>
<div className="h-[95%] w-[75%] p-1 flex flex-col gap-4">
  <h2 className="text-white font-exo font-bold text-[1.5rem] text-shadow-lg/60">
    Jump Back In
  </h2>

  {/*  Check loading state first */}
  {isLoading ? (
    <div className="flex justify-center items-center h-[70%]">
      <Lottie animationData={LoadingSmall} loop className="w-[50%] h-[50%]" />
    </div>
  ) : userData?.lastOpenedLevel && Object.keys(userData.lastOpenedLevel).length > 0 ? (
    <div className="flex flex-col gap-3 overflow-auto p-2 scrollbar-custom">
      {Object.entries(userData.lastOpenedLevel)
        //  Sort by your preferred subject order
        .sort(([a], [b]) => {
          const order = ["Html", "Css", "JavaScript", "Database"];
          return order.indexOf(a) - order.indexOf(b);
        })
        .map(([subject, info]) => (
          <Link
            key={subject}
            to={`/Main/Lessons/${info.subject}/${info.lessonId}/${info.levelId}/${info.stageId}/${info.gameMode}`}
            className="h-[100%]">
            <div className="w-[100%] bg-[#111827] flex rounded-3xl border-black border-2 gap-4 hover:scale-101 cursor-pointer duration-300 min-h-[100px]">
<div className="min-w-[15%] rounded-3xl flex items-center justify-center p-2
                bg-[#0B0F16] shadow-md">
  <img
    src={subjectIcons[subject]}
    alt={subject}
    className="w-10 h-10 sm:w-15 sm:h-15 object-contain"
  />
</div>

              <div className="p-2 flex-col flex gap-2">
                <p className="font-exo text-[1.2rem] text-white font-bold">{info.title}</p>
                <p className="font-exo text-gray-500 text-[0.7rem] line-clamp-2">{info.description}</p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  ) : (
    //  When user has no saved levels
    <div className="w-[100%] bg-[#111827] rounded-3xl border-black border-2 flex items-center justify-center p-5">
      <p className="text-gray-400 font-exo text-lg text-center">
        No recent levels yet. Start learning to unlock this tab!
      </p>
    </div>
  )}
</div>


      {/*Inventory*/}
<div className="bg-[#0B0F16] border border-gray-700/60 w-[25%] h-[90%] rounded-3xl p-3 flex flex-col mt-4">
  <h1 className="text-white font-exo text-[2em] font-bold mb-4 text-center tracking-wide">
    Inventory
  </h1>

  <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-4 scrollbar-custom pr-1">
    {inventory && inventory.length > 0 ? (
      inventory.map((item) => (
        <div
          key={item.id}
          className="group border border-gray-700/50 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0D1117] hover:from-[#1A2333] hover:to-[#121826] transition-all duration-300 flex items-center justify-between p-3 shadow-md hover:shadow-lg"
        >
          {/* Item Icon */}
          <div className="rounded-2xl bg-gray-800/70 p-3 flex justify-center items-center w-[25%] aspect-square overflow-hidden shadow-inner">
            <img
              src={icons[`../assets/ItemsIcon/${item.Icon}`]?.default}
              alt={item.title}
              className="w-full h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
            />
          </div>

          {/* Item Title */}
          <h2 className="text-lg font-exo text-gray-200 flex-1 text-center px-3 leading-tight">
            {item.title}
          </h2>

          {/* Item Quantity */}
          <p className="rounded-xl bg-gray-800/60 px-4 py-2 text-sm font-exo text-white shadow-inner border border-gray-700/40">
            x{item.quantity}
          </p>
        </div>
      ))
    ) : (
      <p className="text-gray-400 text-center text-lg font-exo mt-8">
        No Items
      </p>
    )}
  </div>
</div>


    </div>
{/*END DASHBOARD*/}
  </div>
  )
}

export default Dashboard
