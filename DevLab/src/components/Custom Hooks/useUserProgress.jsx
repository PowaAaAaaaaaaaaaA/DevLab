// for the Unlock and Locked Levels

import { useState, useEffect } from "react";
import { db,auth } from "../../Firebase/Firebase";
import { collection,getDocs } from "firebase/firestore";
import useLevelsData from "./useLevelsData";

export default function useUserProgress(subject) {
  const { data, isLoading } = useLevelsData(subject);
  const [userProgress, setUserProgress] = useState({}); // user's progress per level
    const [completedCount, setCompletedCount] = useState(0); 

  const fetchProgress = async (lessonIds) => {
    const userId = auth.currentUser.uid;
    const allProgress = {};
    let count = 0

    for (const lessonId of lessonIds) {
      const progressRef = collection(db,"Users",userId,"Progress",subject,"Lessons",lessonId,"Levels");
      const progressSnap = await getDocs(progressRef);
      progressSnap.forEach((doc) => {
        const status = doc.data().status;
        allProgress[`${lessonId}-${doc.id}`] = status;
        if (status === true){
          count +=1
        }
      });
    }
    setUserProgress(allProgress);
    setCompletedCount(count);
  };
    useEffect(() => {
      if (data) {
        const lessonIds = data.map((lesson) => lesson.id);
        fetchProgress(lessonIds);
      }
    }, [data]);

    return {userProgress,completedCount};
}
