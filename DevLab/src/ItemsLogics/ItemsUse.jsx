import { LuAlignJustify } from "react-icons/lu";
import { motion, AnimatePresence} from "framer-motion";

import { useState } from "react";
import useUserInventory from "../components/Custom Hooks/useUserInventory";

import { db, auth } from "../Firebase/Firebase";
import { doc, updateDoc, increment, arrayUnion, deleteDoc, getDoc} from "firebase/firestore";

function ItemsUse({ setShowCodeWhisper }) {
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
      "Code Patch++": (item) => useItem(item.id, "extraTime"),
      skipLevel: (item) => useItem(item.id, "skipLevel"),
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
      <div className="h-[100%] w-[100%] border border-gray-500 rounded-2xl bg-[#111827] p-4 flex flex-col gap-4">
      <h1 className="text-white font-exo text-4xl">Inventory</h1>
      {inventory.map(Items=>(
        <button
        key={Items.id}
        onClick={() => itemActions[Items.title]?.(Items)}
        className="cursor-pointer border rounded-2xl border-gray-400 h-[15%] bg-[#25293B] flex items-center p-1 gap-10">
          <div className="rounded-2xl bg-gray-700 min-w-[20%] h-[95%]"></div>
          <h2 className="text-2xl font-exo text-gray-300">{Items.title}</h2>
          <p className="rounded-xs bg-gray-700 p-1 text-[0.8rem]">{Items.quantity}</p>
        </button>
      ))}  
      </div>
    </motion.div>
)}</AnimatePresence>
    </>
  );
}

export default ItemsUse;
