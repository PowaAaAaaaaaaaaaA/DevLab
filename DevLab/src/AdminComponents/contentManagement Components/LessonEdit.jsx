// Firestore
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../Firebase/Firebase";
// Utils
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useEditStage from "./Edit_Forms/useEditStage";
import axios from "axios";

import {useDeleteStage} from "./BackEndFuntions/useDeleteStage"
// GameMode Forms
import CodeRushForm from "./Edit_Forms/CodeRushForm";
import CodeCrafterForm from "./Edit_Forms/CodeCrafterForm";
import BugBustForm from "./Edit_Forms/BugbustForm";
import BrainBytesForm from "./Edit_Forms/BrainBytesForm";
import LessonForm from "./Edit_Forms/LessonForm";

function LessonEdit({ subject, lessonId, levelId, stageId,setShowForm }) {
  const gameModes = ["Lesson", "BugBust", "CodeRush", "CodeCrafter", "BrainBytes"];
  const { state, dispatch } = useEditStage();

  // Local state instead of Zustand
  const [stageData, setStageData] = useState(null);
  const [activeTab, setActiveTab] = useState("Lesson");

// Fetch stage
useEffect(() => {
  fetchStage();
}, [subject, lessonId, levelId, stageId]);

// Sync active tab with Firestore type
useEffect(() => {
  if (stageData?.type) {
    setActiveTab(stageData.type);
    console.log(stageData.type);
    dispatch({ type: "UPDATE_FIELD", field: "type", value: stageData.type });
  }
}, [stageData]);


//
const deleteStageMutation = useDeleteStage(subject, lessonId, levelId);

  const fetchStage = async () => {

    try {
      const stageRef = doc(db, subject, lessonId, "Levels", levelId, "Stages", stageId);
      const stageSnap = await getDoc(stageRef);

      if (stageSnap.exists()) {
        const data = stageSnap.data();
        setStageData(data);
      } else {
        setStageData(null);
      }
    } catch (error) {
      console.error("Failed to fetch stage:", error);
    }
  };

  useEffect(() => {
    fetchStage();
  }, [subject, lessonId, levelId, stageId]);
// 
  useEffect(() => {
    if (state.type === "") {
      dispatch({
        type: "UPDATE_FIELD",
        field: "isHidden",
        value: stageData?.type !== "Lesson",
      });
    }
  }, [state.type]);

useEffect(() => {
    dispatch({
      type: "UPDATE_ALL_FIELDS",
      payload: {
        title: stageData?.title || "",
        description: stageData?.description || "",
        isHidden: stageData?.isHidden || "",
        type: stageData?.type || "",
        instruction: stageData?.instruction   || "",
        codingInterface: stageData?.codingInterface || "",
        hint : stageData?.hint || "",
        timer: stageData?.timer||  "",
        choices: stageData?.choices || [],
        blocks: stageData?.blocks || [],
        copyCode: stageData?.copyCode || "",
      },
    });
  }, [stageData]);

const handleSave = async (e) => {
  e.preventDefault();
  try {
    const token = await auth.currentUser.getIdToken(true);
    const response = await axios.post(
      "http://localhost:8082/fireBaseAdmin/editStage",
      {
        category: subject,
        lessonId,
        levelId,
        stageId,
        stageType: state?.type || activeTab,
        state, // sending the state to backend
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-source": "mobile-app",
        },
      }
    );
    toast.success("Stage updated successfully!", {
      position: "top-center",
      theme: "colored",
    });
    await fetchStage();
  } catch (error) {
    console.error("Failed to save stage:", error);
    toast.error("Failed to save stage.");
  }
};

  return (
    <div className="bg-[#25293B]">
      <div className="h-auto p-5 flex flex-col gap-s">
        {/* Stage Type Buttons */}
        <div>
          <h1 className="font-exo text-white text-[1.5rem]">Select Stage Type</h1>
          <div className="flex justify-around mt-5 mb-5">
            {gameModes.map((gm) => (
              <button
                key={gm}
                className={`font-exo text-white text-[0.8rem] font-bold p-2 w-[17%] rounded-3xl bg-[#7F5AF0] hover:cursor-pointer transition duration-500 ${
                  activeTab === gm ? "bg-[#563f99]" : "hover:scale-110"
                }`}
                onClick={() => {
                  setActiveTab(gm);
                  dispatch({ type: "UPDATE_FIELD", field: "type", value: gm });
                }}
              >
                {gm}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Form */}
        <form className="h-[100%] flex flex-col p-4 gap-5 justify-center">
          {activeTab === "Lesson" && <LessonForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} subject= {subject} lessonId={lessonId} levelId={levelId} stageId={stageId} />}
          {activeTab === "BugBust" && <BugBustForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} />}
          {activeTab === "CodeRush" && <CodeRushForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} />}
          {activeTab === "CodeCrafter" && <CodeCrafterForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} subject= {subject} lessonId={lessonId} levelId={levelId} stageId={stageId}/>}
          {activeTab === "BrainBytes" && <BrainBytesForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} />}
          {/* Delete & Save */}
          <div className="w-[95%] flex justify-between p-5 items-center">
            <button
              type="button"
            onClick={() =>
                deleteStageMutation.mutate(stageId, {
                  onSuccess: () => {
                    setShowForm(false); 
                  },
                })
              }
              className="font-exo font-bold text-1xl text-white w-[30%] p-2 rounded-4xl bg-[#E35460] hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]">
              {deleteStageMutation.isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-[30%] h-[3%] p-1 self-center rounded-2xl bg-[#5FDC70] text-white font-exo font-bold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(95,220,112,0.8)]"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default LessonEdit;
