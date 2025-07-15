
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

export const goToNextGamemode = async({ subject, lessonId, levelId, gamemodeId, navigate })=>{
    const gamemodeRef = collection(db, subject, lessonId, 'Levels', levelId, 'Gamemode');
    const gamemodeSnap = await getDocs(gamemodeRef);

    const modeIds = gamemodeSnap.docs.map((doc) => doc.id);
    const currentIndex = modeIds.indexOf(gamemodeId);

    if (currentIndex !== -1 && currentIndex < modeIds.length - 1) {
    const nextGamemode = modeIds[currentIndex + 1];
    navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${nextGamemode}`);
    } else {
    console.log("No more gamemodes.");
    }
}

