import {useEffect, useState}from 'react'
import { doc, updateDoc, setDoc , getDoc, increment} from "firebase/firestore";
import { db, auth } from '../Firebase/Firebase';

import ShopIcon from '../assets/Images/Shop_Icon.png'
import MoneyIcon from '../assets/Images/Money_Icon.png'
import ItemIcon from '../assets/Images/Item_Icon.png'
import Loading from '../assets/Lottie/LoadingDots.json'
import Lottie from 'lottie-react';
import { motion } from "framer-motion";

import useUserDetails from './Custom Hooks/useUserDetails'
import useShopItems from './Custom Hooks/useShopItems'
import useAnimatedNumber from './Custom Hooks/useAnimatedNumber';

import '../index.css'


function Shop() {

  const icons = import.meta.glob('../assets/ItemsIcon/*', { eager: true });

  // User Details (Custom Hook)
  const {Userdata, refetch } = useUserDetails();
  // Shop Items (Custom Hook)
  const {items, loading} = useShopItems();
  //
  const {animatedValue} = useAnimatedNumber(Userdata?.coins);
// Buy Button
  const [isBuying, setIsBuying] = useState(false);

  const buyItem = async (item) => {
    const user = auth.currentUser;
    if (Userdata.coins < item.cost) {
      alert("Not enough coins!");
      return;
    }
    try {
      setIsBuying(true);
      // Deduct Coins
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        coins: Userdata.coins - item.cost,
      });
      refetch(); // Refresh user details (coins)
      // Add to Inventory
      const inventoryRef = doc(db, "Users", user.uid, "Inventory", item.id);
      const inventorySnap = await getDoc(inventoryRef);

    if (inventorySnap.exists()) {
      // If item already exists, increment quantity
      await updateDoc(inventoryRef, {
        quantity: increment(1)
      });
    } else {
      // If item is new, create with quantity = 1
      await setDoc(inventoryRef, {
        ...item,
        quantity: 1
      });
    }
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsBuying(false);
    }
  };

if(loading) return <p>Loading</p>

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
          <p className='font-exo font-bold text-[#2CB67D] text-4xl'>{animatedValue}</p>
        </div>
      </div>


      {/*Shop*/}
      <div className='max-h-[500px] border border-[#36334B] w-[80%] rounded-4xl overflow-y-scroll overflow-x-hidden m-auto mt-[3rem] p-4 Shop-container
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-20 w-full h-[100%] p-4'>
        {items.map(item=>(
          <div 
          key={item.id}
          className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 shadow-md">
          <div className="bg-[#0D1117] rounded-xl p-6 flex flex-col items-center space-y-4 h-full">
            {/* Icon */}
            <img src={icons[`../assets/ItemsIcon/${item.Icon}`]?.default} alt="" className='w-30'/>
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white font-exo">{item.title}</h2>
            {/* Description */}
            <p className="text-sm text-center text-gray-300 min-h-[25%] max-h-[25%]">{item.desc}</p>
            {/* Subtext
            <p className="text-sm text-center text-green-400 font-semibold">
          Multiply or Lose rewards by 2x
            </p> */}
            {/* Button */}
            <motion.button 
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ bounceDamping: 100 }}
          onClick={() => {
            setTimeout(() => buyItem(item), 300);
            }}
            className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:cursor-pointer"> $ {item.cost}
            </motion.button>
          </div>
        </div>
        ))}
    </div>
  </div>
  {isBuying && (
  <div className='fixed inset-0 z-50 flex items-center justify-center  bg-black/95'>
    <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" />
  </div>
  )}
  
    </>
  )
}

export default Shop