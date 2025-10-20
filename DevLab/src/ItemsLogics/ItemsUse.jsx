import { LuAlignJustify } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useState } from "react";
import useUserInventory from "../components/Custom Hooks/useUserInventory";
import { useInventoryStore } from "./Items-Store/useInventoryStore";
import { unlockAchievement } from "../components/Custom Hooks/UnlockAchievement";
import useFetchUserData from "../components/BackEnd_Data/useFetchUserData";
import { useParams } from "react-router-dom";

function ItemsUse({ setShowCodeWhisper, gamemodeId }) {
  const { subject } = useParams();
  const { userData } = useFetchUserData();
  const icons = import.meta.glob("../assets/ItemsIcon/*", { eager: true });
  const [showInventory, setShowInventory] = useState(false);
  const { inventory: userInventory } = useUserInventory();
  const useItem = useInventoryStore((state) => state.useItem);

  const itemActions = {
    "Coin Surge": (item) => useItem(item.id, "doubleCoins"),
    "Code Whisper": async (item) => {
      if (gamemodeId === "BrainBytes") {
        toast.error("Code Whisper cannot be used in BrainBytes mode", {
          position: "top-right",
          theme: "colored",
        });
        return;
      }
      await useItem(item.id, "revealHint");
      setShowCodeWhisper(true);
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
    "Error Shield": async (item) => {
      await useItem(item.id, "errorShield");
    },
    "Brain Filter": (item) => {
      if (gamemodeId !== "BrainBytes") {
        toast.error("Cannot use Item in this Game mode", {
          position: "top-right",
          theme: "colored",
        });
        return;
      }
      useItem(item.id, "brainFilter");
    },
  };

  return (
    <>
      <LuAlignJustify
        onClick={() => setShowInventory((prev) => !prev)}
        className="text-4xl cursor-pointer text-gray-300 hover:text-white transition-all duration-200"
      />

      {/* Inventory Popup */}
      <AnimatePresence>
        {showInventory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-[22%] h-[55%] fixed bottom-24 left-6 z-50"
          >
            <div className="h-full w-full border border-gray-700/60 rounded-3xl bg-[#0B0F16] p-5 flex flex-col shadow-xl shadow-black/30">
              <h1 className="text-white font-exo text-[1.8em] font-bold mb-4 text-center tracking-wide">
                Inventory
              </h1>

              <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-4 scrollbar-custom pr-1">
                {userInventory && userInventory.length > 0 ? (
                  userInventory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (gamemodeId === "Lesson") {
                          toast.error("Items cannot be used in Lesson mode", {
                            position: "top-right",
                            theme: "colored",
                          });
                          return;
                        }
                        itemActions[item.title]?.(item);
                        unlockAchievement(userData.uid, subject, "itemUse", {
                          itemName: item.title,
                        });
                      }}
                      className="group cursor-pointer border border-gray-700/50 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0D1117] hover:from-[#1A2333] hover:to-[#121826] transition-all duration-300 flex items-center justify-between p-3 shadow-md hover:shadow-lg"
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
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-center text-lg font-exo mt-8">
                    No items in inventory
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ItemsUse;
