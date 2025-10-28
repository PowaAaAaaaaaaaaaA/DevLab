import { LuAlignJustify } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

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

  // NEW: Custom neon toast
  const showItemUsedToast = (item) => {
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="bg-[#1A0B2E]/90 border border-purple-500 rounded-2xl shadow-[0_0_20px_rgba(128,0,255,0.7)] px-6 py-4 flex items-center gap-4 max-w-sm w-full mx-auto"
        >
          {/* Item Icon */}
          <div className="w-12 h-12 rounded-full bg-purple-800 flex justify-center items-center shadow-inner">
            <img
              src={icons[`../assets/ItemsIcon/${item.Icon}`]?.default}
              alt={item.title}
              className="w-8 h-8 object-contain"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col text-left">
            <h1 className="font-exo text-purple-400 font-bold text-lg">
              ⚡ {item.title} activated!
            </h1>
            <p className="text-gray-300 text-sm">Item used successfully</p>
          </div>
        </motion.div>
      ),
      { duration: 2500, position: "top-center" }
    );
  };

const activeBuffs = useInventoryStore((state) => state.activeBuffs); // get active buffs

const itemActions = {
  "CoinSurge": (item) => {
    if (activeBuffs.includes("doubleCoins")) {
      toast.error("Double Coins is already active!", { position: "top-right" });
      return;
    }
    useItem(item.id, "doubleCoins");
    showItemUsedToast(item);
  },
  "CodeWhisper": async (item) => {
    if (activeBuffs.includes("revealHint")) {
      toast.error("Code Whisper is already active!", { position: "top-right" });
      return;
    }
    if (gamemodeId === "BrainBytes") {
      toast.error("Code Whisper cannot be used in BrainBytes mode", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    await useItem(item.id, "revealHint");
    showItemUsedToast(item);
    setShowCodeWhisper(true);
  },
  "CodePatch": (item) => {
    if (activeBuffs.includes("extraTime")) {
      toast.error("Code Patch is already active!", { position: "top-right" });
      return;
    }
    if (gamemodeId !== "CodeRush") {
      toast.error("Cannot use Item in this Game mode", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    useItem(item.id, "extraTime");
    showItemUsedToast(item);
  },
  "TimeFreeze": (item) => {
    if (activeBuffs.includes("timeFreeze")) {
      toast.error("Time Freeze is already active!", { position: "top-right" });
      return;
    }
    if (gamemodeId !== "CodeRush") {
      toast.error("Cannot use Item in this Game mode", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    useItem(item.id, "timeFreeze");
    showItemUsedToast(item);
  },
  "ErrorShield": async (item) => {
    if (activeBuffs.includes("errorShield")) {
      toast.error("Error Shield is already active!", { position: "top-right" });
      return;
    }
    await useItem(item.id, "errorShield");
    showItemUsedToast(item);
  },
  "BrainFilter": (item) => {
    if (activeBuffs.includes("brainFilter")) {
      toast.error("Brain Filter is already active!", { position: "top-right" });
      return;
    }
    if (gamemodeId !== "BrainBytes") {
      toast.error("Cannot use Item in this Game mode", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    useItem(item.id, "brainFilter");
    showItemUsedToast(item);
  },
};


return (
  <>
    {/* Toggle Button */}
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
          className="
            fixed z-50
            bottom-24 left-6
            w-[90%] sm:w-[70%] md:w-[45%] lg:w-[30%] xl:w-[22%]
            h-[65%] sm:h-[60%] md:h-[55%]
            sm:left-1/2 sm:-translate-x-1/2
            p-safe
          "
        >
          <div className="h-full w-full border border-gray-700/60 rounded-3xl bg-[#0B0F16] p-4 sm:p-5 flex flex-col shadow-xl shadow-black/30">
            <h1 className="text-white font-exo text-[1.5em] sm:text-[1.8em] font-bold mb-4 text-center tracking-wide">
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
                    className="
                      group cursor-pointer border border-gray-700/50 rounded-2xl
                      bg-gradient-to-br from-[#111827] to-[#0D1117]
                      hover:from-[#1A2333] hover:to-[#121826]
                      transition-all duration-300 flex items-center justify-between
                      p-3 sm:p-4 shadow-md hover:shadow-lg
                    "
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
                    <h2 className="text-base sm:text-lg font-exo text-gray-200 flex-1 text-center px-2 sm:px-3 leading-tight">
                      {item.title}
                    </h2>

                    {/* Item Quantity */}
                    <p className="rounded-xl bg-gray-800/60 px-3 sm:px-4 py-1 sm:py-2 text-sm font-exo text-white shadow-inner border border-gray-700/40">
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
