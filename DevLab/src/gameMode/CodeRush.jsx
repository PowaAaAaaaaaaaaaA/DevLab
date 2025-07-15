import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

function CodeRush() {
 const navigate = useNavigate();
  const { subject, lessonId, levelId, gamemodeId } = useParams();

  const onNextClick = async () => {
    const gamemodeRef = collection(db, subject, lessonId, 'Levels', levelId, 'Gamemode');
    const gamemodeSnap = await getDocs(gamemodeRef);

    const modeIds = gamemodeSnap.docs.map((doc) => doc.id);
    const currentIndex = modeIds.indexOf(gamemodeId);

    if (currentIndex !== -1 && currentIndex < modeIds.length - 1) {
      const nextGamemode = modeIds[currentIndex + 1];
      navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${nextGamemode}`);
    }
  };

  return (
    <div>
      {/* Your code rush content */}
      <button onClick={onNextClick}>CR</button>

    </div>
  );
}

export default CodeRush