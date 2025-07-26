import { useState, useEffect } from "react";
import { db,auth } from "../../Firebase/Firebase";
import { collection,getDocs } from "firebase/firestore";

import useLevelsData from "./useLevelsData";
export default function useUserProgress(subject) {
  const { data, isLoading } = useLevelsData(subject);
  const [userProgress, setUserProgress] = useState({}); // user's progress per level

  const fetchProgress = async (lessonIds) => {
    const userId = auth.currentUser.uid;
    const allProgress = {};
    for (const lessonId of lessonIds) {
      const progressRef = collection(db,"Users",userId,"Progress",subject,"Lessons",lessonId,"Levels");
      const progressSnap = await getDocs(progressRef);
      progressSnap.forEach((doc) => {
        allProgress[`${lessonId}-${doc.id}`] = doc.data().status;
      });
    }
    setUserProgress(allProgress);
  };
    useEffect(() => {
      if (data) {
        const lessonIds = data.map((lesson) => lesson.id);
        console.log("Lesson IDs chck:", lessonIds);
        fetchProgress(lessonIds);
      }
    }, [data]);

    return {userProgress};
}
