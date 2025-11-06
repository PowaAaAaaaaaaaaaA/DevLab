import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAddLesson } from "./BackEndFuntions/useAddLesson";
import { useAddLevel } from "./BackEndFuntions/useAddLevel";

function AddContent({ subject, closePopup }) {
  const [Lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");

  const queryClient = useQueryClient();

  const addLessonMutation = useAddLesson(subject);
  const addLevelMutationBack = useAddLevel(subject);



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

    //  Case 1 – Add Lesson
    if (selectedLesson === "LessonAdd") {
      return new Promise((resolve, reject) => {
        addLessonMutation.mutate(
          { category: subject },
          {
            onSuccess: async (res) => {
              toast.success(res.message);

              await fetchLessonsData();

              //  Extract lesson number from backend message
const match = res.message.match(/Lesson\s(\d+)/i);
const newLessonNumber = match ? parseInt(match[1]) : null;

if (newLessonNumber) {
  setSelectedLesson(`Lesson${newLessonNumber}`);
}
              closePopup && closePopup();
              resolve();
            },
            onError: reject,
          }
        );
      });
    }

    // Case 2 – Add Level
    if (!selectedLesson) {
      toast.error("Please select a lesson.");
      return;
    }

    return new Promise((resolve, reject) => {
      addLevelMutationBack.mutate(
        {
          category: subject,
          lessonId: selectedLesson
        },
        {
          onSuccess: async (res) => {
            toast.success(res.message);

            await fetchLessonsData();
            closePopup && closePopup();
            resolve();
          },
          onError: reject,
        }
      );
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
      className="relative border w-full h-auto m-auto bg-[#111827] border-[#56EBFF] rounded-2xl p-5 sm:p-8 shadow-lg">
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
                    flex flex-col font-exo text-white h-auto
                    ${
                      selectedLesson === ""
                        ? "opacity-30 pointer-events-none"
                        : ""
                    }`}>
        {/*  Buttons Row */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 w-full sm:w-[70%] mx-auto">

          <button
            type="submit"
            className="p-2 text-lg rounded-xl w-full sm:w-[45%] bg-[#4CAF50] hover:bg-[#45a049] hover:scale-105 transition-all duration-300 cursor-pointer"
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
