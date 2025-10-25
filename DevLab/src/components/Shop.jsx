import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";


import MoneyIcon from '../assets/Images/DevCoins.png';
import Loading from '../assets/Lottie/LoadingDots.json';
import Lottie from 'lottie-react';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";


import useFetchUserData from './BackEnd_Data/useFetchUserData';
import useAnimatedNumber from './Custom Hooks/useAnimatedNumber';
import useFetchShopItems from './BackEnd_Data/useFethShopItems';
import { purchaseItem } from './BackEnd_Functions/purchaseItem';

import '../index.css';

function Shop() {
  const { shopItems, isLoading } = useFetchShopItems(); //  include loading state
  const icons = import.meta.glob('../assets/ItemsIcon/*', { eager: true });

  const { userData } = useFetchUserData();
  const { animatedValue } = useAnimatedNumber(userData?.coins);

  const [isBuying, setIsBuying] = useState(false);

const queryClient = useQueryClient();

const buyMutation = useMutation({
  mutationFn: async (item) => {
    // Run the actual purchase logic (your existing backend function)
    return await purchaseItem(item.id, item.cost, item.Icon);
  },

onMutate: async (item) => {
  await queryClient.cancelQueries(["userData"]);

  const previousUserData =
    queryClient.getQueryData(["userData"]) || userData;

  // Check coin balance
  if (!previousUserData || previousUserData.coins < item.cost) {
    toast.error("Not enough DevCoins!", {
      position: "top-center",
      theme: "colored",
    });
    throw new Error("Insufficient coins");
  }

  // Optimistic UI update
  queryClient.setQueryData(["userData"], (oldData) => ({
    ...oldData,
    coins: (oldData?.coins || 0) - item.cost,
  }));

  showPurchaseToast(item)

  return { previousUserData };
},


  onSuccess: () => {
    // Optionally refresh shop or user data
    queryClient.invalidateQueries(["userData", userData.uid]);
    queryClient.invalidateQueries(["shopItems"]);
    setIsBuying(false);
  },
  onError: (context) => {
    // Rollback on error
    if (context?.previousUserData) {
      queryClient.setQueryData(["userData", userData.uid], context.previousUserData);
    }
    toast.error("Purchase failed. Try again!", {
      position: "top-center",
      theme: "colored",
    });
    setIsBuying(false);
  },
});
const showPurchaseToast = (item) => {
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.85 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-4 text-center max-w-sm w-full mx-auto"
      >

        <div className="flex flex-col">
          <h1 className="font-exo text-green-700 font-extrabold text-2xl drop-shadow-sm">
            🛒 Purchase Successful!
          </h1>

          <p className="text-gray-700 text-base">
            You bought <span className="font-bold text-purple-700">{item.title}</span>!
          </p>

          <div className="flex justify-center gap-4 mt-3">
            <div className="bg-yellow-100 px-4 py-2 rounded-xl shadow-sm">
              <p className="text-sm text-yellow-700 font-bold">
                Cost: <span className="text-yellow-600">-{item.cost}</span> 🪙
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    { duration: 3000, position: "top-center" }
  );
};



  return (
    <>
      {/* Upper Panel */}
      <div className='border flex h-[30%] rounded-3xl bg-[#111827]'>
        <div className='p-5 w-[80%] flex flex-col gap-5'>
          <div className='flex gap-3.5'>
            <h1 className='font-exo font-bold text-white text-[5rem]'>DEVSHOP</h1>
          </div>
          <p className='font-exo text-white'>
            Welcome to the DevLab Shop, where learning meets gamification! Earn rewards as you code, learn, and complete challenges, then spend them on awesome upgrades to enhance your experience.
          </p>
        </div>
        <div className='flex h-[100%] w-[20%] justify-center items-center gap-3.5'>
          <img src={MoneyIcon} alt="" className='h-[20%]' />
          <p className='font-exo font-bold text-[#2CB67D] text-4xl'>{animatedValue}</p>
        </div>
      </div>

      {/* Shop */}
      <div className='max-h-[500px] border border-[#36334B] w-[80%] rounded-4xl overflow-y-scroll overflow-x-hidden m-auto mt-[3rem] p-4 Shop-container scrollbar-custom'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-20 w-full h-[100%] p-4'>
          {isLoading ? ( //  loading state for shop items
            <div className="col-span-full flex justify-center items-center">
              <Lottie animationData={Loading} loop={true} className="w-[20%]" />
            </div>
          ) : (
            shopItems.map((item) => (
              <div
                key={item.id}
                className="p-[2px] rounded-xl bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 shadow-md h-[100%]"
              >
                <div className="bg-[#0D1117] rounded-xl p-7 flex flex-col items-center h-full">
                  {/* Icon */}
                  <img src={icons[`../assets/ItemsIcon/${item.Icon}`]?.default} alt="" className='w-30' />
                  {/* Title */}
                  <h2 className="text-xl font-bold text-center text-white font-exo">{item.title}</h2>
                  {/* Description */}
                  <p className="text-sm text-center font-exo text-gray-300 min-h-[25%] max-h-[25%] textSmall-laptop m-auto">
                    {item.desc}
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ bounceDamping: 100 }}
                    onClick={() => buyMutation.mutate(item)}
                    className="bg-green-400 text-black font-bold py-2 px-6 rounded-full text-lg hover:cursor-pointer mt-5 mb-5"
                  >
                    $ {item.cost}
                  </motion.button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Buying Overlay */}
      {isBuying && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/95'>
          <Lottie animationData={Loading} loop={true} className="w-[50%] h-[50%]" />
        </div>
      )}
    </>
  );
}

export default Shop;
