// For Fetching the game mode Data (Lesson, BugBust, CodeRush, CodeCrafter, BrainBytes)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { doc,getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export default function useGameModeData() {
  const { subject, lessonId, levelId, stageId, gamemodeId } = useParams();

    const [gameModeData, setGameModeData] = useState(null);
    const [levelData, setLevelData] = useState(null);
    // Getting data GameMode Data and Level Data
    useEffect(() => {
      const fetchLevel = async () => {
        const docRef = doc(db, subject, lessonId, "Levels", levelId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLevelData(docSnap.data());
        }
        const gamemodeRef = doc(db,subject,lessonId,"Levels",levelId,"Stages",stageId);
        const gamemodeSnap = await getDoc(gamemodeRef);
        if (gamemodeSnap.exists()) {
          setGameModeData(gamemodeSnap.data());
        }
      };
      fetchLevel();
  }, [subject, lessonId, levelId, stageId]);

  console.log(gamemodeId)

  return {gameModeData,levelData,  subject, lessonId, levelId, stageId, gamemodeId }
}
