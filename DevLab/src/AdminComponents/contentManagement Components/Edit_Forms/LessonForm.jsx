import React, { useState } from "react";
import InputSelector from "./InputSelector";
import TestDropDownMenu from "./TestDropDownMenu";

import { auth } from "../../../Firebase/Firebase";
import axios from "axios";



function LessonForm({stageData, state, dispatch,activeTab, subject, lessonId, levelId, stageId }) {


  const lastBlockId = state.blocks?.length
    ? state.blocks[state.blocks.length - 1].id
    : 0;

  const [selectedItem, setSelectedItem] = useState("");

const addBlocks = () => {
  if (!selectedItem) return;

  // Compute max ID dynamically
  const maxId = state.blocks.length
    ? Math.max(...state.blocks.map((b) => b.id))
    : 0;

  const newId = maxId + 1;

  dispatch({
    type: "ADD_BLOCK",
    payload: {
      id: newId,
      type: selectedItem,
      value: "",
    },
  });

  setSelectedItem("");
};


  
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);

    try {
      const token = await auth.currentUser.getIdToken(true);
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("category", subject);
      formData.append("lessonId", lessonId);
      formData.append("levelId", levelId);
      formData.append("stageId", stageId);

      const res = await axios.post(
        `
https://devlab-server-railway-production.up.railway.app/fireBaseAdmin/uploadVideo`,
        formData,
        {
          headers: {
            "x-source": "mobile-app",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideoUrl(res.data.url);

      // Update state so Save button has it
      dispatch({ type: "UPDATE_FIELD", field: "videoPresentation", value: res.data.url });
    } catch (err) {
      console.error("Video upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Stage Title */}
      <div className="border-cyan-400 border rounded-2xl w-full h-[20%] p-4 bg-[#111827]">
        <h1 className="font-exo text-white text-[2rem] mb-[10px]">Stage Title:</h1>
        <textarea
          value={state.title || stageData?.title || ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_FIELD", field: "title", value: e.target.value || stageData?.title  })
          }
          className="w-full h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl 
                    focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
          placeholder="Enter stage title here."
        />
      </div>

      {/* Description */}
      <div className="border-cyan-400 border rounded-2xl w-full p-4 bg-[#111827] mt-4">
        <h1 className="font-exo text-white text-[1.5rem] mb-2">Description:</h1>
        <textarea
          value={state.description || ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_FIELD", field: "description", value: e.target.value })
          }
          className="w-full h-[5rem] p-3 text-white bg-[#0d13207c] rounded-2xl 
          focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
          placeholder="Enter lesson description here."
        />
      </div>

      {/* Coding Interface */}
{/* Coding Interface Section */}
<div className="border-cyan-400 border rounded-2xl w-full p-4 bg-[#111827] mt-4">
  <h1 className="font-exo text-white text-[2rem] mb-[10px]">Coding Interface</h1>

  {/* HTML */}
  <div className="mt-4">
    <h2 className="font-exo text-white text-lg mb-2">HTML:</h2>
    <textarea
      value={state.codingInterface.html || ""}
      onChange={(e) =>
        dispatch({
          type: "UPDATE_CODING_INTERFACE",
          field: "html",
          value: e.target.value,
        })
      }
      className="w-full h-[6rem] p-3 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
      placeholder="Enter HTML code here..."
    />
  </div>

  {/* CSS */}
  <div className="mt-4">
    <h2 className="font-exo text-white text-lg mb-2">CSS:</h2>
    <textarea
      value={state.codingInterface.css || ""}
      onChange={(e) =>
        dispatch({
          type: "UPDATE_CODING_INTERFACE",
          field: "css",
          value: e.target.value,
        })
      }
      className="w-full h-[6rem] p-3 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
      placeholder="Enter CSS code here..."
    />
  </div>

  {/* JS */}
  <div className="mt-4">
    <h2 className="font-exo text-white text-lg mb-2">JavaScript:</h2>
    <textarea
      value={state.codingInterface.js || ""}
      onChange={(e) =>
        dispatch({
          type: "UPDATE_CODING_INTERFACE",
          field: "js",
          value: e.target.value,
        })
      }
      className="w-full h-[6rem] p-3 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
      placeholder="Enter JavaScript code here..."
    />
  </div>
    <div className="mt-4">
    <h2 className="font-exo text-white text-lg mb-2">SQL:</h2>
    <textarea
      value={state.codingInterface.sql || ""}
      onChange={(e) =>
        dispatch({
          type: "UPDATE_CODING_INTERFACE",
          field: "sql",
          value: e.target.value,
        })
      }
      className="w-full h-[6rem] p-3 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
      placeholder="Enter SQL code here..."
    />
  </div>
</div>


      {/* Instruction */}
      <div className="border-cyan-400 border rounded-2xl w-full h-[20%] p-4 bg-[#111827]">
        <h1 className="font-exo text-white text-[2rem] mb-[10px]">Instruction:</h1>
        <textarea
          value={state.instruction || stageData?.instruction || ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_FIELD", field: "instruction", value: e.target.value })
          }
          className="w-full h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl 
                    focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
          placeholder="Enter instructions for this stage."
        />
      </div>
{/* Video Upload Section */}
    <div className="border-cyan-400 border rounded-2xl w-full p-4 bg-[#111827] flex flex-col gap-3">
      <h1 className="font-exo text-white text-[1.5rem]">Upload Video (Optional):</h1>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
        className="text-white"
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="bg-[#7F5AF0] text-white rounded-lg p-2 w-max hover:scale-105 transition"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>

      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline mt-2"
        >
          View Uploaded Video
        </a>
      )}
    </div>
      {/* Add Block Section */}
      <div className="bg-slate-600 px-1 my-3 py-3 rounded-2xl">
        <div className="flex flex-row justify-between bg-[#111827] border-cyan-400 border-2 p-3 rounded-2xl">
          <TestDropDownMenu
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
        <button
          onClick={addBlocks}
          type="button"
          className="flex-row justify-center bg-[#111827] border-cyan-400 border-2 p-3 rounded-2xl mt-3 w-full text-center hover:scale-105 transition duration-300"
        >
          <span className="text-white font-exoBold text-lg">ADD A BLOCK</span>
        </button>

        <div className="mt-3">
          {state.blocks?.map((block) => (
            <InputSelector
              key={block.id}
              dispatch={dispatch}
              block={block}
              type={block.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default LessonForm;