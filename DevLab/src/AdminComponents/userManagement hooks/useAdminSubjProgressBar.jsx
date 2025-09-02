// For Admin Progress Bar of Completed Levels
import { db } from "../../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import useAdminUserProgress from "./useAdminUserProgress";

export default function useAdminSubjProgressBar(subject, userId) {
  const { userProgress, completedLevels } = useAdminUserProgress(subject, userId);
  const [animatedBar, setAnimatedBar] = useState(0);
  const [total, setTotal] = useState(0);

  // Function to get total levels for the given subject
  const getTotalLevels = async () => {
    if (!subject) return;

    try {
      const subjectRef = collection(db, subject);
      const lessonSnapshots = await getDocs(subjectRef);

      let totalLevels = 0;

      for (const lessonDoc of lessonSnapshots.docs) {
        const levelsRef = collection(db, subject, lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);
        totalLevels += levelsSnapshot.size; // count levels per lesson
      }

      setTotal(totalLevels);
      console.log(`Total Levels for ${subject}:`, totalLevels);
    } catch (err) {
      console.error("Error fetching total levels:", err);
    }
  };

  useEffect(() => {
    getTotalLevels();
  }, [subject]);

  // Calculate progress
  const progress = total > 0 ? (completedLevels / total) * 100 : 0;

  // Animate bar smoothly
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

  return { animatedBar, rawProgress: progress, total };
}
