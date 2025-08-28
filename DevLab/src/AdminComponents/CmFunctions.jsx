import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { collection,getDocs,setDoc,doc } from "firebase/firestore"
import { db } from "../Firebase/Firebase"

const CmFunctions = () => {

const {data} = useQuery({})
const mutation = useMutation({
    mutationFn:  async (subject, lessonId, levelId) => {
      try {
        console.log(subject, lessonId, levelId)
        const topicsRef = collection(db, subject, `Lesson${lessonId}`, "Levels", levelId, "Stages");
        const snapshot = await getDocs(topicsRef);
    
        // Get highest numbered Topic
        const topicNumbers = snapshot.docs.map(doc => {
          const match = doc.id.match(/Stage(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
    
        const nextNumber = (topicNumbers.length > 0 ? Math.max(...topicNumbers) : 0) + 1;
        const newTopicId = `Stage${nextNumber}`;
    
        await setDoc(doc(topicsRef, newTopicId), {
          title: newTopicId,
          createdAt: new Date()
        });
    
      } catch (error) {
        console.error("Error adding topic:", error);
      }
    ;},
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["lesson_data", activeTab] });
  }
})

return {data, mutation}
}

export default CmFunctions