import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddContent({ subject, closePopup }) {
  const [Lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [coins, setCoins] = useState("");
  const [exp, setExp] = useState("");

  const queryClient = useQueryClient();

  // Fetch existing lessons
  const fetchLessonsData = async () => {
    try {
      const subjDb = collection(db, subject);
      const subjDocs = await getDocs(subjDb);
      const lessons = subjDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLessons(lessons);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLessonsData();
  }, [subject]);

  // Mutation for adding a level (and possibly a lesson)
  const addLevelMutation = useMutation({
    mutationFn: async () => {
      if (!title || !desc) {
        toast.error("Fill all the fields", {
          position: "top-center",
          theme: "colored",
        });
        return;
      }
      let lessonIdFinal = selectedLesson;
      // Handle creating a new lesson
      if (selectedLesson === "LessonAdd") {
        const existingNums = Lessons.map((l) => {
          const match = l.id?.match(/Lesson(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        const nextNum =
          existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
        lessonIdFinal = `Lesson${nextNum}`;

        const lessonDocRef = collection(db, subject);
        await setDoc(doc(lessonDocRef, lessonIdFinal), { Lesson: nextNum });

        await fetchLessonsData();
        setSelectedLesson(lessonIdFinal);
        toast.success("Lesson Added", {
          position: "top-center",
          theme: "colored",
        });
      }

      // Add level
      const levelCollection = collection(db, subject, lessonIdFinal, "Levels");
      const levelSnapshot = await getDocs(levelCollection);
      const levelNums = levelSnapshot.docs.map((doc) => {
        const match = doc.id.match(/Level(\d+)/i);
        return match ? parseInt(match[1]) : 0;
      });
      const nextLevelNum =
        levelNums.length > 0 ? Math.max(...levelNums) + 1 : 1;
      const levelId = `Level${nextLevelNum}`;
      const levelDocRef = doc(db, subject, lessonIdFinal, "Levels", levelId);

      const levelData = {
        title,
        description: desc,
        coinsReward: parseInt(coins),
        expReward: parseInt(exp),
        levelOrder: nextLevelNum,
      };

      await setDoc(levelDocRef, levelData);

      // Clear form
      setTitle("");
      setDesc("");
      setCoins("");
      setExp("");

      return levelId;
    },
    onSuccess: (levelId) => {
      toast.success("Level Added Successfully!", {
        position: "top-center",
        theme: "colored",
      });
      queryClient.invalidateQueries(["lessons", subject]); // if you have queries for lessons/levels
      if (closePopup) closePopup();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to add level.", {
        position: "top-center",
        theme: "colored",
      });
    },
  });

return (
  <div className="h-auto p-2 flex flex-col w-full">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addLevelMutation.mutate();
      }}
      className="relative border w-full m-auto bg-[#111827] border-[#56EBFF] rounded-2xl p-5 sm:p-8 shadow-lg">
      {/* Close Button */}
      <button
        type="button"
        onClick={closePopup}
        className="absolute top-3 right-3 text-white text-xl bg-red-500 hover:bg-red-60 w-5 h-5 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md cursor-pointer">
        ✕
      </button>

      <div className="border h-auto py-4 px-5 sm:px-10 flex flex-col sm:flex-row 
                      sm:items-center gap-4 sm:gap-6 rounded-2xl border-gray-700 
                      bg-[#0d13207c] text-lg sm:text-xl font-exo">
        <div className="flex items-center gap-3">
          <label className="text-white">Lesson:</label>
          <select
            className="bg-[#1f2937] text-white p-2 rounded-md focus:outline-0 cursor-pointer"
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
          >
            <option value="">-- Select Lesson --</option>
            {Lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title || lesson.id}
              </option>
            ))}
            <option value="LessonAdd">Add Lesson</option>
          </select>
        </div>
      </div>
      <div
        className={`mt-4 rounded-2xl bg-[#0d13207c] p-5 sm:p-7 border border-gray-700 
                    flex flex-col font-exo text-white min-h-[300px] sm:min-h-[350px]
                    ${
                      selectedLesson === ""
                        ? "opacity-30 pointer-events-none"
                        : ""
                    }`}
      >
        <label className="text-xl sm:text-2xl mb-2">Enter the Following</label>

        <input
          required
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          className="border-gray-700 border p-3 rounded my-2 focus:outline-1 w-full 
                     focus:outline-gray-400"
        />

        <input
          required
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          placeholder="Description"
          className="border-gray-700 border p-3 rounded my-2 focus:outline-1 w-full 
                     focus:outline-gray-400"
        />

        <input
          required
          onChange={(e) => setCoins(e.target.value)}
          type="number"
          placeholder="Coin Reward"
          className="border-gray-700 border p-3 rounded my-2 focus:outline-1 w-full 
                     focus:outline-gray-400"
        />

        <input
          required
          onChange={(e) => setExp(e.target.value)}
          type="number"
          placeholder="Exp Reward"
          className="border-gray-700 border p-3 rounded my-2 focus:outline-1 w-full 
                     focus:outline-gray-400"
        />

        {/*  Buttons Row */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 w-full sm:w-[70%] mx-auto">

          <button
            type="submit"
            className="p-2 text-lg rounded-xl w-full sm:w-[45%] 
                       bg-[#4CAF50] hover:bg-[#45a049] 
                       hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Add Level
          </button>

          <button
            type="button"
            onClick={closePopup}
            className="p-2 text-lg rounded-xl w-full sm:w-[45%] 
                       bg-gray-700 hover:bg-gray-600 
                       hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>

        </div>
      </div>
    </form>
  </div>
);

}

export default AddContent;
