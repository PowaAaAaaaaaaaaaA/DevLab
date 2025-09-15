async function checkSubjectCompletion(userId, subjectName) {
  //Get total levels in the subject
  const levelsSnapshot = await getDocs(collection(db, `${subjectName}/Levels`));
  const totalLevels = levelsSnapshot.size;

  // Get user's completed levels count
  const userProgressRef = doc(db, "users", userId, "progress", subjectName);
  const userProgressSnap = await getDoc(userProgressRef);
  const completedLevels = userProgressSnap.data()?.completedLevels?.length || 0;

  // Compare and unlock if complete
  if (completedLevels >= totalLevels) {
    unlockAchievement(userId, "finishHTML");
  }
}
