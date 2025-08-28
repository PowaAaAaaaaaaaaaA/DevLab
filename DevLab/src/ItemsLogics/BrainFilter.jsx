// src/ItemsLogics/PerfectPrecision.js
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../Firebase/Firebase";


export async function BrainFilter(optionsArray, correctAnswer) {
  // Find wrong options
  const wrongOptions = optionsArray.filter(([key]) => key !== correctAnswer);

  if (wrongOptions.length === 0) return optionsArray; // nothing to remove

  // Pick one random wrong option to remove
  const randomIndex = Math.floor(Math.random() * wrongOptions.length);
  const optionToRemove = wrongOptions[randomIndex][0];

  // Remove from options array
  const filteredOptions = optionsArray.filter(
    ([key]) => key !== optionToRemove
  );

  // Remove the buff from Firestore (single-use)
  const userRef = doc(db, "Users", auth.currentUser.uid);
  await updateDoc(userRef, {
    activeBuffs: arrayRemove("brainFilter"),
  }).catch(console.error);

  return filteredOptions;
}
