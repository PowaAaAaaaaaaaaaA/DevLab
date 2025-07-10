


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


{activeTab === "CodeRush" && (
  <div className='border-cyan-400 border rounded-2xl w-[45%] h-[30%] p-4 bg-[#111827]'>
    <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Time Limit:</h1>
    <textarea
      name="timeLimit"
      id="timeLimit"
      className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none'
      placeholder={gamemodeData?.timeLimit || 'Enter time limit (in seconds)'}
    ></textarea>
  </div>
)}

// LEsson eDit
   const newGamemodeData = {
      instruction: "Enter your instruction here...",
      topic: "Sample topic...",
      preCode: "",
      hint: "",
      timer: 0,
      type: activeTab, // optional, for identifying
    }; 
    // Only create if it doesn't exist
    const gmSnapshot = await getDoc(gamemodeRef);
    if (!gmSnapshot.exists()) {
      await setDoc(gamemodeDb, newGamemodeData);
      toast.success(`New ${activeTab} mode added!`, {
        position: "top-center",
        theme: "colored",
      });
    }