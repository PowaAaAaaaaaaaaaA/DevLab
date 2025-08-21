import { LuAlignJustify } from "react-icons/lu";
import { motion, AnimatePresence} from "framer-motion";
import { toast } from "react-toastify";

import { useState } from "react";
import useUserInventory from "../components/Custom Hooks/useUserInventory";

import { db, auth } from "../Firebase/Firebase";
import { doc, updateDoc, increment, arrayUnion, deleteDoc, getDoc} from "firebase/firestore";

import { useErrorShield } from "./ErrorShield";

function ItemsUse({ setShowCodeWhisper, gamemodeId }) {
  const icons = import.meta.glob('../assets/ItemsIcon/*', { eager: true });
    const [showInventory, setShowInventory] = useState(false);
    const { inventory, loading} = useUserInventory();
    
      const useItem = async(itemId, buffName)=>{
      const userId = auth.currentUser.uid;
        // Reduce quantity in Inventory
      const inventoryRef = doc(db, "Users", userId, "Inventory", itemId);
      await updateDoc(inventoryRef, {
        quantity: increment(-1)
      });
        // Check the updated quantity
      const snapshot = await getDoc(inventoryRef);
      const updatedData = snapshot.data();
    
          if (buffName) {
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, {
          activeBuffs: arrayUnion(buffName)
        });
      }
      
      if (updatedData?.quantity <= 0) {
        await deleteDoc(inventoryRef);
        return; // stop here so buff doesn't apply if no quantity
      }
    }

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
      <div className="h-[100%] w-[100%] border border-gray-500 rounded-2xl bg-[#111827] p-4 flex flex-col gap-4 overflow-scroll overflow-x-hidden">
      <h1 className="text-white font-exo text-4xl">Inventory</h1>
      {inventory.map(Items=>(
        <button
        key={Items.id}
        onClick={() => itemActions[Items.title]?.(Items)}
        className="cursor-pointer border rounded-2xl border-gray-600 min-h-[15%] bg-[#0D1117] flex items-center p-1 gap-10">
          <div className="rounded-2xl bg-gray-700 min-w-[20%] h-[95%] p-2"><img src={icons[`../assets/ItemsIcon/${Items.Icon}`]?.default} alt="" className='w-full h-full'/></div>
          <h2 className="text-2xl font-exo text-gray-300 min-w-[45%]">{Items.title}</h2>
          <p className="rounded-lg bg-gray-700 p-3 text-[0.8rem]">{Items.quantity}</p>
        </button>
      ))}  
      </div>
    </motion.div>
)}</AnimatePresence>
    </>
  );
}

export default ItemsUse;
