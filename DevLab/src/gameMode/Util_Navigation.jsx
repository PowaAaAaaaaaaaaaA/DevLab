
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

export const goToNextGamemode = async({ subject, lessonId, levelId, gamemodeId, navigate,onComplete })=>{
    const gamemodeRef = collection(db, subject, lessonId, 'Levels', levelId, 'Gamemode');
    const gamemodeSnap = await getDocs(gamemodeRef);

    // Get only gamemodes excluding "Lesson"
    const modeIds = gamemodeSnap.docs
    .map((doc) => doc.id)
    .filter((id) => id !== 'Lesson');

    
    const currentIndex = modeIds.indexOf(gamemodeId);
    console.log(gamemodeId)
    console.log (currentIndex)
    console.log (modeIds.length)


    if (currentIndex < modeIds.length - 1) {
    const nextGamemode = modeIds[currentIndex + 1];
    navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${nextGamemode}`);
        } else if (currentIndex === modeIds.length - 1) {
    // Last gamemode, trigger completion popup
    onComplete();
    } else {
    console.warn("Gamemode not found or Lesson was the only one.");
    } 
}

