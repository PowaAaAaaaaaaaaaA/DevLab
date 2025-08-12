import { doc, updateDoc, increment } from "firebase/firestore";
import { db,auth } from "../Firebase/Firebase";

export default function CoinSurge(originalCoins) {
    const DoubleCoins = () => {

    const doubled = originalCoins * 2;

    console.log(`Double coins applied: +${doubled}`);
    return doubled; // so UI can show the awarded amount
    };

    return { DoubleCoins };
}
