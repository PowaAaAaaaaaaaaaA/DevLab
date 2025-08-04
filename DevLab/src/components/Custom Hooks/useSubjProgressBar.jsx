// For The Progress Bar of the Completed Levels
import { db } from "../../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import useUserProgress from "./useUserProgress";

export default function useSubjProgressBar(subject) {


    const {userProgress,completedCount} = useUserProgress(subject);
    const [animatedBar, setAnimatedBar] = useState(0);
    const [total, setTotal]  = useState(0)

  const getTotalLevels = async () => {
    const subjectRef = collection(db, subject);
    const lessonSnapshots = await getDocs(subjectRef);

    let totalLevels = 0;

    for (const lessonDoc of lessonSnapshots.docs) {
      const levelsRef = collection(db, subject, lessonDoc.id, "Levels");
      const levelsSnapshot = await getDocs(levelsRef);
      totalLevels += levelsSnapshot.size; // .size gives the number of documents
    }

    setTotal(totalLevels);
  };

  useEffect(() => {
    getTotalLevels();
  }, [subject]);

  const progress = total > 0 ? (completedCount / total) * 100 : 0;

  useEffect(() => {
    let current = animatedBar;
    const target = progress;

    const step = () => {
      if (current < target) {
        current = Math.min(current + 1, target);
        setAnimatedBar(current);
        requestAnimationFrame(step);
      } else {
        setAnimatedBar(target);
      }
    };

    requestAnimationFrame(step);
  }, [progress]);
return {animatedBar, rawProgress: progress };

} 
