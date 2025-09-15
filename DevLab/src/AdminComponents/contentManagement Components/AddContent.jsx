import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddContent({ subject, closePopup }) {
  const [Lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedType, setSelectedType] = useState("FrontEnd");
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

      let defaultS = "";
      switch (subject) {
        case "Html":
          defaultS = "<>";
          break;
        case "Css":
          defaultS = "#";
          break;
        case "JavaScript":
          defaultS = "{ }";
          break;
        case "Database":
          defaultS = "||||";
          break;
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
        symbol: defaultS,
        order: nextLevelNum,
      };

      if (subject === "JavaScript") levelData.type = selectedType;

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
    <div className="h-auto p-2 flex flex-col w-[100%]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addLevelMutation.mutate();
        }}
        className="border h-[100%] w-[100%] m-auto bg-[#111827] border-[#56EBFF] rounded-2xl p-5"
      >
        {/* Lesson Selector */}
        <div className="border h-[15%] flex items-center pl-10 rounded-2xl border-gray-700 bg-[#0d13207c] text-[1.3rem] font-exo">
          <label className="text-white font-exo mr-3">Lesson: </label>
          <select
            className="bg-[#1f2937] text-white p-2 rounded-md focus:outline-0 hover: cursor-pointer"
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

          {subject === "JavaScript" && (
            <div className="ml-5">
              <label className="text-white font-exo mr-3">Type:</label>
              <select
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#1f2937] text-white p-2 rounded-md focus:outline-0 hover: cursor-pointer"
              >
                <option value="FrontEnd">Front End</option>
                <option value="BackEnd">Back End</option>
              </select>
            </div>
          )}
        </div>

        {/* Level Form */}
        <div
          className={`mt-4 rounded-2xl bg-[#0d13207c] p-5 border-gray-700 border flex flex-col font-exo text-white h-[82%] ${
            selectedLesson === "" ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <label className="text-2xl">Enter the Following</label>
          <input
            required
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400"
          />
          <input
            required
            onChange={(e) => setDesc(e.target.value)}
            type="text"
            placeholder="Description"
            className="border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400"
          />
          <input
            onChange={(e) => setCoins(e.target.value)}
            type="number"
            placeholder="Coin Reward"
            className="border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400"
          />
          <input
            onChange={(e) => setExp(e.target.value)}
            type="number"
            placeholder="Exp Reward"
            className="border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400"
          />
          <div className="flex mt-5 p-5 justify-around w-[60%] m-auto gap-10">
            <button
              type="submit"
              className="p-2 text-[1.2rem] rounded-xl w-[45%] bg-[#4CAF50] hover:cursor-pointer"
            >
              Add Level
            </button>
            <button
              onClick={closePopup}
              className="p-2 text-[1.2rem] rounded-xl w-[45%] bg-gray-700 hover:cursor-pointer"
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
