import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/Firebase";

export const goToNextStage = async ({
  subject,
  lessonId,
  levelId,
  stageId,
  navigate,
  setLevelComplete,
}) => {
  const user = auth.currentUser;
  if (!user) return;

  const stagesRef = collection(db, subject, lessonId, "Levels", levelId, "Stages");
  const stagesSnap = await getDocs(stagesRef);

  // Map stages into an array with id and order
  const stages = stagesSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  // Sort stages by their order field
  const sortedStages = stages.sort((a, b) => a.order - b.order);

  // Find the index of the current stage
  const currentIndex = sortedStages.findIndex((stage) => stage.id === stageId);

  if (currentIndex < sortedStages.length - 1) {
    // Get the next stage
    const nextStage = sortedStages[currentIndex + 1];

    // Unlock the next stage in user's progress
    const nextStageRef = doc(db,"Users",user.uid,"Progress","Html","Lessons",lessonId,"Levels",levelId,"Stages",nextStage.id);
    await setDoc(
      nextStageRef,
      {status: true},
      {merge: true }
    );

    // Navigate to the next stage
    navigate(
      `/Main/Lessons/${subject}/${lessonId}/${levelId}/${nextStage.id}/${nextStage.type}`
    );
  } else {
    // No more stages, mark level as complete
    setLevelComplete(true);
  }
};
