import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

export const goToNextGamemode = async({subject,lessonId,levelId,topicId,gamemodeId,navigate,onComplete}) => {
    const gamemodeRef = collection(db, subject, lessonId, 'Levels', levelId, 'Topics', topicId, 'Gamemodes',);
    const gamemodeSnap = await getDocs(gamemodeRef);

    // Get only gamemodes excluding "Lesson"
    const modeIds = gamemodeSnap.docs
        .map((doc) => doc.id)
        .filter((id) => id !== 'Lesson');

    const currentIndex = modeIds.indexOf(gamemodeId);


    if (currentIndex < modeIds.length - 1) {
        const nextGamemode = modeIds[currentIndex + 1];
navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${topicId}/${nextGamemode}`, {
});
    } else if (currentIndex === modeIds.length - 1) {
        //  Check if there is a next topic
        const topicsRef = collection(db, subject, lessonId, 'Levels', levelId, 'Topics');
        const topicsSnap = await getDocs(topicsRef);
        const topicIds = topicsSnap.docs.map((doc) => doc.id);
        const currentTopicIndex = topicIds.indexOf(topicId);

        if (currentTopicIndex < topicIds.length - 1) {
            const nextTopicId = topicIds[currentTopicIndex + 1];
            navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${nextTopicId}/Lesson`, {
});
        } else {
            //  No more topics —trigger completion popup
            onComplete();
        }
    } else {
        console.warn("Gamemode not found or Lesson was the only one.");
    }
};
