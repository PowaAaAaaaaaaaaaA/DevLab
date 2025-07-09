


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
