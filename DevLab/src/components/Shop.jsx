import {useState, useEffect}from 'react'
import ShopIcon from '../assets/Images/Shop_Icon.png'
import MoneyIcon from '../assets/Images/Money_Icon.png'
import ItemIcon from '../assets/Images/Item_Icon.png'
import useUserDetails from './Custom Hooks/useUserDetails'



function Shop() {

  // User Details (Custom Hook)
  const {Userdata, isLoading } = useUserDetails();

  return (
    <>
    {/*Upper Pannel*/}
      <div className='border flex h-[30%] rounded-3xl bg-[#111827]'> 
        <div className='p-5 w-[80%] flex flex-col gap-5'>
          <div className='flex gap-3.5'>
            <img src={ShopIcon} alt="" />
            <h1 className='font-exo font-bold text-white text-[5rem]'>DEVSHOP</h1>
          </div>
          <p className='font-exo text-white'>Welcome to the DevLab Shop, where learning meets gamification! Earn rewards as you code, learn, and complete challenges, then spend them on awesome upgrades to enhance your experience.</p>
        </div>
        <div className='flex h-[100%] w-[20%] justify-center items-center gap-3.5'>
          <img src={MoneyIcon} alt="" className='h-[20%]' />
          <p className='font-exo font-bold text-[#2CB67D] text-4xl'>{Userdata?.coins}</p>
        </div>
      </div>


      {/*Shop*/}
      <div className='max-h-[500px] border border-[#36334B] w-[80%] rounded-4xl overflow-y-scroll overflow-x-hidden m-auto mt-[3rem] p-4
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-20 w-full h-[100%] p-4'>


        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        {/*ITEM*/}
        <div className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 w-72 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4">
            {/* Icon */}
            <img src={ItemIcon} alt="" />
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white">DOUBLE DOWN</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300">
            Multiply your rewards at a risk! Earn double or lose the bonus depending on your answer
            </p>
            {/* Subtext */}
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p>
            {/* Button */}
            <button className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:bg-green-300 transition hover:cursor-pointer">
          $400
            </button>
          </div>
        </div>
        
    
    </div>
      </div>   
    </>
  )
}

export default Shop