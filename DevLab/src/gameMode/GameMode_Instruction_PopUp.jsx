import React from 'react'

function GameMode_Instruction_PopUp({ title, message, onClose, buttonText}) {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/80">
        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl">
            <h2 className="text-4xl font-bold text-[#9333EA] mb-4 font-exo">{title}</h2>
            <p className="text-gray-700 mb-6 font-medium whitespace-pre-line font-exo">{message}</p>
        <button
            onClick={onClose}
            className="bg-[#9333EA] text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition duration-300">
            {buttonText}
        </button>
        </div>
    </div>
);
}

export default GameMode_Instruction_PopUp