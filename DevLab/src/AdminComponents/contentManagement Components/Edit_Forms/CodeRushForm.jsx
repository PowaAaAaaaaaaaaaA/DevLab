


export default function CodeRushForm({stageData, state, dispatch ,activeTab}) {


  return (
    <>
      {/* Stage Title */}
      <div className="border-cyan-400 border rounded-2xl w-full h-[20%] p-4 bg-[#111827]">
        <h1 className="font-exo text-white text-[2rem] mb-[10px]">Stage Title:</h1>
        <textarea
          value={state.title || stageData?.title || ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_FIELD", field: "title", value: e.target.value })
          }
          className="w-full h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl 
                    focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
          placeholder="Enter stage title here."
        />
      </div>

      {/* Stage Description */}
      <div className="border-cyan-400 border rounded-2xl w-full h-[20%] p-4 bg-[#111827]">
        <h1 className="font-exo text-white text-[2rem] mb-[10px]">Stage Description:</h1>
        <textarea
          value={state.description || stageData?.description || ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_FIELD", field: "description", value: e.target.value })
          }
          className="w-full h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl 
                    focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
          placeholder="Enter stage description here."
        />
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

      {/* Coding Interface */}
      <div className="border-cyan-400 border rounded-2xl w-full h-[20%] p-4 bg-[#111827]">
        <h1 className="font-exo text-white text-[2rem] mb-[10px]">Coding Interface:</h1>
        <textarea
          value={state.codingInterface || stageData?.codingInterface || ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_FIELD", field: "codingInterface", value: e.target.value })
          }
          className="w-full h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl 
                    focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
          placeholder="Enter initial code setup here."
        />
      </div>

      {/* Hint + Timer */}
      <div className="border-cyan-400 border rounded-2xl w-full p-4 bg-[#111827] flex flex-col gap-5">
        {/* Timer */}
        <div className="h-[50%]">
          <h1 className="font-exo text-white text-[2rem] mb-[10px]">Timer (seconds):</h1>
          <input
            value={state.timer || stageData?.timer || ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIELD", field: "timer", value: Number(e.target.value) })
            }
            type="number"
            className="w-full h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl 
                      focus:border-cyan-500 border border-gray-700 focus:outline-none text-5xl"
            placeholder="Timer."
          />
        </div>
      </div>
    </>
  );
}
