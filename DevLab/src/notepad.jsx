import { useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

const navigate = useNavigate();
const { subject, lessonId, levelId, gamemodeId } = useParams(); // must exist in the route

const onNextClick = async () => {
  try {
    const gamemodeRef = collection(db, subject, lessonId, 'Levels', levelId, 'Gamemode');
    const gamemodeSnap = await getDocs(gamemodeRef);

    const modeIds = gamemodeSnap.docs.map((doc) => doc.id); // e.g., ['Lesson', 'CodeRush', ...]
    const currentIndex = modeIds.indexOf(gamemodeId);

    if (currentIndex !== -1 && currentIndex < modeIds.length - 1) {
      const nextGamemode = modeIds[currentIndex + 1];
      navigate(`/Main/Lessons/${subject}/${lessonId}/${levelId}/${nextGamemode}`);
    } else {
      console.log("No more gamemodes.");
    }
  } catch (err) {
    console.error("Failed to fetch gamemodes:", err);
  }
};












{/* 
{levelComplete && (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
      <h2 className="text-3xl font-bold text-[#9333EA] mb-4">🎉 Congratulations!</h2>
      <p className="text-lg text-gray-800 mb-6">
        You have completed all game modes for this level.
      </p>
      <button
        onClick={() => {
          setLevelComplete(false);
          navigate('/Main'); // or navigate to next level, summary, or dashboard
        }}
        className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700"
      >
        Back to Main
      </button>
    </div>
  </div>
)}*/}

            <div className='border-cyan-400 border rounded-2xl w-[55%] h-[20%] p-4 bg-[#111827]'>
              <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Title: </h1>
              <textarea 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none' placeholder={levelData?.title || 'Loading'}></textarea>
            </div>

            {/*Level Description*/}
            <div className='border-cyan-400 border rounded-2xl w-[35%] h-[20%] p-4 bg-[#111827]'>
              <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Level Description:</h1>
              <textarea 
              onChange={(e) => setEditedDesc(e.target.value)}
              name="" id="" className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none' placeholder={levelData?.desc || 'Loading'}></textarea>
            </div> 