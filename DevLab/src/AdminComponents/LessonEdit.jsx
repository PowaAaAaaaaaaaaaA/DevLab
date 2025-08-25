
import { getDoc, doc, setDoc, deleteDoc} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function LessonEdit({ subject, lessonId, levelId, stageId }) {

  const gameModes = ["Lesson", "BugBust", "CodeRush", "CodeCrafter", "BrainBytes"];

  const [activeTab, setActiveTab] = useState("Lesson");
  const [stageData, setStageData] = useState();

  const fetchStage = async () => {
    const stageRef = doc(db, subject, lessonId, "Levels", levelId, "Stages", stageId);
    const stageSnap = await getDoc(stageRef);
    if (stageSnap.exists()) {
      setStageData(stageSnap.data());
      setActiveTab(stageSnap.data().type || "Lesson");
    } else {
      setStageData(null);
    }
  };

  const [instruction, setInstruction] = useState('');
  const [description, setDescription] = useState('');
  const [gameModeTitle, setTitle] = useState('');
  const [preCode, setPreCode] = useState('');
  const [hint, setHint] = useState('');
  const [timer, setTimer] = useState('');
  const [answers, setAnswers] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
    correct: ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const stageRef = doc(db, subject, lessonId, "Levels", levelId, "Stages", stageId);
      let stagePayload = {
        type: activeTab,
        title: gameModeTitle || stageData?.title || null,
        description: description || stageData?.description || null,
        instruction: instruction || stageData?.instruction || null,
        preCode: preCode || stageData?.preCode || null,
      };

      if (activeTab === "BugBust" || activeTab === "CodeCrafter") {
        stagePayload = {
          ...stagePayload,
          hint: hint || stageData?.hint || null,
        };
      }
      if (activeTab === "CodeRush") {
        stagePayload = {
          ...stagePayload,
          hint: hint || stageData?.hint || null,
          timer: timer || stageData?.timer || null,
        };
      }
      if (activeTab === "BrainBytes") {
        stagePayload = {
          ...stagePayload,
          options: {
            A: answers.A || stageData?.options?.A,
            B: answers.B || stageData?.options?.B,
            C: answers.C || stageData?.options?.C,
            D: answers.D || stageData?.options?.D,
          },
          correctAnswer: answers.correct || stageData?.correctAnswer,
        };
      }

      await setDoc(stageRef, stagePayload, { merge: true });

      toast.success("Stage updated successfully!", {
        position: "top-center",
        theme: "colored"
      });

      await fetchStage();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStage();
  }, []);

    // Delete stage
  const handleDelete = async () => {
    try {
      const stageRef = doc(db,subject,lessonId,"Levels",levelId,"Stages",stageId);
      await deleteDoc(stageRef);
      toast.success('Stage deleted successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete stage.');
    }
  };
  console.log(subject)

  return (
    <div className='bg-[#25293B]'>
      <div className='h-auto p-5 flex flex-col gap-s'>
        {/* Buttons */}
        <div className=''>
          <h1 className='font-exo text-white text-[1.5rem]'>Select Stage Type</h1>
          <div className='flex justify-around mt-5 mb-5'>
            {gameModes.map((gm) => (
              <button
                key={gm}
                className={`font-exo text-white text-[0.8rem] font-bold p-2 w-[17%] rounded-3xl bg-[#7F5AF0] hover:cursor-pointer transition duration-500 ${activeTab === gm
                  ? "bg-[#563f99]"
                  : "hover:scale-110"}`}
                onClick={() => setActiveTab(gm)}>
                {gm}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          action=""
          className='h-[100%] flex flex-col  p-4 gap-5 justify-center'>
          {/* Stage Title */}
          <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
            <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Stage Title:</h1>
            <textarea
              onChange={(e) => setTitle(e.target.value)}
              className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
              placeholder={stageData?.title || 'Enter stage title here.'}
            ></textarea>
          </div>
          {/* Stage Description */}
          <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
            <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Stage Description:</h1>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
              placeholder={stageData?.title || 'Enter stage title here.'}
            ></textarea>
          </div>
          {/* Instruction */}
          <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
            <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Instruction:</h1>
            <textarea
              onChange={(e) => setInstruction(e.target.value)}
              className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
              placeholder={stageData?.description || 'Enter instructions for this stage.'}
            ></textarea>
          </div>

          {/* PreCode, Hint, Timer, Answers stay the same */}
          {activeTab === "Lesson" ? (
            <>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea
                  onChange={(e) => setPreCode(e.target.value)}
                  className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                  placeholder={stageData?.preCode || 'Enter initial code setup here.'}
                ></textarea>
              </div>
            </>
          ) : activeTab === "BugBust" ? (
            <>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea
                  onChange={(e) => setPreCode(e.target.value)}
                  className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                  placeholder={stageData?.preCode || 'Enter initial code setup here.'}
                ></textarea>
              </div>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Hint:</h1>
                <textarea
                  onChange={(e) => setHint(e.target.value)}
                  className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                  placeholder={stageData?.hint || 'Provide a hint for debugging here.'}
                ></textarea>
              </div>
            </>
          ) : activeTab === "CodeRush" ? (
            <>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea
                  onChange={(e) => setPreCode(e.target.value)}
                  className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                  placeholder={stageData?.preCode || 'Enter initial code setup here.'}
                ></textarea>
              </div>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827] flex flex-col gap-5'>
                <div className='h-[40%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Hint:</h1>
                  <textarea
                    onChange={(e) => setHint(e.target.value)}
                    className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                    placeholder={stageData?.hint || 'Provide a hint for this challenge.'}
                  ></textarea>
                </div>
                <div className='h-[50%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Timer: </h1>
                  <input
                    onChange={(e) => setTimer(Number(e.target.value))}
                    type="number"
                    className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none text-5xl'
                    placeholder={stageData?.timer || 'Enter Seconds'}
                  />
                </div>
              </div>
            </>
          ) : activeTab === "CodeCrafter" ? (
            <>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827]'>
                <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Coding Interface:</h1>
                <textarea
                  onChange={(e) => setPreCode(e.target.value)}
                  className='w-[100%] h-[80%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                  placeholder={stageData?.preCode || 'Enter initial code setup here.'}
                ></textarea>
              </div>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827] flex flex-col gap-5'>
                <div className='h-[40%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Hint: </h1>
                  <textarea
                    onChange={(e) => setHint(e.target.value)}
                    className='w-[100%] h-[70%] p-4 text-white bg-[#0d13207c] rounded-2xl focus:border-cyan-500 border border-gray-700  focus:outline-none resize-none'
                    placeholder={stageData?.hint || 'Provide a hint for this challenge.'}
                  ></textarea>
                </div>
                <div className='h-[50%]'>
                  <h1 className='font-exo text-white text-[2rem] mb-[10px]'>Replicate (Optional): </h1>
                  <div className='border h-[70%] rounded-2xl bg-[#0d13207c] border-gray-700'></div>
                </div>
              </div>
            </>
          ) : activeTab === "BrainBytes" ? (
            <>
              <div className='border-cyan-400 border rounded-2xl w-[100%] h-[20%] p-4 bg-[#111827] flex flex-col justify-around gap-4'>
                <input
                  onChange={(e) => setAnswers(prev => ({ ...prev, A: e.target.value }))}
                  type="text"
                  placeholder={`A: ${stageData?.options?.A}`}
                  className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'
                />
                <input
                  onChange={(e) => setAnswers(prev => ({ ...prev, B: e.target.value }))}
                  type="text"
                  placeholder={`B: ${stageData?.options?.B}`}
                  className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'
                />
                <input
                  onChange={(e) => setAnswers(prev => ({ ...prev, C: e.target.value }))}
                  type="text"
                  placeholder={`C: ${stageData?.options?.C}`}
                  className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'
                />
                <input
                  onChange={(e) => setAnswers(prev => ({ ...prev, D: e.target.value }))}
                  type="text"
                  placeholder={`D: ${stageData?.options?.D}`}
                  className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'
                />
                <input
                  onChange={(e) => setAnswers(prev => ({ ...prev, correct: e.target.value }))}
                  type="text"
                  placeholder={`Correct Answer: ${stageData?.correctAnswer}`}
                  className='border h-[15%] rounded-2xl border-gray-700 bg-[#0d13207c] p-2 text-white font-exo focus:border-cyan-500 focus:outline-none'
                />
              </div>
            </>
          ) : null}

          {/* Delete and Save Buttons */}
          <div className='w-[95%] flex justify-between p-5 items-center'>
            <button
            type="button"
              onClick={handleDelete}
              className='font-exo font-bold text-1xl text-white w-[30%] p-2 rounded-4xl bg-[#E35460] hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(255,99,71,0.8)]'>
              Delete
            </button>
          </div>

          <button
            onClick={handleSave}
            className='w-[30%] h-[3%] p-1 self-center rounded-2xl bg-[#5FDC70] text-white font-exo font-bold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(95,220,112,0.8)]'>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default LessonEdit;
