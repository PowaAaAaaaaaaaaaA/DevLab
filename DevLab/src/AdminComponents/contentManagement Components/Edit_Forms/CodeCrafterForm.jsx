import { useState } from "react";
import axios from "axios";
  import { auth } from "../../../Firebase/Firebase";
  function CodeCrafterForm({stageData, state, dispatch,activeTab, subject, lessonId, levelId, stageId}) {

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(stageData?.replicationFile || "");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const token = await auth.currentUser.getIdToken(true);
      const formData = new FormData();
      formData.append("replicateFile", file);
      formData.append("category", subject);
      formData.append("lessonId", lessonId);
      formData.append("levelId", levelId);
      formData.append("stageId", stageId);

      const res = await axios.post("http://localhost:8082/fireBaseAdmin/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setFileUrl(res.data.url);
      // Update local state so Save button has it
      dispatch({ type: "UPDATE_FIELD", field: "replicationFile", value: res.data.url });
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      setUploading(false);
    }
  };
    return (
      <>
        {/* Stage Title */}
        <div className="border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]">
          <h1 className="font-exo text-white text-[2rem] mb-[10px]">Stage Title:</h1>
          <textarea
          value={(stageData?.type === activeTab ? stageData?.title : "")}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIELD", field: "title", value: e.target.value })
            }
            className="w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
            placeholder="Enter stage title here."
          />
        </div>
        {/* Stage Description */}
        <div className="border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]">
          <h1 className="font-exo text-white text-[2rem] mb-[10px]">Stage Description:</h1>
          <textarea
            value={state.description || stageData?.description || ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIELD", field: "description", value: e.target.value })
            }
            className="w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
            placeholder="Enter stage description here."
          />
        </div>

        {/* Instruction */}
        <div className="border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]">
          <h1 className="font-exo text-white text-[2rem] mb-[10px]">Instruction:</h1>
          <textarea
            value={state.instruction || stageData?.instruction || ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIELD", field: "instruction", value: e.target.value })
            }
            className="w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
            placeholder="Enter instructions for this stage."
          />
        </div>
        {/* Coding Interface */}
        <div className="border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]">
          <h1 className="font-exo text-white text-[2rem] mb-[10px]">Coding Interface:</h1>
          <textarea
            value={state.codingInterface || stageData?.codingInterface || ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIELD", field: "codingInterface", value: e.target.value })
            }
            className="w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
            placeholder="Enter initial code setup here."
          />
        </div>
        {/* Hint & Replicate */}
        <div className="border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827] flex flex-col gap-5">
      {/* Replicate (Optional) */}
      <div className="border-cyan-400 border rounded-2xl w-[100%] h-auto p-4 bg-[#111827] flex flex-col gap-5">
        <h1 className="font-exo text-white text-[2rem] mb-[10px]">Replicate (Optional):</h1>
        <input 
          type="file" 
          accept=".html" 
          onChange={handleFileChange} 
          className="text-white"/>
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="bg-[#7F5AF0] text-white rounded-lg p-2 hover:scale-105 transition">
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline mt-2">
            View Uploaded File
          </a>
        )}
      </div>
        </div>
      </>
    );
  }

  export default CodeCrafterForm;
