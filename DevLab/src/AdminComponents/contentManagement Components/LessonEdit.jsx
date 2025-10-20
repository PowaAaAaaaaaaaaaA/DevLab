// Firestore
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../Firebase/Firebase";
// Utils
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useEditStage from "./Edit_Forms/useEditStage";
import axios from "axios";
import { useDeleteStage } from "./BackEndFuntions/useDeleteStage";
// GameMode Forms
import CodeRushForm from "./Edit_Forms/CodeRushForm";
import CodeCrafterForm from "./Edit_Forms/CodeCrafterForm";
import BugBustForm from "./Edit_Forms/BugbustForm";
import BrainBytesForm from "./Edit_Forms/BrainBytesForm";
import LessonForm from "./Edit_Forms/LessonForm";

function LessonEdit({ subject, lessonId, levelId, stageId, setShowForm }) {
  const gameModes = ["Lesson", "BugBust", "CodeRush", "CodeCrafter", "BrainBytes"];
  const { state, dispatch } = useEditStage();

  const [stageData, setStageData] = useState(null);
  const [activeTab, setActiveTab] = useState("Lesson");

  // Fetch stage
  useEffect(() => {
    fetchStage();
  }, [subject, lessonId, levelId, stageId]);

  useEffect(() => {
    if (stageData?.type) {
      setActiveTab(stageData.type);
      dispatch({ type: "UPDATE_FIELD", field: "type", value: stageData.type });
    }
  }, [stageData]);

  const deleteStageMutation = useDeleteStage(subject, lessonId, levelId);

  const fetchStage = async () => {
    try {
      const stageRef = doc(db, subject, lessonId, "Levels", levelId, "Stages", stageId);
      const stageSnap = await getDoc(stageRef);
      if (stageSnap.exists()) {
        setStageData(stageSnap.data());
      } else {
        setStageData(null);
      }
    } catch (error) {
      console.error("Failed to fetch stage:", error);
    }
  };

  useEffect(() => {
    dispatch({
      type: "UPDATE_ALL_FIELDS",
      payload: {
        title: stageData?.title || "",
        description: stageData?.description || "",
        isHidden: stageData?.isHidden ?? activeTab !== "Lesson",
        type: stageData?.type || "",
        instruction: stageData?.instruction || "",
        codingInterface: stageData?.codingInterface || { html: "", css: "", js: "",sql:"" },
        hint: stageData?.hint || "",
        timer: stageData?.timer || "",
        choices: stageData?.choices || [],
        blocks: stageData?.blocks || [],
        copyCode: stageData?.copyCode || "",
      },
    });
  }, [stageData, activeTab]);

  // Filter function for game mode
  const filterStateByGameMode = (state, activeTab) => {
    const common = {
      title: state.title,
      description: state.description,
      isHidden: state.isHidden,
      type: activeTab,
      instruction: state.instruction,
      codingInterface: state.codingInterface,
    };

    switch (activeTab) {
      case "Lesson":
        return { ...common, blocks: state.blocks };
      case "BugBust":
        return { ...common, hint: state.hint };
      case "CodeRush":
        return { ...common, timer: state.timer };
      case "BrainBytes":
        return { ...common, choices: state.choices };
      case "CodeCrafter":
        return { ...common, copyCode: state.copyCode };
      default:
        return common;
    }
  };

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken(true);
      const hasImages = state.blocks?.some(
        (block) => block.type === "Image" && block.value instanceof File
      );

      // Automatically set isHidden
      const updatedState = { ...state, isHidden: activeTab === "Lesson" ? false : true };

      let response;

      if (!hasImages) {
        // JSON save
        const filteredState = filterStateByGameMode(updatedState, activeTab);
        response = await axios.post(
          "http://localhost:8082/fireBaseAdmin/editStage",
          {
            category: subject,
            lessonId,
            levelId,
            stageId,
            state: filteredState,
            stageType: state?.type || activeTab,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-source": "web",
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // FormData save
        const formData = new FormData();
        formData.append("category", subject);
        formData.append("lessonId", lessonId);
        formData.append("levelId", levelId);
        formData.append("stageId", stageId);
        formData.append("stageType", state?.type || activeTab);

        const processedBlocks = state.blocks.map((block, index) => {
          if (block.type === "Image" && block.value instanceof File) {
            const fileType = block.value.type.split("/")[1] || "png";
            const fieldName = `image_${block.id || index + 1}`;
            formData.append(fieldName, block.value, `image_${block.id || index + 1}.${fileType}`);
            return { ...block, value: fieldName };
          }
          return block;
        });

        const filteredState = filterStateByGameMode(
          { ...updatedState, blocks: processedBlocks },
          activeTab
        );
        formData.append("state", JSON.stringify(filteredState));

        response = await axios.post(
          "http://localhost:8082/fireBaseAdmin/editStage",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-source": "web",
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Stage updated successfully!", { position: "top-center", theme: "colored" });
      await fetchStage();
    } catch (error) {
      console.error("Failed to save stage:", error);
      toast.error("Failed to save stage.");
    }
  };

  return (
    <div className="bg-[#25293B]">
      <div className="h-auto p-5 flex flex-col gap-s">
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

        <form className="h-[100%] flex flex-col p-4 gap-5 justify-center">
          {activeTab === "Lesson" && (
            <LessonForm
              state={state}
              dispatch={dispatch}
              stageData={stageData}
              activeTab={activeTab}
              subject={subject}
              lessonId={lessonId}
              levelId={levelId}
              stageId={stageId}
            />
          )}
          {activeTab === "BugBust" && (
            <BugBustForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} />
          )}
          {activeTab === "CodeRush" && (
            <CodeRushForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} />
          )}
          {activeTab === "CodeCrafter" && (
            <CodeCrafterForm
              state={state}
              dispatch={dispatch}
              stageData={stageData}
              activeTab={activeTab}
              subject={subject}
              lessonId={lessonId}
              levelId={levelId}
              stageId={stageId}
            />
          )}
          {activeTab === "BrainBytes" && (
            <BrainBytesForm state={state} dispatch={dispatch} stageData={stageData} activeTab={activeTab} />
          )}

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
              className="font-exo font-bold text-1xl text-white w-[30%] p-2 rounded-4xl bg-[#E35460] hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]"
            >
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
