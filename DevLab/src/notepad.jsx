


//On Next button, find and navigate to the next game mode
//Get all game modes under Gamemode collection.

//Exclude "Lesson".

//Pick the first remaining (or according to your logic).

//Navigate to the correct page.
const onNextClick = async () => {
  const gamemodeRef = collection(db, "Html", lessonId, "Levels", levelId, "Gamemode");
  const gamemodeSnap = await getDocs(gamemodeRef);

  const nextModes = gamemodeSnap.docs.filter(doc => doc.id !== "Lesson");

  if (nextModes.length > 0) {
    const nextGameMode = nextModes[0].id; // e.g., "CodeRush", "BugBust"
    // Navigate based on that game mode
    navigate(`/Main/${lessonId}/${levelId}/${nextGameMode}`);
  } else {
    console.log("No next game mode found");
  }
};



const fetchLessons = async (subject) => {
  try {
    const subjectRef = collection(db, subject);
    const snapshot = await getDocs(subjectRef);

    const lessonData = await Promise.all(
      snapshot.docs.map(async (lessonDoc) => {
        const levelsRef = collection(db, subject, lessonDoc.id, "Levels");
        const levelsSnapshot = await getDocs(levelsRef);

        const levels = await Promise.all(
          levelsSnapshot.docs.map(async (levelDoc) => {
            const gamemodeRef = collection(db, subject, lessonDoc.id, "Levels", levelDoc.id, "Gamemode");
            const gamemodeSnap = await getDocs(gamemodeRef);
            const gamemodes = gamemodeSnap.docs.map((gm) => ({
              id: gm.id,
              ...gm.data(),
            }));

            return {
              id: levelDoc.id,
              ...levelDoc.data(),
              gamemodes, // ⬅️ Add gamemodes to each level
            };
          })
        );

        return {
          id: lessonDoc.id,
          title: lessonDoc.data().title,
          levels,
        };
      })
    );

    setLessons(lessonData);
  } catch (error) {
    console.error("Error fetching lessons:", error);
  }
};
