import React from "react";

function InputSelector({ block, dispatch }) {
  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_BLOCK",
      payload: {
        id: block.id,
        value: e.target.value,
      },
    });
  };

  // Special rendering for Divider block
  if (block.type === "Divider") {
    return (
      <div className="border border-dashed border-gray-600 rounded-2xl my-3 h-6 bg-[#111827] opacity-50 flex justify-center items-center">
        <p className="text-gray-400 text-xs">--- Divider ---</p>
        <button
          type="button"
          onClick={() => dispatch({ type: "REMOVE_BLOCK", id: block.id })}
          className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-xl px-2 py-0.5 text-xs"
        >
          ✕
        </button>
      </div>
    );
  }

  // Default rendering for other block types
  return (
    <div className="border border-gray-600 rounded-2xl p-3 mt-2 bg-[#111827]">
      <p className="text-white text-sm mb-2">Block Type: {block.type}</p>
      <textarea
        value={block.value}
        onChange={handleChange}
        className="w-full h-[4rem] p-2 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700 focus:outline-none resize-none"
        placeholder={`Enter content for ${block.type} block`}
      />
      <button
        type="button"
        onClick={() => dispatch({ type: "REMOVE_BLOCK", id: block.id })}
        className="mt-2 bg-red-500 hover:bg-red-600 text-white rounded-xl px-3 py-1 text-sm"
      >
        Remove
      </button>
    </div>
  );
}

export default InputSelector;
