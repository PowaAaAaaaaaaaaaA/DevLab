import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust your path

function Css_TE({ setIsCorrect, setShowisCorrect }) {
  const { lessonId, levelId, gamemodeId } = useParams();

  // 🔹 Store Firestore data for this lesson/level/gamemode
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const docRef = doc(
          db,
          "CSS",          // ✅ Subject collection
          lessonId,       // ✅ Lesson
          "Levels",       // ✅ Levels subcollection
          levelId,
          "Gamemodes",    // ✅ Gamemodes subcollection
          gamemodeId
        );
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setLessonData(snapshot.data());
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    };

    fetchLessonData();
  }, [lessonId, levelId, gamemodeId]);


  const handleEvaluate = async () => {
  if (!lessonData) return console.warn("Lesson data not loaded yet");

  setIsEvaluating(true);
  try {
    const result = await lessonPrompt({
      receivedCode: {
        html: code.HTML,
        css: code.CSS,
        js: "",
      },
      instruction: lessonData.instruction,  // 🔥 pulled from Firestore
      description: lessonData.description,  // 🔥 pulled from Firestore
    });

    setEvaluationResult(result);
    setShowPopup(true);

    const success = result?.toLowerCase().includes("correct");
    setIsCorrect(success);
  } catch (error) {
    console.error("Error evaluating code:", error);
  } finally {
    setIsEvaluating(false);
  }
};
