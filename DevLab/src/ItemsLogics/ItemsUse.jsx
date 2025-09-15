import { LuAlignJustify } from "react-icons/lu";
import { motion, AnimatePresence} from "framer-motion";
import { toast } from "react-toastify";

import { useState } from "react";
import useUserInventory from "../components/Custom Hooks/useUserInventory";

import { useInventoryStore } from "./Items-Store/useInventoryStore";
import { unlockAchievement } from "../components/Custom Hooks/UnlockAchievement";
import useUserDetails from "../components/Custom Hooks/useUserDetails";

import { useParams } from "react-router-dom";


function ItemsUse({ setShowCodeWhisper, gamemodeId }) {

  const {subject} = useParams();


  const icons = import.meta.glob('../assets/ItemsIcon/*', { eager: true });
    const [showInventory, setShowInventory] = useState(false);
    const { inventory:userInventory, loading} = useUserInventory();

  const { Userdata,refetch } = useUserDetails();
  const useItem = useInventoryStore((state) => state.useItem);

    const itemActions = {
      "Coin Surge": (item) => useItem(item.id, "doubleCoins"),
      "Code Whisper": async (item) => {
        await useItem(item.id, "revealHint");
        setShowCodeWhisper(true); // Trigger the popup after applying the buff
      },
      "Code Patch++": (item) => {
    if (gamemodeId !== "CodeRush") { 
      toast.error("Cannot use Item in this Game mode", {
      position: "top-right",
      theme: "colored",
    });
      return;
    }
    useItem(item.id, "extraTime");
  },
  "Time Freeze": (item) => {
    if (gamemodeId !== "CodeRush") { 
      toast.error("Cannot use Item in this Game mode", {
      position: "top-right",
      theme: "colored",
    });
      return;
    }
    useItem(item.id, "timeFreeze");
  },
    "Error Shield": async(item)=>{
      await useItem(item.id, "errorShield");
    },
    "Brain Filter": (item)=>{
    if (gamemodeId !== "BrainBytes"){
      toast.error("Cannot use Item in this Game mode", {
      position: "top-right",
      theme: "colored",
    });
    return
    }
      useItem(item.id, "brainFilter");
    },
    };

  return (
    <>
      <LuAlignJustify
        onClick={() => setShowInventory((prev) => !prev)}
        className="text-4xl cursor-pointer"/>
          {/*Inventory Show*/}
  <AnimatePresence >
{showInventory && (
  <motion.div 
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    className="w-[20%] h-[50%] fixed bottom-20 left-5">
    <div className="h-[100%] w-[100%] border border-gray-500 rounded-2xl bg-[#111827] p-4 flex flex-col gap-4 overflow-scroll overflow-x-hidden scrollbar-custom">
      <h1 className="text-white font-exo text-4xl">Inventory</h1>
{userInventory && userInventory.length > 0 ? (
  userInventory.map((Items) => (
    <button
      key={Items.id}
onClick={() => {
    // Trigger any predefined item action
    itemActions[Items.title]?.(Items);
    // Call unlockAchievement for this item
    unlockAchievement(Userdata.uid, subject, "itemUse", {
      itemName: Items.title
    });
  }}
      className="cursor-pointer border rounded-2xl border-gray-600 min-h-[15%] bg-[#0D1117] flex items-center p-2 gap-7 w-auto">
      <div className="rounded-2xl bg-gray-700 min-w-[20%] h-[95%] p-2">
        <img
          src={icons[`../assets/ItemsIcon/${Items.Icon}`]?.default}
          alt={Items.title}
          className="w-full h-full"/>
      </div>
      <h2 className="text-2xl font-exo text-gray-300 min-w-[45%] mediuText-laptop">
        {Items.title}
      </h2>
      <p className="rounded-lg bg-gray-700 p-2 text-[0.8rem]">{Items.quantity}</p>
    </button>
  ))
) : (
  <p className="text-gray-400 text-center mt-4">No items in inventory</p>
)}

    </div>
  </motion.div>
)}
</AnimatePresence>
    </>
  );
}

export default ItemsUse;
