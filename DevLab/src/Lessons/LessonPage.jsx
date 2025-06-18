import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import { useEffect, useState } from 'react';


function LessonPage() {

    const { id } = useParams();

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const docRef = doc(db, "Lessons", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLesson(docSnap.data());
        } else {
          console.log("No such lesson!");
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
      }
    };

    if (id) {
      fetchLesson();
    }
  }, [id]);
  return (
    <div className="p-6 text-white">
      {lesson ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
          <p className="text-lg">{lesson.instruction}</p>
        </>
      ) : (
        <p>Loading lesson...</p>
      )}
    </div>
  )
}

export default LessonPage