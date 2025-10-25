// stores/useInventoryStore.js
import { create } from "zustand";
import { db, auth } from "../../Firebase/Firebase";
import { doc, updateDoc, deleteDoc, getDoc, increment } from "firebase/firestore";

export const useInventoryStore = create((set, get) => ({
  inventory: [],
  activeBuffs: [],

  setInventory: (items) => set({ inventory: items }),
useItem: async (itemId, buffName) => {
  const { inventory, activeBuffs } = get();
  const updatedBuffs = buffName ? [...activeBuffs, buffName] : activeBuffs;

  // Immediately update local inventory
  const updatedInventory = inventory
    .map((item) =>
      item.id === itemId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  set({ inventory: updatedInventory, activeBuffs: updatedBuffs });

  // Update Firestore
  const userId = auth.currentUser.uid;
  const itemRef = doc(db, "Users", userId, "Inventory", itemId);
  await updateDoc(itemRef, { quantity: increment(-1) });

  const snap = await getDoc(itemRef);
  if (!snap.exists() || snap.data().quantity <= 0) {
    await deleteDoc(itemRef);
  }
}
,
  removeBuff: (buffName) => set((state) => ({
  activeBuffs: state.activeBuffs.filter((buff) => buff !== buffName)
}))
}));
