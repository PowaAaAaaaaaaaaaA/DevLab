import { arrayRemove } from "firebase/firestore";

async function awardCoins(baseCoins) {
  const userId = auth.currentUser.uid;
  const userRef = doc(db, "Users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  let reward = baseCoins;

  if (userData.activeBuffs?.includes("doubleCoins")) {
    reward *= 2;
    await updateDoc(userRef, {
      activeBuffs: arrayRemove("doubleCoins") // Remove buff after use
    });
  }
  await updateDoc(userRef, {
    coins: userData.coins + reward
  });
}


